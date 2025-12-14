

export const calc_total_amount = (arr) => {
    return arr.reduce((prev, next) => prev + (next.price * next.quantity), 0);
}

export const calc_total_items = (arr) => {
    return arr.reduce((prev, next) => prev + next.quantity, 0);
}

export const calc_gross_total_amount = (obj) => {
    return obj.purchase.reduce((prev, next) => prev + (next.price * next.quantity), 0) + Number(obj.delivery_charges);
}

export const calculate_discount_precentage = (price, compare_price) => {
    if (isNaN(compare_price)) return 0;
    if (price < compare_price) {
        const discounted_amount = Number(compare_price) - Number(price);
        const discounted_precentage = Math.round((discounted_amount * 100) / compare_price);
        return discounted_precentage;
    }
    return 0;
};

export const select_thumbnail_from_media = (media) => {
    const images = media.filter(e => String(e?.type) === "image");
    if (images.length) {
        return images.sort((a, b) => b.thumbnail - a.thumbnail)[0].url;
    };
    return "";

}

export const sort_product_media = (media) => {
    if (Array.isArray(media) && media.length) {
        let final_arr = [];
        const images = media.filter(e => e.type === "image");
        const videos = media.filter(e => e.type === "video");

        if (images.length) {
            final_arr = images.sort((a, b) => b.thumbnail - a.thumbnail);
        }
        final_arr = [...final_arr, ...videos];

        return final_arr.map(e => ({ url: e.url, type: e.type, thumbnail: e.url }));
    }
    return [];
}


export const select_store_name = (purchase = []) => {
    if (!Array.isArray(purchase) || purchase.length === 0) return [];

    // Extract store_name from each product and remove empty or null values
    const names = purchase
        .map(item => item.store_name)
        .filter(Boolean); // remove undefined/null

    // Return unique store names
    return [...new Set(names)];
};

export const capitalizeWords = (str) => {
    if (typeof str === "string") {
        return str
            .toLowerCase() // Convert the entire string to lowercase
            .split(" ") // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
            .join(" "); // Join them back into a single string
    } else {
        return ""
    }
}



export const formatPakistaniNumber = (number) => {
    // Convert to string and remove all non-digit characters
    let cleaned = String(number).replace(/\D/g, "");

    // If it starts with 0, replace leading 0 with 92
    if (cleaned.startsWith("0")) {
        cleaned = "92" + cleaned.slice(1);
    }

    // If it starts with 92 already, leave as is
    else if (cleaned.startsWith("92")) {
        cleaned = cleaned;
    }

    // If it starts with 3 (missing country code), add 92
    else if (cleaned.startsWith("3")) {
        cleaned = "92" + cleaned;
    }

    // If it starts with +92 but we removed the +, handle that too
    else if (cleaned.startsWith("92")) {
        cleaned = cleaned;
    }

    return cleaned;
}



// Converting size or color values to array or single value for backend processing in update/add product 
export const parseMixedField = (field) => {
    if (field === undefined || field === null) return field;

    let parsed;

    // 1️⃣ Try JSON parse (frontend may send '["Red","Blue"]')
    try {
        parsed = JSON.parse(field);
    } catch {
        parsed = field;
    }

    // 2️⃣ If parsed is comma-separated string
    if (typeof parsed === "string" && parsed.includes(",")) {
        parsed = parsed.split(",").map(v => v.trim());
    }

    // 3️⃣ If array → convert numeric strings to numbers
    if (Array.isArray(parsed)) {
        return parsed.map(v => {
            const num = Number(v);
            return isNaN(num) ? v : num;
        });
    }

    // 4️⃣ Single value → convert to number if possible
    const num = Number(parsed);
    return isNaN(num) ? parsed : num;
};

