const lang = require("lodash/lang")
export default {
  props: {
    options: {
      type: [Array],
      default: () => [],
    },
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
  },
  methods: {
    isDisabled(item) {
      if (this.disabled) {
        return true
      }
      return item.disabled === true
    },
  },
  computed: {
    show() {
      return !lang.isNull(this.value)
    },
    cMin() {
      return !lang.isNull(this.min) && this.min > 0 ? this.min : 0
    },
    cMax() {
      return !lang.isNull(this.max) && this.max <= this.options.length
        ? this.max
        : this.options.length
    },
  },
}
