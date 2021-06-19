const lang = require("lodash/lang")
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
        return false
      }
      return this.suggestion
    },
  },
  methods: {
    async querySearch(qs, cb) {
      const { suggestions } = await this.$dadata.$post(
        `/${this.suggestion}`,
        JSON.stringify({
          query: qs,
          language: this.$i18n.locale,
          count: 5,
        })
      )
      this.$emit("get-suggestions", this.id, suggestions)
      cb(suggestions)
    },
    select(value) {
      this.$emit("select-suggestion", this.id, value)
    },
  },
}
