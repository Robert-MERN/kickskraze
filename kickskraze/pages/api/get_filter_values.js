import Products from '@/models/product_model';
import connect_mongo from '@/utils/functions/connect_mongo';

/**
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function handler(req, res) {
    try {
        await connect_mongo();
        const { store_name } = req.query;

        let query = { isDeleted: false };

        const all_stores = {
            "footwear": ["Barefoot", "Kickskraze", "SM-sandals", "Areeba-sandals", "Formal-footwear", "Casual-footwear"],
            "footwear-accessories": ["Footwear-accessories"],
            "apparel": ["Apparel"],
            "jewelry": ["Jewelry"],
        };
        let normalized_store_name;
        // store filter match
        if (store_name) {
            normalized_store_name = store_name.toLowerCase();
            if (all_stores[normalized_store_name]) {
                query.store_name = { $in: all_stores[normalized_store_name] };
            } else if (Object.values(all_stores).some(arr => arr.includes(normalized_store_name))) {
                query.store_name = normalized_store_name.charAt(0).toUpperCase() + normalized_store_name.slice(1);
            }
        }

        // ---------------- Aggregation ----------------
        const filters = await Products.aggregate([
            { $match: query },

            {
                $addFields: {
                    size: { $cond: [{ $isArray: "$size" }, "$size", ["$size"]] },
                    color: { $cond: [{ $isArray: "$color" }, "$color", ["$color"]] }
                }
            },

            { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },

            {
                $group: {
                    _id: null,
                    sizes: { $addToSet: "$size" },
                    colors: { $addToSet: "$color" },
                    types: { $addToSet: "$type" },
                    brands: { $addToSet: "$brand" },
                    conditions: { $addToSet: "$condition" },
                    categories: { $addToSet: "$category" },
                    store_names: {
                        $addToSet: {
                            $cond: [
                                { $in: ["$store_name", ["Areeba-sandals", "SM-sandals"]] },
                                "$type",
                                "$store_name"
                            ]
                        }
                    },
                    price_lte: { $max: "$price" }
                }
            },

            {
                $project: {
                    _id: 0,
                    sizes: 1,
                    colors: 1,
                    types: 1,
                    brands: 1,
                    conditions: 1,
                    categories: 1,
                    store_names: 1,
                    price_lte: 1
                }
            }
        ]);

        if (!filters.length) return res.status(200).json({});

        let data = filters[0];

        // GLOBAL SORTING --------------------------
        const sortedColors = data.colors?.filter(Boolean).sort((a, b) => a.localeCompare(b)) ?? [];
        const sortedBrands = data.brands?.filter(Boolean).sort((a, b) => a.localeCompare(b)) ?? [];

        // ---------- JEWELRY ----------
        if (normalized_store_name === "jewelry") {
            return res.status(200).json({
                types: data.types?.filter(Boolean).sort((a, b) => a.localeCompare(b)) ?? [],
                colors: sortedColors,
                price_gte: 0,
                price_lte: data.price_lte
            });
        }

        // ------- FOOTWEAR ACCESSORIES --------
        if (normalized_store_name === "footwear-accessories") {
            return res.status(200).json({
                types: data.types?.filter(Boolean).sort((a, b) => a.localeCompare(b)) ?? [],
                colors: sortedColors,
                price_gte: 0,
                price_lte: data.price_lte
            });
        }

        // ------------ APPAREL ------------
        if (normalized_store_name === "apparel") {
            // CUSTOM SIZE SORT ORDER
            const alphaOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
            const sortedSizes = data.sizes
                ?.filter(v => alphaOrder.includes(v))
                .sort((a, b) => alphaOrder.indexOf(a) - alphaOrder.indexOf(b)) ?? [];

            // CUSTOM CATEGORY SORT ORDER
            const categoryOrder = ["men", "women", "unisex", "kids-boys", "kids-girls", "kids"];
            const sortedCategories = data.categories
                ?.filter(Boolean)
                .sort((a, b) => categoryOrder.indexOf(a.toLowerCase()) - categoryOrder.indexOf(b.toLowerCase())) ?? [];

            return res.status(200).json({
                sizes: sortedSizes,
                types: data.types?.filter(Boolean).sort((a, b) => a.localeCompare(b)) ?? [],
                categories: sortedCategories,
                colors: sortedColors,
                price_gte: 0,
                price_lte: data.price_lte
            });
        }

        // ------------ FOOTWEAR (SORT FIXED) ------------
        const numericSortedSizes = data.sizes
            ?.map(s => Number(s))    // convert to number
            .filter(n => !isNaN(n))   // keep numeric only
            .sort((a, b) => a - b);   // sort ASC

        // CUSTOM CONDITION SORT ORDER
        const conditionOrder = ["very good", "excellent", "premium", "premium +", "brand new"];

        const sortedConditions = data.conditions
            ?.filter(Boolean)
            .sort((a, b) => conditionOrder.indexOf(a.toLowerCase()) - conditionOrder.indexOf(b.toLowerCase())) ?? [];

        // ❗ EXCLUDED STORES
        const excludedStores = ["Apparel", "Jewelry", "Footwear-accessories"];

        const filteredStoreNames = data.store_names
            ?.filter(Boolean)                      // remove null/blank
            .filter(name => !excludedStores.includes(name)) ?? []; // remove unwanted ones

        // CUSTOM CATEGORY SORT ORDER
        const categoryOrder = ["men", "women", "unisex", "kids-boys", "kids-girls", "kids"];
        const sortedCategories = data.categories
            ?.filter(Boolean)
            .sort((a, b) => categoryOrder.indexOf(a.toLowerCase()) - categoryOrder.indexOf(b.toLowerCase())) ?? [];


        return res.status(200).json({
            sizes: numericSortedSizes ?? [],
            colors: sortedColors,
            brands: sortedBrands,
            conditions: sortedConditions,
            store_names: filteredStoreNames,
            categories: sortedCategories,
            price_gte: 0,
            price_lte: data.price_lte
        });

    } catch (error) {
        return res.status(501).json({ success: false, message: error.message });
    }
}
