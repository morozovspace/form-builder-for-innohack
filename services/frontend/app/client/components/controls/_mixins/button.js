const object = require("lodash/object")
export default {
  props: {
    type: {
      type: String,
      default: "primary",
    },
    size: {
      type: String,
      default: "medium",
    },
    icon: {
      type: String,
      default: "",
    },
    circle: {
      type: Boolean,
      default: false,
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      timeout: 0,
      timer: null,
      percentage: 0,
      cIcon: "",
      showTooltip: false,
      disableTooltip: false,
      defaultIcon: "",
    }
  },
  computed: {
    cLabel() {
      try {
        return this.$t(this.label)
      } catch (e) {
        return this.label
      }
    },
    cTooltip() {
      try {
        return this.$t(this.tooltip)
      } catch (e) {
        return this.tooltip
      }
    },
  },
  watch: {
    $attrs: {
      deep: true,
      immediate: true,
      async handler(value) {
        await this.initSelfAttrs(value)
      },
    },
    tooltip: {
      immediate: true,
      handler(value) {
        this.disableTooltip = !value
      },
    },
    async timeout(value) {
      await this.clearTimer()
      await this.startTimer(value)
    },
    icon: {
      immediate: true,
      handler(value) {
        this.cIcon = value
        this.defaultIcon = value
      },
    },
  },
  methods: {
    initSelfAttrs(attrs) {
      if (object.has(attrs, "timeout")) {
        this.timeout = parseInt(attrs.timeout)
      }
    },
    clearTimer() {
      this.stopTimer()
      this.timer = null
    },
    stopTimer() {
      window.cancelAnimationFrame(this.timer)
    },
    startTimer(duration) {
      const vm = this
      if (duration) {
        const st = window.performance.now()

        vm.timer = window.requestAnimationFrame((time) => {
          vm.step({
            duration,
            time,
            st,
          })
        })
      }
    },
    step({ duration, time, st }) {
      const vm = this
      const diff = Math.round(time - st)
      vm.percentage = Math.round((diff / duration) * 100)
      vm.percentage = vm.percentage > 100 ? 100 : vm.percentage
      if (diff < duration) {
        vm.timer = window.requestAnimationFrame(function (time) {
          vm.step({
            duration,
            time,
            st,
          })
        })
      } else {
        vm.$emit("time-estimated", vm)
      }
    },
    setIcon(value) {
      this.cIcon = value
    },
    setStatus(status) {
      switch (status) {
        case "default":
          this.setIcon(this.defaultIcon)
          break
        case "loading":
          this.setIcon("el-icon-loading")
          break
        default:
          this.setIcon(this.defaultIcon)
          break
      }
    },
    click() {
      if (!this.cDisable) {
        const vm = this
        vm.showTooltip = false
        vm.value = !vm.value
      }
    },
  },
  beforeDestroy() {
    this.clearTimer()
  },
}
