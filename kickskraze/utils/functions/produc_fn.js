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
    const images = media.filter(e => e.type === "image");
    return images.sort((a, b) => b.thumbnail - a.thumbnail)[0].url;

}