import { vuexfireMutations, firestoreAction } from "vuexfire"
// import createConfig from "@/static/modals/createForm.json"
const lang = require("lodash/lang")
export const actions = {
  async nuxtServerInit(
    { state, commit, dispatch },
    { res, req, redirect, $cookies, $fire, $axios }
  ) {
    if (req.headers && req.headers.cookie) {
      if (
        process.env.NODE_ENV === "production" &&
        req.headers.host !== process.env.HOSTNAME
      ) {
        return redirect(process.env.HOSTNAME)
      }
      const theme = $cookies.get("theme")
      if (theme === "dark") {
        commit("SET_THEME", theme)
      } else if (theme === "light") {
        commit("SET_THEME", theme)
      } else {
        commit("SET_THEME", state.theme)
      }
    }

    /** authUser on the server */
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, ...authUser } = res.locals.user

      await dispatch("auth/onAuthStateChanged", {
        authUser,
        claims,
      })
    }
  },
  switchTheme({ state, commit }) {
    state.theme === "light"
      ? commit("SET_THEME", "dark")
      : commit("SET_THEME", "light")
  },
  addForm: firestoreAction(async function ({ dispatch }, payload) {
    try {
      const data = {
        label: "Test label",
        description: "Test description",
      }
      await this.$fire.firestore.collection("forms").add(data)
      /*
      await this.$fire.firestore
        .collection("forms")
        .add(JSON.parse(JSON.stringify({ test: "Text" })))
        */
    } catch (e) {
      console.log(Object.keys(e))
    }
  }),
  saveNote({ state }, { name, text }) {
    // Save note
  },
  bindForms: firestoreAction(async function ({ bindFirestoreRef }) {
    try {
      await bindFirestoreRef(
        "forms",
        this.$fire.firestore.collection("forms"),
        {
          wait: true,
        }
      )
    } catch (e) {
      console.log("BIND NOTES", e)
    }
  }),
  unbindForms: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef("forms", false)
  }),
  bindForm: firestoreAction(async function ({ bindFirestoreRef }, id) {
    try {
      await bindFirestoreRef(
        "form",
        this.$fire.firestore.collection("forms").doc(lang.cloneDeep(id)),
        {
          wait: true,
        }
      )
    } catch (e) {
      console.log("BIND NOTES", e)
    }
  }),
  unbindForm: firestoreAction(function ({ unbindFirestoreRef }) {
    unbindFirestoreRef("form", false)
  }),
}

export const mutations = {
  ...vuexfireMutations,
  SET_COUNT_DOCUMENT: (state, countDocument) => {
    state.countDocument = countDocument
  },
  SET_THEME(state, value) {
    state.theme = value
    this.$cookies.set("theme", state.theme)
  },
}

export const state = () => ({
  theme: "dark",
  countDocument: 0,
  forms: [],
  form: {},
})
