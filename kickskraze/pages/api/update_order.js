import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from '@/utils/functions/produc_fn';
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

        const { purchase } = req.body;

        // If purchase is empty, delete the order and restore stock
        if (!purchase || purchase.length === 0) {
            for (const item of order.purchase) {
                await Products.findByIdAndUpdate(item._id, { $inc: { stock: item.quantity } });
            }
            await Orders.findByIdAndDelete(order_id);
            await csvQueue.add("updateCSV", {}); // Enqueue CSV update

            return res.status(200).json({ success: true, message: "Order has been deleted and stock updated." });
        }

        // Handle removed items (restore stock for removed products)
        const removedItems = order.purchase.filter(
            oldItem => !purchase.some(newItem => String(newItem._id) === String(oldItem._id))
        );

        for (const item of removedItems) {
            await Products.findByIdAndUpdate(item._id, { $inc: { stock: item.quantity } });
        }

        // Update the order
        const updatedOrder = await Orders.findByIdAndUpdate(order_id, req.body, { new: true });


        // Extract product IDs from purchase array
        const allProductIds = updatedOrder.purchase.map(item => new mongoose.Types.ObjectId(item._id));

        // Fetch all products in one query
        const products = await Products.find({ _id: { $in: allProductIds } });

        // Convert product list to a Map for quick lookup
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // Replace product IDs with actual product objects while keeping quantity
        const _updatedOrder = {
            ...updatedOrder.toObject(),
            purchase: updatedOrder.purchase.map(item => ({
                ...productMap.get(item._id.toString()) || null,
                quantity: item.quantity
            })).filter(item => item.product !== null) // Remove missing products
        };

        _updatedOrder.subtotal_amount = calc_total_amount(_updatedOrder.purchase);
        _updatedOrder.total_amount = calc_gross_total_amount(_updatedOrder);
        _updatedOrder.total_items = calc_total_items(_updatedOrder.purchase);


        await csvQueue.add("updateCSV", {}); // Enqueue CSV update

        return res.status(200).json({ success: true, message: "Order has been successfully updated.", order: _updatedOrder });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
