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
            {
                $project: {
                    _id: 1,
                    title: 1,
                    media: 1,
                    createdAt: 1,
                }
            },
            { $unwind: "$media", },
            { $match: { $or: [{ "media.thumbnail": true, "media.type": "image" }, { "media.type": "image" }] } },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    url: { $first: "$media.url" },
                    createdAt: { $first: "$createdAt" },
                }
            },

        ]);

        return res.status(200).json(products);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
