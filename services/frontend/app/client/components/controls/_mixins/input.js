const lang = require("lodash/lang")
const object = require("lodash/object")
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    inputmode: {
      type: String,
      default: "text",
    },
    placeholder: {
      type: String,
      default: "controls.input.placeholder",
    },
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    prepend: {
      type: String,
      default: "",
    },
    prependIcon: {
      type: String,
      default: "",
    },
    suggestion: {
      type: [Boolean, String],
      default: false,
    },
  },
  computed: {
    showSuggestion() {
      if (lang.isBoolean(this.suggestion) && this.suggestion) {
        return true
      }
      return this.suggestion
    },
  },
  methods: {
    async querySearch(qs, cb) {
      const res = await this.$axios.$get("/public/calc")
      const data = {
        params: {
          options: [],
        },
      }
      object.merge(data, res)
      this.$emit("get-suggestions", this.id, data)
      cb(data.params.options)
    },
    select(value) {
      this.$emit("select-suggestion", this.id, value)
    },
  },
}
