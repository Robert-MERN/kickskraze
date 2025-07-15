import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from '@/utils/functions/produc_fn';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
import mongoose from 'mongoose';

/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */


const convert_usable_order = async (order, Products) => {
    // Extract product IDs from purchase array
    const allProductIds = order.purchase.map(item => new mongoose.Types.ObjectId(item._id));

    // Fetch all products in one query
    const products = await Products.find({ _id: { $in: allProductIds } });

    // Convert product list to a Map for quick lookup
    const productMap = new Map(products.map(product => [product._id.toString(), product.toObject()]));

    // Replace product IDs with actual product objects while keeping quantity
    const _updatedOrder = {
        ...order.toObject(),
        purchase: order.purchase.map(item => ({
            ...productMap.get(item._id.toString()) || null,
            quantity: item.quantity
        })).filter(item => item.product !== null) // Remove missing products
    };

    _updatedOrder.subtotal_amount = calc_total_amount(_updatedOrder.purchase);
    _updatedOrder.total_amount = calc_gross_total_amount(_updatedOrder);
    _updatedOrder.total_items = calc_total_items(_updatedOrder.purchase);

    return _updatedOrder;
}

export default async function handler(req, res) {
    console.log("Connecting with DB");

    try {
        // Connecting to MongoDB
        await connect_mongo();
        console.log("Successfully connected with DB");

        const { order_id } = req.query;

        // Validate order ID
        if (!order_id) {
            return res.status(400).json({ success: false, message: "Order ID is not provided" });
        } else if (!mongoose.isValidObjectId(order_id)) {
            return res.status(400).json({ success: false, message: "Order ID is invalid" });
        }

        // Fetch the order
        const order = await Orders.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const { purchase, updatedAt, subtotal_amount, total_amount, total_items, ...others } = req.body;

        // If purchase is empty, delete the order and restore stock
        if (!purchase || purchase.length === 0) {
            for (const item of order.purchase) {
                await Products.findByIdAndUpdate(item._id, { $inc: { stock: item.quantity } });
            }
            await Orders.findByIdAndUpdate(order_id, { isDeleted: true });

            const _updatedOrder = await convert_usable_order(order, Products);

            await send_confirm_mail(res, _updatedOrder, "delete");
            await csvQueue.add("updateCSV", {}); // Enqueue CSV update

            return res.status(200).json({ success: true, message: "Order has been deleted and stock updated." });
        }

        // Handle removed items (restore stock for removed products)
        const removedItems = order.purchase.filter(
            oldItem => !purchase.some(newItem => String(newItem._id) === String(oldItem._id))
        );

        if (removedItems.length) {
            for (const item of removedItems) {
                await Products.findByIdAndUpdate(item._id, { $inc: { stock: item.quantity } });
            };
            await csvQueue.add("updateCSV", {}); // Enqueue CSV update
        };


        // If the order is marked returned (restore stock for purchased products)
        if (req.body.status && req.body.status === "returned" && order.status !== "returned") {
            for (const item of order.purchase) {
                await Products.findByIdAndUpdate(item._id, { $inc: { stock: item.quantity } });
            }
            await csvQueue.add("updateCSV", {}); // Enqueue CSV update
        }

        // If the order was already marked as returned and changing it to another status (remove the purchased products from the stock) 
        if (req.body.status && req.body.status !== "returned" && order.status === "returned") {
            const usableOrder = await convert_usable_order(order, Products);
            for (const item of usableOrder.purchase) {
                const product = await Products.findById(item._id);
                if ((product.stock - item.quantity) < 0) {
                    return res.status("501").json({ success: false, message: "Order status can't be changed. The items are bought by someone else" })
                }
                const stock = item.stock - item.quantity;
                await Products.findByIdAndUpdate(item._id, { stock: stock < 1 ? 0 : stock });
            };
            await csvQueue.add("updateCSV", {}); // Enqueue CSV update
        }


        // Update the order
        const updatedOrder = await Orders.findByIdAndUpdate(order_id, req.body, { new: true });
        const _updatedOrder = await convert_usable_order(updatedOrder, Products);

        // Extract keys from request body
        const updatedKeys = Object.keys({ ...others, purchase });

        // Find keys where the value actually changed
        const changedKeys = updatedKeys.filter(key => JSON.stringify({ ...others, purchase }[key]) !== JSON.stringify(order[key]));

        // Check specific fields that require a "status_update" email
        const statusChanged = changedKeys.includes("status");
        const trackingChanged = changedKeys.includes("tracking_no");
        const courierChanged = changedKeys.includes("courier_name");
        const verificationChanged = changedKeys.includes("verification");
        const warehouseStatusChanged = changedKeys.includes("warehouse_status");

        // If verification or warehouse status changed but other fields also changed, we still need to send an update email
        const onlyVerificationChanged = verificationChanged && changedKeys.length === 1;
        const onlyWarehouseStatusChanged = warehouseStatusChanged && changedKeys.length === 1;
        const onlyWarehouseStatusAndVerificationChanged = verificationChanged & warehouseStatusChanged && changedKeys.length === 2;

        if (changedKeys.length > 0) {
            if (statusChanged || trackingChanged || courierChanged) {
                await send_confirm_mail(res, _updatedOrder, "status_update");
            } else if (!onlyVerificationChanged && !onlyWarehouseStatusChanged && !onlyWarehouseStatusAndVerificationChanged) {
                // Send update email if any field other than verification changed
                await send_confirm_mail(res, _updatedOrder, "update");
            }
        }

        return res.status(200).json({ success: true, message: "Order has been successfully updated.", order: _updatedOrder });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}