import Orders from "@/models/order_model";
import Products from "@/models/product_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from "@/utils/functions/produc_fn";
import mongoose from "mongoose";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
    console.log("Connecting with DB");

    try {
        // Connect to MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { order_id } = req.query;

        // Validate order_id
        if (!mongoose.Types.ObjectId.isValid(order_id)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID!" });
        }

        // Fetch the order
        const order = await Orders.findOne({ _id: new mongoose.Types.ObjectId(order_id), isDeleted: false });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        // Extract product IDs from purchase array
        const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));

        // Fetch all products in one query
        const products = await Products.find({ _id: { $in: allProductIds } });

        // Convert product list to a Map for quick lookup
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // Replace product IDs with actual product objects while keeping quantity
        const updatedOrder = {
            ...order.toObject(),
            purchase: order.purchase.map(item => ({
                ...productMap.get(item._id.toString()) || null,
                quantity: item.quantity
            })).filter(item => item.product !== null) // Remove missing products
        };

        updatedOrder.subtotal_amount = calc_total_amount(updatedOrder.purchase);
        updatedOrder.total_amount = calc_gross_total_amount(updatedOrder);
        updatedOrder.total_items = calc_total_items(updatedOrder.purchase);


        // Send the response
        return res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
