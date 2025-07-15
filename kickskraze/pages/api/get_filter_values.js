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

        // Getting filter value with pipeline
        const filter_values = await Products.aggregate([
            {
                $match: { isDeleted: false }
            },
            {
                $group: {
                    _id: null,
                    sizes: { $addToSet: "$size" },
                    brands: { $addToSet: "$brand" },
                    conditions: { $addToSet: "$condition" },
                    price_lte: { $max: "$price" },
                }
            },
            {
                $project: {
                    sizes: 1,
                    brands: 1,
                    conditions: 1,
                    price_gte: { $literal: 0 }, // Set price_gte to 0
                    price_lte: 1,
                    sort_by: "created-descending", // Static field for sort_by
                    _id: 0,
                }
            },
            {
                $addFields: {
                    sizes: { $sortArray: { input: "$sizes", sortBy: 1 } }, // Sort sizes numerically (ascending)
                    brands: { $sortArray: { input: "$brands", sortBy: 1 } }, // Sort brands alphabetically (ascending)
                }
            }
        ]);

        // sending success response to client
        return res.status(200).json(filter_values[0]);

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}