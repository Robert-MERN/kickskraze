import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';


// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */



export default async function handler(req, res) {


    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");





        const products = await Products.aggregate([
            { $unwind: "$media" }, // Flatten the media array
            {
                $match: {
                    "media.type": "image", // Only include type "image"
                    isDeleted: false,
                },
            },
            {
                $sort: {
                    "media.thumbnail": -1, // Sort by thumbnail (true first)
                },
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    url: { $first: "$media.url" }, // First media URL (thumbnail prioritized)
                    createdAt: { $first: "$createdAt" },
                },
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
