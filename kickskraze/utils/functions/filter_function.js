export const filter_method = (newObj, set_state) => {
    set_state((prevObjects) => {
        // Check if an object with the same size exists
        var index;
        if (newObj.size) {
            index = prevObjects.findIndex((obj) => obj.size === newObj.size);
        };

        if (newObj.condition) {
            index = prevObjects.findIndex((obj) => obj.condition === newObj.condition);
        };

        if (newObj.brand) {
            index = prevObjects.findIndex((obj) => obj.brand === newObj.brand);
        };


        if (Object.keys(newObj)[0] === "price_gte" || Object.keys(newObj)[0] === "price_lte" || Object.keys(newObj)[0] === "sort_by") {
            index = prevObjects.findIndex((obj) => Object.keys(obj)[0] === Object.keys(newObj)[0]);
            // If found, replace it
            if (index !== -1) {
                const updatedObjects = [...prevObjects];
                updatedObjects.splice(index, 1, newObj);
                return updatedObjects;
            }
            return [...prevObjects, newObj];
        };




        if (index !== -1) {
            // If found, remove it
            const updatedObjects = [...prevObjects];

            updatedObjects.splice(index, 1);
            return updatedObjects;

        } else {
            // If not found, add it
            return [...prevObjects, newObj];
        }
    });


};

export const convert_to_query_string = (filter) => {
    return filter
        .map((obj) => {
            return Object.entries(obj).map(e => e.join("=")); // Encode key-value pair
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

            if (key === "size" || key === "brand" || key === "condition") {
                return value; // Return the value directly
            }
        })
        .filter(Boolean); // Remove undefined values

    const { price_gte, price_lte } = filter_options;
    const _price_gte = Number(find_filter(arr, "price_gte").price_gte);
    const _price_lte = Number(find_filter(arr, "price_lte").price_lte);
    if (Number(price_gte) === _price_gte && Number(price_lte) === _price_lte) {
        return realtime_update;
    }
    const price = `Rs.${_price_gte.toLocaleString("en-US")} - Rs.${_price_lte.toLocaleString("en-US")}`;
    return [...realtime_update, price];

};

export const remove_item_from_filters_realtime_update = (set_arr, obj_val, filter_options) => {
    set_arr((prev_arr) => {
        if (obj_val.toString().includes("Rs.")) {
            const without_prices_arr = [...prev_arr].filter(obj => Object.keys(obj) !== "price_gte" && Object.keys(obj) !== "price_lte");
            const { price_gte, price_lte } = filter_options;
            return [{ price_gte }, { price_lte }].concat(without_prices_arr);
        }
        const index = prev_arr.findIndex((obj) => Object.values(obj)[0] === obj_val);
        if (index >= 0) {
            const updated_arr = [...prev_arr];
            updated_arr.splice(index, 1);
            return updated_arr;
        }
        return prev_arr; // Return the original array if no match is found
    });
};

export const remove_group_items_from_filters_realtime_update = (set_arr, obj_key) => {
    set_arr((prev_arr) => {
        const updated_arr = prev_arr.filter((obj) => Object.keys(obj)[0] !== obj_key);
        return updated_arr;
    });
};

export const remove_all_items_from_filters_realtime_update = (filter_options, set_arr) => {
    const { sort_by, price_gte, price_lte } = filter_options;
    set_arr([{ sort_by }, { price_gte }, { price_lte }]);
};


export const configure_query_filters = (router_query) => {
    if (typeof router_query === "object" && !Array.isArray(router_query) && Object.keys(router_query).length) {
        const query_filters = [];
        Object.entries(router_query).forEach(([key, value]) => {
            if (typeof value === "string") {
                query_filters.push({ [key]: value });
            } else {
                value.forEach(each_value => {
                    query_filters.push({ [key]: each_value });
                });
            }
        });
        return query_filters;
    }
    return [];
};

export const add_query_filters = (query_filters, set_filters) => {

    const s_c_b = query_filters.filter(e => {
        const key = Object.keys(e)[0]
        return (key === "size" || key === "condition" || key === "brand")
    });


    const without_s_c_b = query_filters.filter(e => {
        const key = Object.keys(e)[0]
        return (key !== "size" && key !== "condition" && key !== "brand")
    });

    if (!without_s_c_b.length && !s_c_b.length) {
        return;
    }

    if (!without_s_c_b.length && s_c_b.length) {
        set_filters(prev_arr => {
            const copy_prev = [...prev_arr];
            for (const each_query of s_c_b) {
                const matched_query_index = prev_arr.findIndex(e => {
                    const existing = Object.entries(e)[0];
                    const _new = Object.entries(each_query)[0];
                    return (existing[0] === _new[0] && existing[1] === _new[1])
                });
                if (matched_query_index !== -1) {
                    copy_prev.splice(matched_query_index, 1, each_query);
                } else {
                    copy_prev.push(each_query);
                }
            }
            return copy_prev;
        })
    }

    set_filters(prev_arr => {
        const copy_prev = [...prev_arr];
        for (const each_query of without_s_c_b) {
            const matched_query_index = prev_arr.findIndex(e => Object.keys(e)[0] === Object.keys(each_query)[0]);
            if (matched_query_index !== -1) {
                copy_prev.splice(matched_query_index, 1, each_query);
            } else {
                copy_prev.push(each_query);
            }
        }
        return copy_prev;
    });
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