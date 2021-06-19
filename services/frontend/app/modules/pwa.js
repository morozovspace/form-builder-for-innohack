export default {
  icon: false,
  name: "Default name",
  description: "Default description",
  lang: "en",
  meta: {
    ogSiteName: "Form builder", // your website brand
    ogTitle: "Form builder title",
    ogDescription: "Form builder description",
    ogHost: "localhost", // specify the domain that the site is hosted. Required for ogImage.
    ogImage: {
      path: "",
      width: 850,
      height: 450,
      type: "image/png"
    },
    appleStatusBarStyle: "black-translucent",
    theme_color: "red",
  },
  manifest: {
    display: "fullscreen",
  },
  workbox: {
    importScripts: ["/firebase-auth-sw.js"],
    // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
    // only set this true for testing and remember to always clear your browser cache in development
    dev: process.env.NODE_ENV === "development",
  },
}