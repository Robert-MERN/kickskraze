import Users from '@/models/user_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import cryptojs from "crypto-js";

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

        const { password, ...other } = req.body;

        const user = await Users.findById(user_id);

        if (!user) {
            return res.status(401).json({ success: true, message: `Admin account wasn't found` });
        }

        if (password) {
            // decrypting passowrd
            const bytes = cryptojs.AES.decrypt(user.password, process.env.CJS_KEY);
            const decrypted = bytes.toString(cryptojs.enc.Utf8);

            console.log(decrypted)
            if (decrypted === password) {
                return res.status(401).json({ success: true, message: `You can't reset the passwords with old passwords` });
            }

            // encrypting password
            const encrypted = cryptojs.AES.encrypt(password, process.env.CJS_KEY).toString();
            // updating user in DB
            await Users.findByIdAndUpdate(user_id, {
                ...other,
                password: encrypted,
                password_update_count: user.password_update_count + 1
            });
        } else {
            await Users.findByIdAndUpdate(user_id, other);
        }

        // sending success response to user
        return res.status(200).json({ success: true, message: `Admin account has been updated` });


    } catch (err) {

        // if server catches any error
        res.status(501).json({ success: false, message: err.message });
    }

}
