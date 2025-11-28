const PIXEL_ID_1 = process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_1;
const PIXEL_ID_2 = process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT;


const STORES_PIXEL_ID = {
  "Barefoot": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Kickskraze": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Casual-footwear": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Formal-footwear": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Sandals": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Footwear-accessories": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT,
  "Apparel": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_APPAREL,
  "Jewelry": process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_JEWELRY,
}


export const MetaPixel = {
  pageView: () => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID_1, "PageView");
      window.fbq("trackSingle", PIXEL_ID_2, "PageView");
    }
  },
  trackEvent: (event, data = {}, store_name) => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID_1, event, data);
      window.fbq("trackSingle", PIXEL_ID_2, event, data);
      // if (STORES_PIXEL_ID[store_name]) window.fbq("trackSingle", STORES_PIXEL_ID[store_name], event, data);

    }
  },
};