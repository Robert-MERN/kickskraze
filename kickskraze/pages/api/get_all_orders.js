import mongoose from "mongoose";
import Orders from "@/models/order_model";
import Products from "@/models/product_model";
import connect_mongo from "@/utils/functions/connect_mongo";
import { hydrateOrder } from "@/utils/functions/order_variant_helpers";
import { select_store_name } from "@/utils/functions/product_fn";

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    console.log("Connecting with DB");
    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        let query = { isDeleted: false };
        const { status, status_not, store_name } = req.query;

        if (status_not) {
            query.status = { $ne: status_not };
        }

        if (status) {
            query.status = status;
        }

        const all_stores = {
            "footwear": ["Barefoot", "Kickskraze", "SM-sandals", "Areeba-sandals", "Formal-footwear", "Casual-footwear", "Footwear-accessories"],
            "apparel": ["Apparel"],
            "jewelry": ["Jewelry"],
        };
        // store filter match
        let normalized_store_name;
        if (store_name) {
            normalized_store_name = store_name.toLowerCase();
            if (all_stores[normalized_store_name]) {
                query.store_name = { $in: all_stores[normalized_store_name] };
            } else if (Object.values(all_stores).some(arr => arr.includes(normalized_store_name))) {
                query.store_name = normalized_store_name.charAt(0).toUpperCase() + normalized_store_name.slice(1);
            }
        }

        const orders = await Orders.find(query).sort({ createdAt: -1 });

        // collect all product ids from all orders
        const allProductIds = orders.flatMap(order => order.purchase.map(item => item._id));
        const objectIds = allProductIds.map(id => new mongoose.Types.ObjectId(id));
        const products = await Products.find({ _id: { $in: objectIds } });

        const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

        const updatedOrders = orders.map(order => {
            const hydrated = hydrateOrder(order, productMap);

            // 🔥 Generate live store array
            hydrated.store_name = select_store_name(hydrated.purchase);

            return hydrated;
        });

        return res.status(200).json(updatedOrders);

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
}
