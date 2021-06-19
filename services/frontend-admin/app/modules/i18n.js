const locales = [
  { code: "en", iso: "en-US", name: "English",  file: "en.json" },
  { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.json" },
]

export default {
  locales: locales,
  defaultLocale: "en",
  seo: false,
  detectBrowserLanguage: {
    alwaysRedirect: false,
    fallbackLocale: "en",
    onlyOnRoot: false,
    useCookie: false,
    cookieCrossOrigin: true,
    cookieDomain: null,
    cookieKey: "i18n_locale",
    cookieSecure: true
  },
  strategy: "no_prefix",
  lazy: true,
  useCookie: true,
  langDir: "@/static/lang",
  vueI18n: {
    fallbackLocale: "en",
    silentTranslationWarn: true,
  },
}
