import Orders from "@/models/order_model";
import Products from "@/models/product_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import mongoose from "mongoose";
import { hydrateOrder } from "@/utils/functions/order_variant_helpers";
import { select_store_name } from "@/utils/functions/product_fn";

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
    console.log("Connecting with DB");

    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { order_id } = req.query;

        if (!mongoose.Types.ObjectId.isValid(order_id)) {
            return res.status(400).json({ success: false, message: "Invalid Order ID!" });
        }

        const order = await Orders.findOne({ _id: new mongoose.Types.ObjectId(order_id), isDeleted: false });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found!" });
        }

        const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));
        const products = await Products.find({ _id: { $in: allProductIds } });
        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        const updatedOrder = hydrateOrder(order, productMap);

        // 🔥 Auto-generate dynamic store array
        updatedOrder.store_name = select_store_name(updatedOrder.purchase);

        return res.status(200).json(updatedOrder);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
