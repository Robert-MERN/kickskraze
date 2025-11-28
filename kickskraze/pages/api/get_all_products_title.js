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

        let query = {isDeleted: false};

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
            "Footwear": ["Barefoot", "Kickskraze", "Casual-footwear", "Formal-footwear", "Areeba-sandals", "SM-sandals", "Footwear-accessories"],
            "Apparel": ["Apparel"],
            "Jewelry": ["Jewelry"],
        }
        if (store_name) {
            if (all_stores[store_name]) {
                query.store_name = { $in: all_stores[store_name] };
            } else if (Object.values(all_stores).some(stores => stores.includes(store_name))) {
                // Handling cases like (e.g.) store_name=Barefoot instead of store_name=Footwear
                query.store_name = store_name;
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
