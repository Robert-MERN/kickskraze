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
    console.log("Connecting with DB");
    try {
        // Connecting with MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        // Extract product IDs from the purchase array
        const allProductIds = req.body.purchase.map(item => new mongoose.Types.ObjectId(item._id));

        // Fetch all products in one query
        const products = await Products.find({ _id: { $in: allProductIds } });

        // Convert product list to a Map for quick lookup
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        // Validate stock and filter out products with insufficient stock
        const availableProducts = req.body.purchase.filter(item => {
            const product = productMap.get(item._id.toString());
            return product && product.stock >= item.quantity; // Check if stock is sufficient
        });

        // If no products are available, return an error response
        if (availableProducts.length === 0) {
            return res.status(400).json({ success: false, message: "Items are not in stock. Remove item(s) from your cart." });
        }

        // If some products are available but not all, update the purchase array
        if (availableProducts.length < req.body.purchase.length) {
            req.body.purchase = availableProducts; // Update the purchase array with available products
        }

        // Create the order with the available products
        order = new Orders(req.body);

        // Save the order
        await order.save();

        // Replace product IDs with actual product objects while keeping quantity
        order = {
            ...order.toObject(),
            purchase: order.purchase.map(item => ({
                ...productMap.get(item._id.toString()) || null,
                quantity: item.quantity
            })).filter(item => item.product !== null) // Remove missing products
        };
        // Calculate order totals
        order.subtotal_amount = calc_total_amount(order.purchase);
        order.total_amount = calc_gross_total_amount(order);
        order.total_items = calc_total_items(order.purchase);
        // Send confirmation email
        const response = await send_confirm_mail(res, order, "create");

        if (response.message === "mail-sent") {
            // Update stock for each product in the order
            await Promise.all(order.purchase.map((product) => {
                const stock = product.stock - product.quantity;
                return Products.findByIdAndUpdate(product._id, { stock: stock < 1 ? 0 : stock });
            }));

            // Enqueue CSV update
            await csvQueue.add("updateCSV", {});

            // Send success response to the client
            return res.status(200).json(order);
        }

        // If email sending fails, delete the order
        await Orders.findByIdAndDelete(order._id);
        return res.status(500).json({ success: false, message: "Order couldn't be created!" });

    } catch (err) {
        // If an error occurs, delete the order (if it was created)
        if (order && order._id) {
            await Orders.findByIdAndDelete(order._id);
        }
        return res.status(501).json({ success: false, message: err.message });
    }
}