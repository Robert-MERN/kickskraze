export const filter_method = async (newObj, set_state) => {

    const FILTERS = await new Promise((resolve) => {

        set_state((prevObjects) => {
            // Check if an object with the same size exists
            var index;
            const key = Object.keys(newObj)[0];
            if (["size", "condition", "brand", "store_name", "type", "color", "category"].includes(key)) {
                index = prevObjects.findIndex((obj) => obj[key] === newObj[key]);
            }


            if (Object.keys(newObj)[0] === "price_gte" || Object.keys(newObj)[0] === "price_lte" || Object.keys(newObj)[0] === "sort_by") {
                index = prevObjects.findIndex((obj) => Object.keys(obj)[0] === Object.keys(newObj)[0]);
                // If found, replace it
                if (index !== -1) {
                    const updatedObjects = [...prevObjects];
                    updatedObjects.splice(index, 1, newObj);
                    resolve(updatedObjects);
                    return updatedObjects;
                }
                resolve([...prevObjects, newObj]);
                return [...prevObjects, newObj];
            };




            if (index !== -1) {
                // If found, remove it
                const updatedObjects = [...prevObjects];

                updatedObjects.splice(index, 1);
                resolve(updatedObjects);
                return updatedObjects;

            } else {
                // If not found, add it
                resolve([...prevObjects, newObj])
                return [...prevObjects, newObj];
            }
        });

    });

    return FILTERS;
};

