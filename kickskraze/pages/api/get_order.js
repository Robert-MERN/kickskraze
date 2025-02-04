import Orders from '@/models/order_model';
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

        const { order_id } = req.query;

        if (!new mongoose.Types.ObjectId(order_id)) {
            return res.status(500).json({ success: false, message: "Order Id is invalid!" });
        };

        const order = await Orders.findById(order_id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order couldn't be found with this Order Id" });
        }

        // sending success response to client
        return res.status(200).json(order);
    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: "Order couldn't be found with this Order Id" });
    }
}