// Parsing variants field from JSON string to array of objects
export const parseVariantsField = (field) => {
    if (!field) return [];

    let parsed;

    // Try JSON parse
    try {
        parsed = JSON.parse(field);
    } catch {
        return []; // invalid JSON
    }

    // Ensure it's an array
    if (!Array.isArray(parsed)) return [];

    // Normalize variant objects
    return parsed.map(v => ({
        variant_id: v.variant_id || crypto.randomUUID(),
        options: v.options || {},
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
    }));
};


// Parsing options field from JSON string to array of option objects
export const parseOptionsField = (field) => {
    if (!field) return [];

    // Already parsed array (when coming from update product)
    if (Array.isArray(field)) {
        return field;
    }

    // JSON string case (most common)
    if (typeof field === "string") {
        try {
            const parsed = JSON.parse(field);

            // Ensure valid structure
            if (Array.isArray(parsed)) {
                return parsed.map(opt => ({
                    name: opt.name,
                    values: Array.isArray(opt.values) ? opt.values : []
                }));
            }

            return [];
        } catch (err) {
            console.log("OPTIONS PARSE FAILED:", field);
            return [];
        }
    }

    // Unexpected type
    return [];
};



// Build product variants based on options
export const build_variants = (sizes, colors) => {
    if ((!sizes || sizes.length === 0) && (!colors || colors.length === 0)) return { variants: [], options: [] };

    let options = [];

    if (sizes && sizes.length > 0) {
        options.push({ name: "size", values: sizes });
    }

    if (colors && colors.length > 0) {
        options.push({ name: "color", values: colors });
    }

    // Convert to array of arrays of values
    const valuesArray = options.map(opt => opt.values);

    // Cartesian product generator
    const cartesian = (arr) => {
        return arr.reduce((acc, curr) => {
            let temp = [];
            acc.forEach(a => {
                curr.forEach(b => {
                    temp.push([...a, b]);
                });
            });
            return temp;
        }, [[]]);
    };

    const combinations = cartesian(valuesArray);

    // Build variant objects
    const variants = combinations.map(combination => {
        let obj = {
            variant_id: crypto.randomUUID(), // for UI
            options: {},
            stock: 1,
            price: 0,
        };

        combination.forEach((value, index) => {
            obj.options[options[index].name] = value;
        });

        return obj;
    });

    return { variants, options };
}

// Fill missing variant values from base product
export const fill_missing_variant_values = (variants, baseProduct) => {
    return variants.map(variant => {
        return {
            ...variant,

            // price: if variant price is 0 or undefined, assign base price
            price: variant.price > 0 ? variant.price : baseProduct.price,

            // stock: if missing, fallback to 0 or base stock if you want
            stock: variant.stock > 0 ? variant.stock : 0,

            // Add more fields as needed
        };
    });
};



// Calculate total stock for a product
export const calculate_product_stock = (product) => {
    if (!product) return 0;

    // If product has variants → sum all variant stocks
    if (product.has_variants && Array.isArray(product.variants)) {
        return product.variants.reduce((total, v) => total + (v.stock || 0), 0);
    }

    // Otherwise use base product stock
    return product.stock || 0;
};





// Determine meta category based on store_name and type
export const resolve_meta_category = (product) => {
    const store = product.store_name;
    const type = (product.type || "").toLowerCase();

    // 1️⃣ Apparel
    if (store === "Apparel") return "Apparel";

    // 2️⃣ Jewelry
    if (store === "Jewelry") return "Jewelry";

    // 3️⃣ Footwear Stores
    if ([
        "Barefoot", "Kickskraze", "Casual-footwear",
        "Formal-footwear", "Areeba-sandals", "SM-sandals"
    ].includes(store)) {
        return "Footwear";
    }

    // 4️⃣ Footwear-accessories special rules
    if (store === "Footwear-accessories") {
        if (type === "socks") return "Apparel";                   // 🔥 socks = clothing
        if (["insole", "shoelaces", "polish", "shiner"].includes(type))
            return "Footwear Accessories";                        // accessory group
        return "Footwear Accessories";                            // fallback
    }

    return "General";
};


