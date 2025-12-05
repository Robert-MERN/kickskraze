import { csvQueue } from '@/lib/queue';
import Orders from '@/models/order_model';
import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';
import send_confirm_mail from '@/utils/functions/send_confirm_mail';
import mongoose from 'mongoose';
import {
    hydrateOrder,
    decrementStock,
    incrementStock,
} from "@/utils/functions/order_variant_helpers";

import { select_store_name } from "@/utils/functions/produc_fn";  // <-- NEW

/* Build usable live order */
const getUsableOrder = async (orderDoc) => {
    const productIds = orderDoc.purchase.map(i => new mongoose.Types.ObjectId(i._id));
    const products = await Products.find({ _id: { $in: productIds } });

    const map = new Map(products.map(p => [p._id.toString(), p.toObject()]));
    return hydrateOrder(orderDoc, map);
};

export default async function handler(req, res) {
    try {
        await connect_mongo();

        const { order_id } = req.query;
        if (!order_id) return res.status(400).json({ success: false, message: "Order ID missing" });
        if (!mongoose.isValidObjectId(order_id)) return res.status(400).json({ success: false, message: "Invalid Order ID" });

        const order = await Orders.findById(order_id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        const { purchase, ...others } = req.body;

        /* ====================== 1) FULL DELETE ====================== */
        if (!purchase || purchase.length === 0) {
            for (const item of order.purchase) await incrementStock(item);

            await Orders.findByIdAndUpdate(order_id, { isDeleted: true });
            const hydrated = await getUsableOrder(order);

            hydrated.store_name = select_store_name(hydrated.purchase);  // <-- 💥
            await send_confirm_mail(res, hydrated, "delete");
            await csvQueue.add("updateCSV", {});
            return res.status(200).json({ success: true, message: "Order deleted + stock restored" });
        }

        /* ====================== 2) REMOVED ITEMS ====================== */
        const removed = order.purchase.filter(
            old => !purchase.some(n => String(n._id) === String(old._id) && (n.variant_id ?? null) === (old.variant_id ?? null))
        );

        for (const item of removed) await incrementStock(item);
        if (removed.length) await csvQueue.add("updateCSV", {});

        /* ====================== 3) MARK RETURNED ====================== */
        if (req.body.status === "returned" && order.status !== "returned") {
            for (const item of order.purchase) await incrementStock(item);
            await csvQueue.add("updateCSV", {});
        }

        /* ====================== 4) RETURNED → RE-ACTIVATED ====================== */
        if (order.status === "returned" && req.body.status !== "returned") {
            const hydrated = await getUsableOrder(order);

            for (const item of hydrated.purchase) {
                const product = await Products.findById(item._id);
                let stock = product.stock;

                if (item.variant_id) {
                    const v = product.variants.find(v => v.variant_id === item.variant_id);
                    stock = v?.stock ?? 0;
                }

                if (stock < item.quantity)
                    return res.status(400).json({ success: false, message: "Stock not available to re-activate order" });

                await decrementStock(item);
            }
            await csvQueue.add("updateCSV", {});
        }

        /* ====================== 4.5) QTY UPDATE ====================== */
        for (const newItem of purchase) {
            const oldItem = order.purchase.find(
                o => String(o._id) === String(newItem._id) && (o.variant_id ?? null) === (newItem.variant_id ?? null)
            );
            if (!oldItem) continue;

            const diff = newItem.quantity - oldItem.quantity;

            if (diff > 0) {
                const product = await Products.findById(newItem._id);
                let stock = product.stock;

                if (newItem.variant_id) {
                    const v = product.variants.find(v => v.variant_id === newItem.variant_id);
                    stock = v?.stock ?? 0;
                }

                if (stock < diff)
                    return res.status(400).json({ success: false, message: "Not enough stock to increase quantity" });

                await decrementStock({ ...newItem, quantity: diff });
            }

            if (diff < 0) await incrementStock({ ...newItem, quantity: Math.abs(diff) });
        }

        await csvQueue.add("updateCSV", {});

        /* ====================== 5) UPDATE ORDER ====================== */
        /* A) Hydrate the new purchase BEFORE computing store_name */
        const tempOrderForHydration = { purchase };
        const hydratedForStore = await getUsableOrder(tempOrderForHydration);

        /* B) Now compute correct store list */
        const newStoreName = select_store_name(hydratedForStore.purchase);

        /* C) Inject store_name into req.body so DB saves it */
        req.body.store_name = newStoreName;

        /* D) Finally update DB */
        const updated = await Orders.findByIdAndUpdate(order_id, req.body, { new: true });

        /* E) Hydrate updated order for response */
        const hydratedUpdated = await getUsableOrder(updated);
        hydratedUpdated.store_name = newStoreName;

        /* ====================== 6) EMAIL EVENTS ====================== */
        const keys = Object.keys(req.body);
        const original = order.toObject();
        const changed = keys.filter(k => JSON.stringify(req.body[k]) !== JSON.stringify(original[k]));

        const statusChanged = changed.includes("status");
        const trackingChanged = changed.includes("tracking_no");
        const courierChanged = changed.includes("courier_name");
        const verificationChanged = changed.includes("verification");
        const warehouseChanged = changed.includes("warehouse_status");

        const onlyVerify = verificationChanged && changed.length === 1;
        const onlyWarehouse = warehouseChanged && changed.length === 1;
        const bothMinor = verificationChanged && warehouseChanged && changed.length === 2;

        if (changed.length > 0) {
            if (statusChanged || trackingChanged || courierChanged)
                await send_confirm_mail(res, hydratedUpdated, "status_update");
            else if (!onlyVerify && !onlyWarehouse && !bothMinor)
                await send_confirm_mail(res, hydratedUpdated, "update");
        }

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            order: hydratedUpdated
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
