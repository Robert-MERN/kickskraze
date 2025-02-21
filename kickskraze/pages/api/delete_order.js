import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import mongoose from 'mongoose';

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
    console.log("Connecting with DB");

    try {
        // Connecting to MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { order_id } = req.query;

        // Validate order ID
        if (!order_id) {
            return res.status(400).json({ success: false, message: "Order ID is not provided" });
        } else if (!mongoose.isValidObjectId(order_id)) {
            return res.status(400).json({ success: false, message: "Order ID is invalid" });
        }

        // Fetch the order
        const order = await Orders.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Restore stock for each product in the order
        for (const { _id, quantity } of order.purchase) {
            await Products.findByIdAndUpdate(_id, { $inc: { stock: quantity } }, { new: true });
        }

        // Delete the order
        await Orders.findByIdAndDelete(order_id);

        // Enqueue CSV update
        await csvQueue.add("updateCSV", {});

        return res.status(200).json({ success: true, message: "Order has been deleted and stock updated." });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
