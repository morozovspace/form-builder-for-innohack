<script>
import TheForm from "@/components/BaseForm"
import BaseButton from "@/components/controls/BaseButton"
import { mapGetters, mapActions } from "vuex"
const object = require("lodash/object")
const lang = require("lodash/lang")
export default {
  components: {
    TheForm,
    BaseButton,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    open: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    form: {
      type: String,
      default: "",
    },
    promises: {
      type: Object,
      default: () => {},
    },
    controls: {
      type: Array,
      default: () => [],
    },
    editMode: {
      type: Boolean,
      default: true,
    },
    current: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formID: "",
      cDisabled: false,
      cEditMode: true,
      cControls: [],
    }
  },
  computed: {
    ...mapGetters({
      findByID: "form/findByID",
    }),
    preparedLabel() {
      let label = lang.clone(this.label)
      const re = /{([^}]+)}/g
      let mathces = this.label.match(re)
      if (!lang.isArray(mathces)) {
        mathces = []
      }
      for (const match of mathces) {
        const matchWords = match
          .replace(/[{}]+/g, "")
          .split(/,|\./)
          .map((w) => w.trim())
        for (const word of matchWords) {
          const rw = word
            .replace(/["]+/g, "")
            .split("||")
            .map((w) => w.trim())
          const id = rw[0]
          let field = null
          for (const step of this.formInstance.schema) {
            if (!field) {
              field = step.find((f) => f.id === id)
              if (field) {
                break
              }
            }
          }
          let value = "-"
          if (field) {
            if (field["field-type"] === "select") {
              const option = field.params.options.find(
                (o) => o.value === field.value
              )
              if (!lang.isUndefined(option)) {
                value = option.label
              }
            } else if (field.value === "") {
              if (rw.length > 1) {
                value = rw[1].replace(/[']+/g, "")
              } else {
                value = "'-'".replace(/[']+/g, "")
              }
            } else {
              value = field.value
            }
          } else if (rw.length > 1) {
            value = rw[1].replace(/[']+/g, "")
          }
          label = label.replace(match, this.$t(value))
        }
      }
      label = label
        .split(" ")
        .map((w) => this.$t(w))
        .join(" ")
      return label
    },
    preparedDesc() {
      return this.$t(this.description)
    },
    formInstance() {
      return this.findByID(this.formID)
    },
    visibleControls() {
      return this.cControls.filter((i) => {
        return lang.isUndefined(i.visible) ? true : i.visible
      })
    },
  },
  watch: {
    disabled: {
      immediate: true,
      handler(value) {
        this.cDisabled = value
      },
    },
    controls: {
      deep: true,
      immediate: true,
      handler(value) {
        this.cControls = lang.cloneDeep(value)
      },
    },
    editMode: {
      deep: true,
      immediate: true,
      handler(value) {
        this.cEditMode = lang.clone(value)
      },
    },
  },
  async beforeDestroy() {
    await this.removeCurrentForm()
    await this.promises.closing.deferreds.resolve(this)
  },
  async created() {
    try {
      const vm = this
      vm.promises.opening.deferreds.resolve(vm)
      if (vm.form) {
        vm.formID = (await vm.createForm(vm.form)).id
      }
    } catch (e) {
      this.showError(e)
    }
  },
  methods: {
    ...mapActions({
      createForm: "form/create",
      removeForm: "form/remove",
      setStep: "form/setStep",
      handleDependency: "modal/dependency",
      removeModal: "modal/remove",
      closeModal: "modal/close",
    }),
    showError(e) {
      this.$notify({
        title: this.$t("error"),
        message: this.$t(e.message),
        type: "error",
      })
    },
    async handleAction(control, ref) {
      try {
        this.cDisabled = true
        if (object.has(control, "action")) {
          await control.action(ref)
        }
        this.cDisabled = false
      } catch (e) {
        this.showError(e)
      }
    },
    async removeCurrentForm() {
      try {
        if (this.formID) {
          await this.removeForm(this.formID)
          return Promise.resolve("removed")
        }
        return Promise.resolve("not-removed")
      } catch (e) {
        return Promise.reject(e)
      }
    },
    getButton(id = "") {
      try {
        const index = this.cControls.findIndex((i) => i.id === id)
        if (lang.isUndefined(index)) {
          return Promise.reject(new Error(`Can\`t find button ${id}`))
        }
        return this.$refs[`control-${this.cControls[index].id}`][0]
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async previousStep() {
      try {
        const id = this.formInstance.id
        let step = this.formInstance.step
        await this.setStep({ formID: id, value: --step })
        return Promise.resolve(step)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async nextStep() {
      try {
        const id = this.formInstance.id
        let step = this.formInstance.step
        await this.setStep({ formID: id, value: ++step })
        return Promise.resolve(step)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async remove() {
      try {
        await this.removeModal(this.id)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async close() {
      try {
        await this.closeModal(this.id)
        return Promise.resolve()
      } catch (e) {
        return Promise.reject(e)
      }
    },
    disableForm() {
      this.cEditMode = false
    },
    enableForm() {
      this.cEditMode = true
    },
    disableControls() {
      this.cDisabled = false
    },
    enableControls() {
      this.cDisabled = true
    },
    isDisabled(self) {
      if (self) {
        return self
      }
      return this.cDisabled
    },
    changeStep(step) {
      this.$emit("change-step", this.formInstance, step)
    },
    async formValuesUpdated(newValue, oldValue) {
      await this.handleDependency({ id: this.id, newValue, oldValue })
      this.$emit("form-updated", this.formInstance)
    },
    closeByButton(value, control) {
      this.$emit("close-by-x", this.formInstance, control)
    },
  },
}
</script>
<template>
  <div v-if="open" :class="['modal', open ? 'modal__open' : 'modal__close']">
    <div class="modal__wrapper">
      <div class="modal__header">
        <BaseButton
          v-if="current"
          ref="control-close"
          :disabled="cDisabled"
          :show-tooltip="true"
          :tooltip="$t('close')"
          :circle="true"
          type=""
          size="medium"
          icon="el-icon-close"
          class="modal__close-button"
          @change="closeByButton"
        />
        <span v-if="preparedLabel" class="modal__label">{{
          preparedLabel
        }}</span>
        <span v-if="preparedDesc" class="modal__text">{{ preparedDesc }}</span>
      </div>
      <TheForm
        ref="form"
        v-if="form"
        :id="formID"
        :edit-mode="cEditMode"
        class="modal__content"
        label-position="top"
        @changeStep="changeStep"
        @update="formValuesUpdated"
      />
      <div v-if="visibleControls.length" class="modal__footer">
        <BaseButton
          v-for="(control, i) of visibleControls"
          :key="i"
          :ref="`control-${control.id}`"
          :disabled="isDisabled(control.disabled)"
          :label="$t(control.label)"
          :timeout="control.timeout"
          :type="control.type"
          :plain="true"
          @change="handleAction(control, $refs[`control-${control.id}`][0])"
        />
      </div>
    </div>
  </div>
</template>
