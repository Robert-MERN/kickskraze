const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_META_PIXEL_ID_BAREFOOT;

export const MetaPixel = {
  pageView: () => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID, "PageView");
    }
  },
  trackEvent: (event, data = {}) => {
    if (window.fbq) {
      window.fbq("trackSingle", PIXEL_ID, event, data);
    }
  },
};