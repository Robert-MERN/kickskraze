import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
import mongoose from "mongoose";
import {
    hasSufficientStock,
    hydrateOrder,
    decrementStock,
} from "@/utils/functions/order_variant_helpers"; // or paste helpers directly in this file

import { select_store_name } from "@/utils/functions/product_fn"; //  ⬅ NEW

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    let order;
    console.log("Connecting with DB");
    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        const purchase = req.body.purchase || [];
        if (!purchase.length) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // 1) Fetch all products for items in purchase
        const allProductIds = purchase.map(item => new mongoose.Types.ObjectId(item._id));
        const products = await Products.find({ _id: { $in: allProductIds } });
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // 2) Check stock for each item (variant-aware)
        const availablePurchase = purchase.filter(item => {
            const product = productMap.get(item._id.toString());
            return hasSufficientStock(product, item);
        });

        if (!availablePurchase.length) {
            return res.status(400).json({
                success: false,
                message: "Items are not in stock. Remove item(s) from your cart.",
            });
        }

        // If some items are unavailable, keep only available ones in the order
        if (availablePurchase.length < purchase.length) {
            req.body.purchase = availablePurchase;
        }

        // 🔥 NEW IMPORTANT UPDATE — store_name becomes dynamic array
        req.body.store_name = select_store_name(
            availablePurchase.map(item => productMap.get(item._id.toString()))
        ); // ⬅ THIS FIXES STORE NAME PROBLEM

        // 3) Create + save order
        order = new Orders(req.body);
        await order.save();

        // 4) Hydrate order with live product + variant info (for email & response)
        const hydratedOrder = hydrateOrder(order, productMap);

        // 5) Send confirmation email
        const response = await send_confirm_mail(res, hydratedOrder, "create");

        if (response.message === "mail-sent") {
            // 6) Decrement stock (variant-aware)
            await Promise.all(
                req.body.purchase.map(item => decrementStock(item))
            );

            await csvQueue.add("updateCSV", {});
            return res.status(200).json(hydratedOrder);
        }

        // Email failed → delete order
        await Orders.findByIdAndDelete(order._id);
        return res.status(500).json({ success: false, message: "Order couldn't be created!" });

    } catch (err) {
        if (order && order._id) {
            await Orders.findByIdAndDelete(order._id);
        }
        return res.status(501).json({ success: false, message: err.message });
    }
}
