import Users from '@/models/user_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import jwt from "jsonwebtoken";
import cryptojs from "crypto-js";
import plain_payload_maker from '@/utils/functions/plain_payload_maker';
import { set_cookie } from '@/utils/functions/cookie';


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

        // collecting information from request body
        const { user_id } = req.query;


        // finding user
        const user = await Users.findById(user_id).lean();

        if (user) {

            delete user.password;

            // sending success response to user
            return res.status(200).json(user);

        } else {
            // if user wasn't found
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

} 