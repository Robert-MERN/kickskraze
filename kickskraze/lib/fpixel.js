export const MetaPixel = {
  pageView: () => {
    window.fbq && window.fbq("track", "PageView");
  },
  trackEvent: (event, data = {}) => {
    window.fbq && window.fbq("track", event, data);
  },
};