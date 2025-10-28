import { csvQueue } from '@/lib/queue';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { deleteFiles } from '@/utils/functions/delete_bunnycdn_files_fn';


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

            // Removing "recent" field from the object in the media array
            const { media: _media, ...other } = req.body;
            const media = _media.length ? _media.map(e => {
                const { recent, ...other } = e;
                return { ...other };
            }) : [];


            const products = new Products({ media, ...other });
            await products.save()

            await csvQueue.add("updateCSV", {}); // Enqueue CSV update

            // sending success response to client
            return res.status(200).json({ success: true, message: "New product is saved" });


        } catch (err) {

            // Deleting the uploaded media, if any error occurs in MongoDB server after the successful upload of media on the Cloudinary server.
            const media = (Array.isArray(req.body.media) && req.body.media.length) ? req.body.media.filter(e => Boolean(e.recent)).map(e => e.url) : [];
            if (media.length) {
                await deleteFiles(media, { req, res });
            }


            console.log(err);
            res.status(500).json({ success: false, message: err.message, });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}




