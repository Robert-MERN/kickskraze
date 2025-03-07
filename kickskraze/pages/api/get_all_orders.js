import mongoose from "mongoose";
import Orders from "@/models/order_model";
import Products from "@/models/product_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from "@/utils/functions/produc_fn";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    console.log("Connecting with DB");
    try {
        // Connect to MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        let query = { isDeleted: false };
        const { status, status_not } = req.query;

        if (status_not) {
            query.status = { $ne: status_not };
        }

        if (status) {
            query.status = status;
        }




        // Fetch all orders
        const orders = await Orders.find(query).sort({ createdAt: -1 });

        // Collect all product IDs from purchase objects
        const allProductIds = orders.flatMap(order => order.purchase.map(item => item._id));

        // Convert product IDs to MongoDB ObjectId format
        const objectIds = allProductIds.map(id => new mongoose.Types.ObjectId(id));

        // Fetch all products in a single query
        const products = await Products.find({ _id: { $in: objectIds } });

        // Create a Map for quick product lookup
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // Replace purchase product IDs with actual product objects, preserving quantity
        const updatedOrders = orders.map(order => ({
            ...order.toObject(),
            purchase: order.purchase.map(item => ({
                ...productMap.get(item._id.toString()) || null, // Replace ID with actual product
                quantity: item.quantity // Keep the quantity
            })).filter(item => item.product !== null) // Remove any products that were not found
        }));

        updatedOrders.map(order => {
            order.subtotal_amount = calc_total_amount(order.purchase);
            order.total_amount = calc_gross_total_amount(order);
            order.total_items = calc_total_items(order.purchase);
            return order;
        });

        // Send updated orders response
        return res.status(200).json(updatedOrders);

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}