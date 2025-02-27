import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from '@/utils/functions/produc_fn';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
import mongoose from "mongoose";


/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    let order;
    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");

        order = new Orders(req.body);

        await order.save();


        // Extract product IDs from purchase array
        const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));

        // Fetch all products in one query
        const products = await Products.find({ _id: { $in: allProductIds } });

        // Convert product list to a Map for quick lookup
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // Replace product IDs with actual product objects while keeping quantity
        order = {
            ...order.toObject(),
            purchase: order.purchase.map(item => ({
                ...productMap.get(item._id.toString()) || null,
                quantity: item.quantity
            })).filter(item => item.product !== null) // Remove missing products
        };


        order.subtotal_amount = calc_total_amount(order.purchase);
        order.total_amount = calc_gross_total_amount(order);
        order.total_items = calc_total_items(order.purchase);


        const response = await send_confirm_mail(res, order, "create");

        if (response.message === "mail-sent") {
            await Promise.all(order.purchase.map((product) => {
                const stock = product.stock - product.quantity
                return Products.findByIdAndUpdate(product._id, { stock: stock < 1 ? 0 : stock })
            }));

            await csvQueue.add("updateCSV", {}); // Enqueue CSV update
            // sending success response to client
            return res.status(200).json(order);
        }

        await Orders.findByIdAndDelete(order._id);
        return res.status(500).json({ success: false, message: "Order couldn't be created!" });

    } catch (err) {

        // if server catches any error
        await Orders.findByIdAndDelete(order._id);
        return res.status(501).json({ success: false, message: err.message });
    }

}