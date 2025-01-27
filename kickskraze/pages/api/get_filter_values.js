import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';

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

        // saving new product
        const filter_values = await Products.aggregate([
            {
                $group: {
                    _id: null,
                    size: { $addToSet: "$size" },
                    brand: { $addToSet: "$brand" },
                    price_gte: { $max: "$price" },
                    price_lte: { $min: "$price" },
                }
            },
            {
                $project: {
                    size: 1,
                    brand: 1,
                    price_gte: 1,
                    price_lte: 1,
                    _id: 0,
                }
            }
        ]);

        // sending success response to client
        return res.status(200).json(filter_values);

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}