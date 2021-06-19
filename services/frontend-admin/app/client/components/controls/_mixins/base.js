import { mapActions } from "vuex"
const lang = require("lodash/lang")
const object = require("lodash/object")
export default {
  inheritAttrs: false,
  props: {
    id: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: null,
      mask: null,
      maskInstance: null,
      dirty: false,
      cDisabled: false,
    }
  },
  async mounted() {
    await this.initAttrs(this.$attrs)
  },
  async beforeDestroy() {
    if (!lang.isNull(this.maskInstance)) {
      await this.maskInstance.destroy()
    }
  },
  watch: {
    disabled: {
      immediate: true,
      handler(value) {
        this.cDisabled = lang.clone(value)
      },
    },
    value: {
      deep: true,
      handler(newValue, oldValue) {
        if (!lang.isEqual(newValue, oldValue)) {
          const control = this
          let masked = newValue
          let unmasked = newValue
          if (
            !lang.isNull(this.maskInstance) &&
            lang.isObject(this.maskInstance)
          ) {
            this.maskInstance.value = masked
            masked = this.maskInstance.value
            unmasked = this.maskInstance.unmaskedValue
          }
          this.$emit("change", { masked, unmasked }, control, this.dirty)
          if (!this.dirty) {
            this.dirty = true
          }
        }
      },
    },
    $attrs: {
      deep: true,
      async handler(newValue, oldValue) {
        await this.initAttrs(newValue, oldValue)
      },
    },
    dirty(value) {
      if (!value) {
        this.$emit("reset")
      }
    },
    cDisabled(value) {
      if (value) {
        this.$emit("disabled")
      } else {
        this.$emit("enabled")
      }
    },
  },
  methods: {
    ...mapActions({
      getMaskById: "utils/getMaskById",
    }),
    async initMask(mask) {
      if (!lang.isNull(this.maskInstance)) {
        this.maskInstance.destroy()
      }
      if (lang.isString(mask) && !lang.isEmpty(mask)) {
        const control = this.$refs.control.$el.querySelector("input")
        const foundMask = await this.getMaskById(mask)
        this.maskInstance = null
        if (foundMask) {
          this.maskInstance = await foundMask.init(control)
        }
      }
    },
    initValue(value) {
      this.dirty = false
    },
    async initAttrs(attrs, oldAttrs = {}) {
      const values = [
        {
          key: "mask",
          init: this.initMask,
        },
        {
          key: "value",
          init: this.initValue,
        },
      ]
      for (const value of values) {
        let key = value
        let init = async () => await Promise.resolve()
        if (lang.isObject(key)) {
          if (object.has(key, "init")) {
            init = key.init
          }
          key = value.key
        }

        if (
          object.has(attrs, key) &&
          !lang.isEqual(oldAttrs[key], attrs[key])
        ) {
          await init(attrs[key])
          await (this[key] = attrs[key])
        }
      }
    },
    disable() {
      this.cDisabled = true
    },
    enable() {
      this.cDisabled = false
    },
  },
}
