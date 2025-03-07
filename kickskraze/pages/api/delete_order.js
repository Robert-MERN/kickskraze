import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from '@/utils/functions/produc_fn';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
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

        const { order_id, cancel_order } = req.query;

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

        if (cancel_order === "true") {
            // Restore stock for each product in the order
            for (const { _id, quantity } of order.purchase) {
                await Products.findByIdAndUpdate(_id, { $inc: { stock: quantity } }, { new: true });
            }
            // Delete the order
            await Orders.findByIdAndDelete(order_id);
            // Extract product IDs from purchase array
            const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));

            // Fetch all products in one query
            const products = await Products.find({ _id: { $in: allProductIds } });

            // Convert product list to a Map for quick lookup
            const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

            // Replace product IDs with actual product objects while keeping quantity
            const _updatedOrder = {
                ...order.toObject(),
                purchase: order.purchase.map(item => ({
                    ...productMap.get(item._id.toString()) || null,
                    quantity: item.quantity
                })).filter(item => item.product !== null) // Remove missing products
            };

            _updatedOrder.subtotal_amount = calc_total_amount(_updatedOrder.purchase);
            _updatedOrder.total_amount = calc_gross_total_amount(_updatedOrder);
            _updatedOrder.total_items = calc_total_items(_updatedOrder.purchase);

            await send_confirm_mail(res, _updatedOrder, "delete");

        } else {
            await Orders.findByIdAndUpdate(order_id, { isDeleted: true }, { new: true });
        }

        // Enqueue CSV update
        await csvQueue.add("updateCSV", {});

        return res.status(200).json({ success: true, message: "Order has been deleted." });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
