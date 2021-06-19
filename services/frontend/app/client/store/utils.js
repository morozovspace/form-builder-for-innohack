import Ajv from "ajv"
import IMask from "imask"
const lang = require("lodash/lang")
const moment = require("moment")
export const mutations = {
  SET(_, { schema, pList, len, value }) {
    schema[pList[len - 1]] = value
  },
  PUSH(_, { schema, pList, len, value }) {
    schema[pList[len - 1]].push(value)
  },
  SPLICE(_, { schema, pList, len, index }) {
    schema[pList[len - 1]].splice(index, 1)
  },
}
export const actions = {
  getMaskById({ state }, id) {
    const customDateBlocks = {
      YYYY: {
        mask: IMask.MaskedRange,
        placeholderChar: this.$i18n.t("form.fields.mask.y"),
        from: 1970,
        to: 2030,
      },
      MM: {
        mask: IMask.MaskedRange,
        placeholderChar: this.$i18n.t("form.fields.mask.m"),
        from: 1,
        to: 12,
      },
      DD: {
        mask: IMask.MaskedRange,
        placeholderChar: this.$i18n.t("form.fields.mask.d"),
        from: 1,
        to: 31,
      },
    }

    const masks = [
      {
        id: "date",
        init(el) {
          const momentFormat = moment.localeData(moment.locale())
            ._longDateFormat.L
          return IMask(el, {
            mask: Date,
            lazy: false,
            pattern: momentFormat,
            format(date) {
              return moment(date).format(momentFormat)
            },
            parse(str) {
              return moment(str, momentFormat)
            },
            blocks: customDateBlocks,
          })
        },
      },
      {
        id: "phone",
        init(el) {
          return IMask(el, {
            mask: [
              {
                startsWith: "8",
                parrern: "+0 (000) 000-00-00",
                mask(value, sv) {
                  if (value.startsWith("8")) {
                    sv._value = "+7"
                  }
                },
                placeholderChar: "_",
                lazy: false,
                country: "Russia",
              },
              {
                mask: "+0 (000) 000-00-00",
                startsWith: "7",
                placeholderChar: "_",
                lazy: false,
                country: "Russia",
              },
              {
                mask: "+0000000000000",
                startsWith: "",
                country: "unknown",
              },
            ],
            dispatch(appended, dynamicMasked) {
              const number = (dynamicMasked.value + appended).replace(/\D/g, "")
              return dynamicMasked.compiledMasks.find(function (m) {
                return number.indexOf(m.startsWith) === 0
              })
            },
          })
        },
      },
      {
        id: "email",
        init(el) {
          return IMask(el, {
            mask: /^\S*@?\S*$/,
          })
        },
      },
      {
        id: "address",
        init(el) {
          return IMask(el, {
            mask: /^\S*?\S*$/,
          })
        },
      },
    ]
    return lang.cloneDeep(masks.find((el) => el.id === id))
  },
  async validate(
    { state },
    {
      source,
      schema = "",
      schemas = [],
      keywords = {},
      baseURL = `${process.env.BASE_LOCATION}/${process.env.ROUTER_BASE}/schemas/`,
      useDefaults = "empty",
      $data = true,
      allErrors = true,
      coerceTypes = false,
    }
  ) {
    try {
      const context = this
      const ajv = new Ajv({
        useDefaults,
        $data,
        schemas,
        allErrors,
        coerceTypes,
        async loadSchema(uri) {
          try {
            // Если baseURL определён - то использовать ссылку с baseURL
            const data = await context.$axios.$get(`${baseURL}${uri}`)
            return Promise.resolve(data)
          } catch (e) {
            return Promise.reject(e)
          }
        },
      })
      require("ajv-merge-patch")(ajv)
      for (const keyword of Object.keys(keywords)) {
        ajv.addKeyword(keyword, keywords[keyword])
      }
      const validate = await ajv.compileAsync(schema)
      await validate(source)
      return Promise.resolve(source)
    } catch (e) {
      return Promise.reject(lang.isArray(e.errors) ? e.errors[0] : e)
    }
  },
  listenESC({ commit }, action) {
    try {
      document.addEventListener("keydown", function (e) {
        e = e || window.event
        let isEscape = false
        if ("key" in e) {
          isEscape = e.key === "Escape" || e.key === "Esc"
        } else {
          isEscape = e.keyCode === 27
        }
        if (isEscape) {
          action()
        }
      })
    } catch (e) {
      return Promise.reject(e)
    }
  },
  setProperty({ commit, getters }, { obj, path, value }) {
    try {
      const target = getters.findProperty(obj, path)
      commit("SET", { ...target, value })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
  getProperty({ getters }, { obj, path, splitter = "." }) {
    const { schema, pList, len } = getters.findProperty(obj, path, splitter)
    return Promise.resolve(schema[pList[len - 1]])
  },
  pushToArray({ commit, getters }, { obj, path, value }) {
    try {
      const target = getters.findProperty(obj, path)
      commit("PUSH", { ...target, value })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
  removeFromArrayByIndex({ commit, getters }, { obj, path, index }) {
    try {
      const target = getters.findProperty(obj, path)
      commit("SPLICE", { ...target, index })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
  checkResponseType(_, { response, contentType }) {
    try {
      const contentTypes = response.headers["content-type"]
      if (contentTypes && contentTypes.includes(contentType)) {
        return Promise.resolve(response.data)
      } else {
        const e = new Error(
          `Endpoint return unexpected content-type. Expect: ${contentType}`
        )
        e.name = "Wrong format"
        throw e
      }
    } catch (e) {
      return Promise.reject(e)
    }
  },
  copyToClipboard(_, str) {
    try {
      const el = document.createElement("textarea")
      el.value = str
      el.setAttribute("readonly", "")
      el.style.position = "absolute"
      el.style.left = "-9999px"
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
}
export const getters = {
  searchForObjectByPartialKey: (state) => (obj, term) => {
    const query = new RegExp(term, "i")
    const keys = Object.keys(obj)
    const props = keys.filter((key) => query.test(key))
    return props
  },
  findProperty:
    (_) =>
    (obj, path, splitter = ".") => {
      let schema = obj
      const pList = path.split(splitter)
      const len = pList.length
      for (let i = 0; i < len - 1; i++) {
        const elem = pList[i]
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem]
      }
      return { schema, pList, len }
    },
  getProperty:
    (_) =>
    (obj, path, splitter = ".") => {
      let schema = obj
      const pList = path.split(splitter)
      const len = pList.length
      for (let i = 0; i < len - 1; i++) {
        const elem = pList[i]
        if (!schema[elem]) schema[elem] = {}
        schema = schema[elem]
      }
      return schema[pList[len - 1]]
    },
  isDescendant: (_) => (ancestor, descendant) => {
    do {
      if (descendant === ancestor) return true
    } while ((descendant = descendant.parentNode))
    return false
  },
}
