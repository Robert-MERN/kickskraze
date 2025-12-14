import mongoose from "mongoose";
import Products from "@/models/product_model";
import { calc_gross_total_amount, calc_total_amount, calc_total_items } from "@/utils/functions/product_fn";

// 🔹 Check stock for a single line item (variant-aware)
export const hasSufficientStock = (product, item) => {
    if (!product) return false;

    if (item.variant_id && Array.isArray(product.variants) && product.variants.length) {
        const v = product.variants.find(v => v.variant_id === item.variant_id);
        if (!v) return false;
        return v.stock >= item.quantity;
    }

    // No variant → use base stock
    return product.stock >= item.quantity;
};

// 🔹 Decrease stock (variant or base)
export const decrementStock = (item) => {
    if (item.variant_id) {
        return Products.updateOne(
            { _id: item._id, "variants.variant_id": item.variant_id },
            { $inc: { "variants.$.stock": -item.quantity } }
        );
    }

    return Products.findByIdAndUpdate(
        item._id,
        { $inc: { stock: -item.quantity } }
    );
};

// 🔹 Increase stock (variant or base)
export const incrementStock = (item) => {
    if (item.variant_id) {
        return Products.updateOne(
            { _id: item._id, "variants.variant_id": item.variant_id },
            { $inc: { "variants.$.stock": item.quantity } }
        );
    }

    return Products.findByIdAndUpdate(
        item._id,
        { $inc: { stock: item.quantity } }
    );
};


// 🔹 Hydrate an order with full product + selectedVariant + dynamic price
export const hydrateOrder = (orderDoc, productMap) => {
    const order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;

    const hydratedPurchase = order.purchase.map(item => {
        const prod = productMap.get(item._id.toString());
        if (!prod) return null;

        // Convert Map → Object inside ALL product variants
        prod.variants = prod.variants?.map(v => ({
            ...v,
            options: v.options instanceof Map
                ? Object.fromEntries(v.options.entries())
                : v.options
        })) || [];

        let selectedVariant = null;
        let price = prod.price;

        if (item.variant_id && Array.isArray(prod.variants) && prod.variants.length) {
            selectedVariant = prod.variants.find(v => v.variant_id === item.variant_id) || null;
            if (selectedVariant?.price) price = selectedVariant.price;
        }

        return {
            ...prod,
            quantity: item.quantity,
            price,
            selectedVariant,
            variant_id: item.variant_id || null
        };
    }).filter(Boolean);

    return {
        ...order,
        purchase: hydratedPurchase,
        subtotal_amount: calc_total_amount(hydratedPurchase),
        total_amount: calc_gross_total_amount({ ...order, purchase: hydratedPurchase }),
        total_items: calc_total_items(hydratedPurchase)
    };
};
