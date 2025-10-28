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

    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");
        const { product_id } = req.query;

        // Finding Product media
        const product = await Products.findById(product_id).select("media");

        if (product.media && Array.isArray(product.media) && product.media.length) {
            const media = product.media.map(each => each.url);
            await deleteFiles(media, { req, res });
        }

        // Deleting product
        await Products.findByIdAndUpdate(product_id, { isDeleted: true });

        await csvQueue.add("updateCSV", {}); // Enqueue CSV update

        // sending success response to client
        return res.status(200).json({ status: true, message: "Product has been deleted" });

    } catch (err) {
        console.log(err);
        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}