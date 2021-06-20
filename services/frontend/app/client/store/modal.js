import schema from "@/static/schemas/modal/schema.json"
import defs from "@/static/schemas/modal/defs.json"
import confirmConfig from "@/static/modals/confirm.json"
console.log("IMPORT")
const lang = require("lodash/lang")
export const state = () => ({
  list: [],
})
export const getters = {
  isAnyOpened: (state) => state.list.find((modal) => modal.open === true),
  getIndexById: (state) => (id) =>
    state.list.findIndex((modal) => modal.id === id),
  opened: (state) => state.list.filter((el) => el.open === true),
  lastOpenedModal: (state) => {
    const array = state.list.filter((el) => el.open === true)
    return array[array.length - 1]
  },
}

export const actions = {
  async confirm({ dispatch }, config = {}) {
    try {
      let res = false
      const id = await dispatch("create", { ...confirmConfig, ...config })
      const { promises } = await dispatch("open", id)
      const modal = await promises.opening.promise
      async function close(control, c) {
        await control.disable()
        await control.clearTimer()
        if (!lang.isUndefined(c)) {
          res = c
        }
        await modal.remove()
      }
      const cancel = modal.getButton("cancel")
      const confirm = modal.getButton("confirm")
      modal.$on("close-by-x", async function (form, control) {
        await close(control)
      })
      cancel.$on("time-estimated", async (control) => {
        await close(control)
      })
      cancel.$on("change", async (value, control) => {
        try {
          await close(control)
        } catch (e) {
          return Promise.reject(e)
        }
      })

      confirm.$on("change", async (value, control) => {
        try {
          await close(control, true)
        } catch (e) {
          return Promise.reject(e)
        }
      })
      await promises.closing.promise
      return Promise.resolve(res)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async prepare({ state, dispatch }, source) {
    try {
      await dispatch(
        "utils/validate",
        {
          schema,
          schemas: [defs],
          source,
        },
        {
          root: true,
        }
      )
      const opening = new Promise((resolve, reject) => {
        dispatch(
          "utils/setProperty",
          {
            obj: source,
            path: "promises.opening.deferreds",
            value: { resolve, reject },
          },
          {
            root: true,
          }
        )
      })
      await dispatch(
        "utils/setProperty",
        {
          obj: source,
          path: "promises.opening.promise",
          value: opening,
        },
        {
          root: true,
        }
      )
      const closing = new Promise((resolve, reject) => {
        dispatch(
          "utils/setProperty",
          {
            obj: source,
            path: "promises.closing.deferreds",
            value: { resolve, reject },
          },
          {
            root: true,
          }
        )
      })
      await dispatch(
        "utils/setProperty",
        {
          obj: source,
          path: "promises.closing.promise",
          value: closing,
        },
        {
          root: true,
        }
      )
      return Promise.resolve(source)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async create({ state, dispatch, getters }, source) {
    try {
      if (
        ((lang.isObject(source) || lang.isString(source)) &&
          lang.isEmpty(source)) ||
        (!lang.isObject(source) && !lang.isString(source))
      ) {
        throw new TypeError(`Modal source is invalid ${source}`)
      }
      if (lang.isString(source)) {
        const response = await this.$axios.get(source, {
          headers: {
            Accept: "application/json",
          },
        })

        source = await dispatch(
          "utils/checkResponseType",
          {
            response,
            contentType: "application/json",
          },
          {
            root: true,
          }
        )
      }

      const value = await dispatch("prepare", source)
      const index = getters.getIndexById(value.id)
      if (index !== -1) {
        throw new Error(`Modal window with id: ${value.id} already created.`)
      }
      await dispatch(
        "utils/pushToArray",
        {
          obj: state,
          path: "list",
          value,
        },
        {
          root: true,
        }
      )
      return Promise.resolve(value.id)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async open({ state, dispatch, getters }, id) {
    try {
      const index = getters.getIndexById(id)
      if (index === -1) {
        throw new Error(`Cannnot find modal window with id: ${id}.`)
      }
      if (state.list[index].open) {
        throw new Error(`Modal window with id: ${id} already opened.`)
      }
      /*
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[index],
          path: "lastFocused",
          value: document.activeElement,
        },
        {
          root: true,
        }
      )
      */
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[index],
          path: "open",
          value: true,
        },
        {
          root: true,
        }
      )
      /*
      const modal = document.querySelector(".modal__current")
      Array.prototype.forEach.call(document.getElementsByTagName("*"), (o) => {
        if (o.tabIndex > -1 && !rootGetters["utils/isDescendant"](modal, o)) {
          o.dataset.originalTabIndex = o.tabIndex
          o.tabIndex = -1
        }
      })
      */
      return Promise.resolve(state.list[index])
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async remove({ state, dispatch, getters }, id) {
    try {
      const index = getters.getIndexById(id)
      if (index === -1) {
        throw new Error(`Cannnot find modal window with id: ${id}.`)
      }
      await dispatch(
        "utils/removeFromArrayByIndex",
        {
          obj: state,
          path: "list",
          index,
        },
        {
          root: true,
        }
      )
      return Promise.resolve(id)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async close({ state, dispatch, getters }, id) {
    try {
      const index = getters.getIndexById(id)
      if (index === -1) {
        return Promise.reject(
          new Error(`Cannnot find modal window with id ${id}.`)
        )
      }
      // On close
      // restore tabs
      Array.prototype.forEach.call(
        document.querySelectorAll("[data-original-tab-index]"),
        (o) => {
          o.tabIndex = o.dataset.originalTabIndex
          delete o.dataset.originalTabIndex
        }
      )
      // change open state: true -> false
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[index],
          path: "open",
          value: false,
        },
        {
          root: true,
        }
      )
      /*
      rootState.modal.list[index].lastFocused &&
        rootState.modal.list[index].lastFocused.focus()
      */
      return Promise.resolve(id)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async dependency({ state, getters, dispatch }, { id, newValue, oldValue }) {
    try {
      const index = getters.getIndexById(id)
      if (index === -1) {
        return Promise.reject(
          new Error(`Cannnot find modal window with id ${id}.`)
        )
      }
      const d = state.list[index].dependency
      const dependency = d.filter(
        (dep) =>
          !lang.isUndefined(newValue[dep.fieldId]) &&
          newValue[dep.fieldId] !== oldValue[dep.fieldId]
      )
      let label = lang.cloneDeep(state.list[index].label)
      for (const dep of dependency) {
        const key = dep.keys.find((k) => newValue[dep.fieldId] === k.key)
        if (key && !lang.isUndefined(key.label)) {
          label = key.label
          break
        } else if (!lang.isUndefined(dep.default.label)) {
          label = dep.default.label
        }
      }
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[index],
          path: "label",
          value: label,
        },
        {
          root: true,
        }
      )
    } catch (e) {
      return Promise.reject(e)
    }
  },
}
