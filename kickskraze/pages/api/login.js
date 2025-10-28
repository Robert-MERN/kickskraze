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
        const { email, password } = req.body;


        // finding user
        const user = await Users.findOne({ email });

        if (user) {

            // decrypting passowrd
            const bytes = cryptojs.AES.decrypt(user.password, process.env.CJS_KEY);
            const decrypted = bytes.toString(cryptojs.enc.Utf8);
            // verifying password
            if (decrypted === password) {
                // creating plain payload to convert user obj into token
                const plain_payload = plain_payload_maker(user);
                // converting user object in token 
                const token = await jwt.sign(plain_payload, process.env.JWT_KEY, { expiresIn: "365d" });


                // cookie expires in 1 days
                const expiry_date = 365 * 24 * 60 * 60;

                // now setting that token in cookies
                set_cookie("user_account_token", token, { req, res, expires: expiry_date });

                // sending success response to client
                return res.status(200).json({ success: true, message: "User has been logged in!" });
            } else {
                // if the password was wrong
                return res.status(401).json({ success: false, message: "You entered a wrong Email or Password!" });
            }

        } else {

            // if user wasn't found
            return res.status(404).json({ success: false, message: "You entered a wrong Email or Password!" });
        }
    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

} 