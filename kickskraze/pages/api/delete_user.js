import Users from '@/models/user_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import cryptojs from "crypto-js";
import { use } from 'react';

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
        const { admin_id, user_id, } = req.query;


        const admin = await Users.findById(admin_id);

        if (!admin && (!admin.isAdmin || admin._id !== user_id)) {
            return res.status(401).json({ success: true, message: `Only admins can access this resource` });
        }

        const user = await Users.findById(user_id);

        if (!user) {
            return res.status(401).json({ success: true, message: `Unable to delete, user account wasn't found` });
        }

        await Users.findByIdAndDelete(user_id);
        // sending success response to user
        return res.status(200).json({ success: true, message: `Account has been deleted` });


    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

}
