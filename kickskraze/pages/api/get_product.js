import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import mongoose from 'mongoose';

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
        const { product_id } = req.query;

        // saving new product
        const product = await Products.findOne({ _id: new mongoose.Types.ObjectId(product_id), isDeleted: false });

        // sending success response to client
        return res.status(200).json(product);

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}