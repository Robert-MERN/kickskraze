import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */

export default async function handler(req, res) {
    let orders;
    console.log("Connecting with DB")
    try {

        // connecting with monogDB
        await connect_mongo();
        console.log("Successfuly conneted with DB");

        orders = new Orders(req.body);

        await orders.save();


        const response = await send_confirm_mail(res, orders);

        if (response.message === "mail-sent") {
            const products = await Promise.all(orders.purchase.map((product) =>
                Products.findByIdAndUpdate(product._id, { stock: 0 })
            ));
            // sending success response to client
            return res.status(200).json(orders);
        }

        await Orders.findByIdAndDelete(orders._id);
        return res.status(500).json({ success: false, message: "Order couldn't be created!" });

    } catch (err) {

        // if server catches any error
        await Orders.findByIdAndDelete(orders._id);
        return res.status(501).json({ success: false, message: err.message });
    }

}