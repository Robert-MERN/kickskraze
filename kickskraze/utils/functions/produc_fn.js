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
    // Validate that the argument is Array.
    if (!Array.isArray(purchase)) return "";
    if (!purchase.length) return "";

    if (purchase.every(item => item.store_name === "Barefoot")) return "Barefoot";
    if (purchase.every(item => item.store_name === "Kickskraze")) return "Kickskraze";

    return "Barefoot & Kickskraze";
}


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