// 🧠 Resolve unique content ID for product or variant
export const resolve_meta_content_id = (p) => {
    if (p.selectedVariant?.variant_id) {
        return `${p._id}_${p.selectedVariant.variant_id}`; // unique variant tracking
    }
    return String(p._id); // base product fallback
};



// 🧠 Convert entire cart/order for Purchase tracking META PIXEL
export const convert_purchase_to_meta = (purchase) => {
    return {
        content_type: "product_group",

        // 🔥 Use variant-aware IDs
        content_ids: purchase.map(resolve_meta_content_id),

        num_items: purchase.reduce((t, i) => t + i.quantity, 0),
        value: purchase.reduce((t, p) => t + (p.price * p.quantity), 0).toFixed(2),
        currency: "PKR",

        // 🔥 each product sent individually in contents[]
        contents: purchase.map(item => ({
            id: resolve_meta_content_id(item),  // ← UNIQUE variant-based ID
            quantity: item.quantity,
            item_price: Number(item.price).toFixed(2),
            item_category: resolve_meta_category(item),
            title: item.title,
        }))
    }
};

// 🧠 Convert cart/order for purchase tracking CAPI helper (STRICT)
export const convert_purchase_to_meta_capi = (purchase) => ({
    content_type: "product_group",
    content_ids: purchase.map(resolve_meta_content_id),
    num_items: purchase.reduce((t, i) => t + i.quantity, 0),
    value: purchase.reduce((t, p) => t + (p.price * p.quantity), 0),
    currency: "PKR",
    contents: purchase.map(item => ({
        id: resolve_meta_content_id(item),
        quantity: item.quantity,
        item_price: Number(item.price),
    })),
});


// 🧠 Convert singular product for meta tracking
export const convert_product_to_meta = (product) => ({
    content_type: "product",
    content_ids: [resolve_meta_content_id(product)],
    content_name: product.title,
    content_category: resolve_meta_category(product),
    value: Number(product.price).toFixed(2),
    currency: "PKR",
});


// SKU Builder (safe)
export const generateSKU = (product, variant = null) => {
    const storeCode = {
        "Barefoot": "BAF",
        "Kickskraze": "KKZ",
        "Casual-footwear": "CSL",
        "Formal-footwear": "FRM",
        "SM-sandals": "SMS",
        "Areeba-sandals": "ARS",
        "Footwear-accessories": "FWA",
        "Apparel": "APP",
        "Jewelry": "JEW",
    }[product.store_name] || "GEN";

    const brand = (product.brand || "KIC")
        .replace(/[^A-Za-z]/g, "")
        .slice(0, 3).toUpperCase() || "KIC";

    const size = variant?.options?.size || product.size || "";
    const color = variant?.options?.color || product.color || "";

    // normalize
    const S = (Array.isArray(size) ? size[0] : size).toString().toUpperCase().replace(/\s+/, "") || "";
    const C = (Array.isArray(color) ? color[0] : color).toString().toUpperCase().replace(/\s+/, "") || "";

    const hash = crypto.randomUUID().slice(0, 4).toUpperCase(); // 4 chars

    return [
        storeCode,          // ✓ Always present
        brand,              // ✓ Only if exists else KIC fallback
        S || null,          // ✓ only inserted if exists
        C || null,          // ✓ only inserted if exists
        hash                // ✓ unique forever
    ].filter(Boolean).join("-");
};

// Safe GTIN / MPN Generator
export const generateGTIN = (product, variant = null) => {
    if (!variant)
        return `GTIN-${product._id}`; // base product

    return `GTIN-${product._id}-${variant.variant_id}`;
};

export const generateMPN = (product, variant = null) => {
    if (!variant)
        return `MPN-${product._id}`; // base product

    return `MPN-${product._id}-${variant.variant_id}`;
};



