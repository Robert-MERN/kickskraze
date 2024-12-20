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