import firebase from "./modules/firebase"
import pwa from "./modules/pwa"
import axios from "./modules/axios"
import styleResources from "./modules/styles"
import head from "./modules/head"
import i18n from "./modules/i18n"
import env from "./modules/env"
export default {
  vue: {
    config: {
      productionTip: true,
      devtools: true,
    }
  },
  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },
  target: "server",
  ssr: true,
  srcDir: "client",
  router: {
    base: "/"
  },
  components: true,
  head,
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    "~/plugins/components",
    "~/plugins/components.client",
    "~/plugins/axios",
  ],
  firebase,
  buildModules: [
    "@nuxtjs/eslint-module"
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/style-resources",
    "@nuxtjs/svg-sprite",
    "nuxt-i18n",
    "cookie-universal-nuxt",
    "@nuxtjs/firebase",
  ],
  axios,
  pwa,
  styleResources,
  svgSprite: {
    input: "~/assets/svg",
    output: "~/static/icons/",
  },
  css: [
    "@assets/styles/index.scss",
  ],
  i18n,
  env
}