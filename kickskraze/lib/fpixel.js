const PIXEL_ID_1 = process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_1;
const PIXEL_ID_2 = process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_2;

export const MetaPixel = {
  pageView: () => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID_1, "PageView");
      window.fbq("trackSingle", PIXEL_ID_2, "PageView");
    }
  },
  trackEvent: (event, data = {}) => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID_1, event, data);
      window.fbq("trackSingle", PIXEL_ID_2, event, data);
    }
  },
};