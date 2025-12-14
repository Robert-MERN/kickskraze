import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
import mongoose from 'mongoose';
import {
    hydrateOrder,
    incrementStock,
} from "@/utils/functions/order_variant_helpers";

import { select_store_name } from "@/utils/functions/product_fn"; //  ⬅ NEW

export default async function handler(req, res) {
    console.log("Connecting with DB");

    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { order_id, cancel_order } = req.query;

        if (!order_id) {
            return res.status(400).json({ success: false, message: "Order ID is not provided" });
        } else if (!mongoose.isValidObjectId(order_id)) {
            return res.status(400).json({ success: false, message: "Order ID is invalid" });
        }

        const order = await Orders.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // =============================== DELETE + STOCK RESTORE CASE ===============================
        if (cancel_order === "true") {

            // 1) Restore stock for all purchased items
            for (const item of order.purchase) {
                await incrementStock(item);
            }

            // 2) Remove order from DB
            await Orders.findByIdAndDelete(order_id);

            // 3) Fetch live products to hydrate email contents
            const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));
            const products = await Products.find({ _id: { $in: allProductIds } });
            const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

            // 4) Hydrate updated order with latest data
            const updatedOrder = hydrateOrder(order, productMap);

            // 🔥 Update store_name array dynamically before mailing
            updatedOrder.store_name = select_store_name(updatedOrder.purchase);

            await send_confirm_mail(res, updatedOrder, "delete");
            await csvQueue.add("updateCSV", {});
            return res.status(200).json({ success: true, message: "Order cancelled and removed." });
        }

        // =============================== SOFT DELETE ONLY ===============================
        else {
            await Orders.findByIdAndUpdate(order_id, { isDeleted: true }, { new: true });
            await csvQueue.add("updateCSV", {});
            return res.status(200).json({ success: true, message: "Order has been moved to trashed." });
        }


    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