export const convert_to_query_string = (filter) => {
    const _filter = [...filter];
    return _filter
        .map((obj) => {
            return Object.entries(obj).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`); // Encode key-value pair
        }).join("&");
}


export const find_filter = (arr, field) => {
    return arr.find((obj) => Object.keys(obj)[0].includes(field))
}

export const filters_realtime_update = (filter_options, arr) => {
    // Extract all the values except for `sort_by`
    const realtime_update = arr
        .filter(e => Object.keys(e)[0] !== "sort_by") // Filter out `sort_by`
        .map(e => {
            const key = Object.keys(e)[0];
            const value = Object.values(e)[0];

            if (["size", "brand", "condition", "store_name", "color", "type", "category"].includes(key)) {
                if (key === "store_name") return store_name_filter_display_fn(value);
                return value; // Return the value directly
            }
        })
        .filter(Boolean); // Remove undefined values

    const { price_gte, price_lte } = filter_options;
    const priceGteFilter = find_filter(arr, "price_gte");
    const priceLteFilter = find_filter(arr, "price_lte");

    const _price_gte = Number(priceGteFilter?.price_gte ?? filter_options.price_gte ?? 0);
    const _price_lte = Number(priceLteFilter?.price_lte ?? filter_options.price_lte ?? 999999);
    if (Number(price_gte) === _price_gte && Number(price_lte) === _price_lte) {
        return realtime_update;
    }
    const price = `Rs.${_price_gte.toLocaleString("en-US")} - Rs.${_price_lte.toLocaleString("en-US")}`;
    return [...realtime_update, price];

};

export const remove_item_from_filters_realtime_update = async (set_arr, obj_val, filter_options) => {
    const FILTERS = await new Promise(resolve => {
        set_arr((prev_arr) => {
            if (obj_val.toString().includes("Rs.")) {
                const without_prices_arr = prev_arr.filter(obj => {
                    const k = Object.keys(obj)[0];
                    return k !== "price_gte" && k !== "price_lte";
                });
                const { price_gte, price_lte } = filter_options;

                resolve([{ price_gte }, { price_lte }].concat(without_prices_arr));
                return [{ price_gte }, { price_lte }].concat(without_prices_arr);
            }


            // 🔥 convert friendly store_name back to actual key
            let realValue = STORE_NAME_REVERSE_MAP[obj_val] || obj_val;

            const index = prev_arr.findIndex(
                (obj) => Object.values(obj)[0] === realValue
            );

            if (index >= 0) {
                const updated_arr = [...prev_arr];
                updated_arr.splice(index, 1);
                resolve(updated_arr);
                return updated_arr;
            }
            resolve(prev_arr);
            return prev_arr; // Return the original array if no match is found
        });
    });
    return FILTERS;
};

export const remove_group_items_from_filters_realtime_update = async (set_arr, obj_key) => {
    const FILTERS = await new Promise(resolve => {
        set_arr((prev_arr) => {
            const updated_arr = prev_arr.filter((obj) => Object.keys(obj)[0] !== obj_key);
            resolve(updated_arr);
            return updated_arr;
        });
    });
    return FILTERS;
};

export const remove_all_items_from_filters_realtime_update = (filter_options, set_arr) => {
    const sort_by = filter_options.sort_by ?? "created-descending";
    const price_gte = filter_options.price_gte ?? 0;

    // FIXED: never allow undefined
    const price_lte = filter_options.price_lte ?? 999999;

    const defaults = [
        { sort_by },
        { price_gte },
        { price_lte }
    ];

    set_arr(defaults);
    return defaults;
};


export const configure_query_filters = (router_query, filter_options = {}) => {
    const sort_by = filter_options.sort_by ?? "created-descending";
    const price_gte = filter_options.price_gte ?? 0;

    // FIX: Never allow price_lte undefined
    const price_lte = filter_options.price_lte ?? 999999;

    const defaults = [
        { sort_by },
        { price_gte },
        { price_lte },
    ];

    const query_filters = [];

    // No query -> return only defaults
    if (!router_query || !Object.keys(router_query).length) return defaults;

    for (const [key, value] of Object.entries(router_query)) {
        const values = typeof value === "string" ? value.split(",") : value;
        values.forEach(val => {
            if (val) query_filters.push({ [key]: val });
        });
    }

    // merge defaults if missing
    defaults.forEach(def => {
        const key = Object.keys(def)[0];
        if (!query_filters.some(q => Object.keys(q)[0] === key)) {
            query_filters.push(def);
        }
    });

    return query_filters;
};


export const add_query_filters = async (query_filters, set_filters) => {
    if (!query_filters || !query_filters.length) return [];

    const specialKeys = ["size", "condition", "brand", "hide_brand", "store_name", "type", "color", "category"];
    const priority = query_filters.filter(q => specialKeys.includes(Object.keys(q)[0]));
    const normal = query_filters.filter(q => !specialKeys.includes(Object.keys(q)[0]));

    let updated = [];

    // Apply special filters
    if (priority.length) {
        updated = await new Promise(resolve => {
            set_filters(prev => {
                const arr = [...prev];
                for (const add of priority) {
                    const key = Object.keys(add)[0];
                    const val = add[key];

                    // REMOVE undefined or null values
                    if (val === undefined || val === null) continue;

                    const idx = arr.findIndex(e => e[key] === val);
                    if (idx !== -1) arr[idx] = add;
                    else arr.push(add);
                }
                resolve(arr);
                return arr;
            });
        });
    }

    // Apply normal filters (sort, price, etc)
    if (normal.length) {
        updated = await new Promise(resolve => {
            set_filters(prev => {
                const arr = [...prev];
                for (const add of normal) {
                    const key = Object.keys(add)[0];
                    const val = add[key];

                    if (val === undefined || val === null) continue;

                    const idx = arr.findIndex(e => Object.keys(e)[0] === key);
                    if (idx !== -1) arr[idx] = add;
                    else arr.push(add);
                }
                resolve(arr);
                return arr;
            });
        });
    }

    return updated;
};



// Store name mapping function
export const STORE_NAME_MAP = {
    Barefoot: "Fashion Sneakers",
    Kickskraze: "Sports Sneakers",
    "Casual-footwear": "Casual Footwear",
    "Formal-footwear": "Formal Shoes",
    "Footwear-accessories": "Shoe Accessories",
};

// Mapping function for display
export const store_name_filter_display_fn = (store_name) => STORE_NAME_MAP[store_name] || store_name;

// Reverse mapping:
export const STORE_NAME_REVERSE_MAP = Object.fromEntries(Object.entries(STORE_NAME_MAP).map(([key, value]) => [value, key]));

const sequentialStoreNames = ["Barefoot", "Kickskraze", "heels", "sandals", "flats", "Casual-footwear", "Formal-footwear", "Footwear-accessories",];

export const sort_store_names = (store_names) => {
    return store_names
        .filter(name => sequentialStoreNames.includes(name))
        .sort((a, b) => sequentialStoreNames.indexOf(a) - sequentialStoreNames.indexOf(b));
}

// Database function [BACK-END]
// Sorting Method
export const get_mongo_sort_object = (sort_by) => {
    const sortMapping = {
        "title-ascending": { title: 1 },
        "title-descending": { title: -1 },
        "price-ascending": { price: 1 },
        "price-descending": { price: -1 },
        "created-ascending": { createdAt: 1 },
        "created-descending": { createdAt: -1 }
    };

    // Return the corresponding sort object or default to "created-descending"
    return sortMapping[sort_by] || { createdAt: -1 };
};