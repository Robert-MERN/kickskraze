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

        if (Object.keys(newObj)[0] === "price_gte") {
            index = prevObjects.findIndex((obj) => Object.keys(obj)[0] === "price_gte");
            // If found, replace it
            const updatedObjects = [...prevObjects];
            updatedObjects.splice(index, 1, newObj);
            return updatedObjects;
            

        };

        if (Object.keys(newObj)[0] === "price_lte") {
            index = prevObjects.findIndex((obj) => Object.keys(obj)[0] === "price_lte");
            // If found, replace it
            const updatedObjects = [...prevObjects];
            updatedObjects.splice(index, 1, newObj);
            return updatedObjects;
        };

        if (Object.keys(newObj)[0] === "sort_by") {
            index = prevObjects.findIndex((obj) => Object.keys(obj)[0] === "sort_by");
            // If found, replace it
            const updatedObjects = [...prevObjects];
            updatedObjects.splice(index, 1, newObj);
            return updatedObjects;
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
            const key = Object.keys(obj)[0]; // Get the key of the object
            const value = obj[key]; // Get the value associated with the key
            return `${key}=${value}`; // Encode key-value pair
        })
        .join("&");
}


export const find_filter = (arr, field) => {
    return arr.find((obj) => Object.keys(obj)[0].includes(field))
}

export const filters_realtime_update = (arr) => {
    // Extract all the values except for `sort_by`
    return arr
        .filter(e => Object.keys(e)[0] !== "sort_by") // Filter out `sort_by`
        .map(e => {
            const key = Object.keys(e)[0];
            const value = Object.values(e)[0];

            if (key === "size" || key === "brand" || key === "condition") {
                return value; // Return the value directly
            }
        })
        .filter(Boolean); // Remove undefined values
};

export const remove_item_from_filters_realtime_update = (set_arr, obj_val, set_started) => {
    set_arr((prev_arr) => {
        const index = prev_arr.findIndex((obj) => Object.values(obj)[0] === obj_val);
        if (index >= 0) {
            const updated_arr = [...prev_arr];
            updated_arr.splice(index, 1);
            if (prev_arr.length === 3) set_started(false);
            return updated_arr;
        }
        return prev_arr; // Return the original array if no match is found
    });
};

export const remove_group_items_from_filters_realtime_update = (set_arr, obj_key, set_started) => {
    set_arr((prev_arr) => {
        const updated_arr = prev_arr.filter((obj) => Object.keys(obj)[0] !== obj_key);
        if (prev_arr.length === 3) set_started(false);
        return updated_arr;
    });
};

export const remove_all_items_from_filters_realtime_update = (set_arr) => {
    set_arr(
        [
            { price_gte: 20000 },
            { price_lte: 0 },
            { sort_by: "created-descending" }
        ]
    );
};



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