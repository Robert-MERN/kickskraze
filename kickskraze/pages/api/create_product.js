import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';


/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */


export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("Connecting with DB")
        try {

            await connect_mongo();
            console.log("Successfuly conneted with DB");

            const products = new Products(req.body);
            await products.save()

            // sending success response to client
            return res.status(200).json({ success: true, message: "New product is saved" });


        } catch (err) {
            console.log(err)
            res.status(500).json({ success: false, message: err.message, });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}




