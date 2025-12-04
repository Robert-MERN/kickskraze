import mongoose from 'mongoose';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    console.log("Connecting with DB");
    try {
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { search, store_name } = req.query;

        let query = { isDeleted: false };

        // If there's a search term, match by title or _id
        if (search) {
            const isValidObjectId = mongoose.Types.ObjectId.isValid(search);

            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    ...(isValidObjectId ? [{ _id: new mongoose.Types.ObjectId(search) }] : [])
                ]
            };
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

        const products = await Products.aggregate([
            { $match: query },
            { $unwind: "$media" },
            {
                $match: {
                    "media.type": "image",
                },
            },
            {
                $sort: {
                    "media.thumbnail": -1,
                },
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    url: { $first: "$media.url" },
                    createdAt: { $first: "$createdAt" },
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 100 }, // ✅ Limit results for better performance
        ]);

        return res.status(200).json(products);
    } catch (error) {
        console.error("Error in product search:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
