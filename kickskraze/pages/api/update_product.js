import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { deleteImages } from '@/utils/functions/destroy_cloudinary_image';

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

        // Getting Product Media
        const product = await Products.findById(product_id).select("media");

        if (product.media && Array.isArray(product.media) && product.media.length) {
            const media = product.media.map(each => each.url);
            if (req.body.media.length) {
                const target_media = media.filter(each => req.body.media.some(e => !e.url.includes(each)));
                await deleteImages(target_media, { req, res });
            } else {
                await deleteImages(media, { req, res });
            }
        }

        // updating product
        await Products.findByIdAndUpdate(product_id, req.body);

        // sending success response to client
        return res.status(200).json({ status: true, message: "Product has been updated" });

    } catch (err) {

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}