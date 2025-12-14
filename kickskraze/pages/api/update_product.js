import { csvQueue } from '@/lib/queue';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { deleteFiles } from '@/utils/functions/delete_bunnycdn_files_fn';
import { parseMixedField, parseOptionsField, parseVariantsField, generateSKU } from '@/utils/functions/product_fn';
import util from "util";
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


        // Removing "recent" field from the object in the media array
        const { media: _media, ...other } = req.body;
        const media = _media.length ? _media.map(e => {
            const { recent, ...other } = e;
            return { ...other };
        }) : [];


        // Conerting size and color field to array if they are string
        if (other.size) {
            other.size = parseMixedField(other.size);
        }

        if (other.color) {
            other.color = parseMixedField(other.color);
        }


        // Parsing variants and options fields if the product has variants
        if (other.has_variants) {

            other.options = parseOptionsField(other.options);
            other.variants = parseVariantsField(other.variants);


        }


        // ⬇ SKU LOGIC FOR UPDTATE PRODUCT
        //--------------------------------------------------
        // Compare identity (SKU except last hash part)
        const sameSKU = (oldSku, newSku) => oldSku?.split("-").slice(0, -1).join("-") === newSku.split("-").slice(0, -1).join("-");
        const oldProduct = await Products.findById(product_id).lean();

        // 🟢 BASE SKU
        if (!other.has_variants) {

            const newSku = generateSKU(other);
            const finalSku = !oldProduct?.sku || !sameSKU(oldProduct.sku, newSku)
                ? newSku        // identity changed → regenerate
                : oldProduct.sku; // identity same → keep previous SKU

            other.sku = finalSku;
        }

        // 🔥 VARIANT LEVEL SKU
        if (other.has_variants && Array.isArray(other.variants)) {

            const oldMap = new Map();
            oldProduct?.variants?.forEach(v => oldMap.set(v.variant_id, v.sku));

            other.variants = other.variants.map(v => {
                const newSku = generateSKU(other, v);
                const oldSku = oldMap.get(v.variant_id);

                v.sku = (!oldSku || !sameSKU(oldSku, newSku))
                    ? newSku      // new or changed → regenerate
                    : oldSku;     // keep same if identity unchanged

                return v;
            });
        }
        //--------------------------------------------------


        // updating product
        await Products.findByIdAndUpdate(product_id, { media, ...other });


        // Deleting the media from Cloudinary which got removed in the update.
        if (product.media && Array.isArray(product.media) && product.media.length) {
            const media = product.media.map(each => each.url);
            const body_media = req.body.media.filter(e => !Boolean(e.recent)).map(each => each.url);
            if (body_media.length) {
                const target_media = media.filter(each => body_media.every(e => each !== e));
                await deleteFiles(target_media, { req, res });
            } else {
                await deleteFiles(media, { req, res });
            }
        }

        await csvQueue.add("updateCSV", {}); // Enqueue CSV update

        // sending success response to client
        return res.status(200).json({ status: true, message: "Product has been updated" });

    } catch (err) {

        // Deleting the new uploaded media, if any error occurs in MongoDB server after the successful upload of media on the Cloudinary server.
        const media = (Array.isArray(req.body.media) && req.body.media.length) ? req.body.media.filter(e => Boolean(e.recent)).map(e => e.url) : [];
        if (media.length) {
            await deleteFiles(media, { req, res });
        }

        // if server catches any error
        return res.status(501).json({ success: false, message: err.message });
    }

}