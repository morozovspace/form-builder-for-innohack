<script>
import { mapActions, mapGetters } from "vuex"
import { validationMixin } from "vuelidate" // https://vuelidate.js.org
import * as defaultValidators from "vuelidate/lib/validators" // https://vuelidate.js.org/#sub-builtin-validators
import BaseInput from "@/components/controls/BaseInput"
import BaseCheckbox from "@/components/controls/BaseCheckbox"
import BaseRadio from "@/components/controls/BaseRadio"
import BaseSwitch from "@/components/controls/BaseSwitch"
import BaseSelect from "@/components/controls/BaseSelect"
const object = require("lodash/object")
const lang = require("lodash/lang")
const string = require("lodash/string")
export default {
  components: {
    BaseInput,
    BaseCheckbox,
    BaseRadio,
    BaseSwitch,
    BaseSelect,
  },
  mixins: [validationMixin],
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    labelPosition: {
      type: String,
      default: "top",
    },
    labelWidth: {
      type: String,
      default: "190px",
    },
  },
  data() {
    return {
      id: null,
      editMode: true,
      validators: {
        ...defaultValidators,
      },
    }
  },
  computed: {
    ...mapGetters({
      findByID: "form/findByID",
      plain: "form/plain",
    }),
    form() {
      return this.findByID(this.id)
    },
    step() {
      if (lang.isObject(this.form) && object.has(this.form, "step")) {
        return this.form.step
      }
      return null
    },
    visibleFields() {
      if (
        lang.isObject(this.form) &&
        object.has(this.form, "schema") &&
        object.has(this.form, "step")
      ) {
        return this.form.schema[this.form.step]
      }
      return []
    },
    fields() {
      const payload = []
      if (lang.isObject(this.form) && object.has(this.form, "schema")) {
        for (const step of this.form.schema) {
          payload.push(...step)
        }
      }
      return payload
    },
    formValues() {
      if (lang.isObject(this.form) && object.has(this.form, "id")) {
        return this.plain(this.form.id)
      }
      return {}
    },
    disabled() {
      if (this.editMode === false) {
        return true
      }
      return lang.isObject(this.form) && object.has(this.form, "disabled")
        ? this.form.disabled
        : false
    },
  },
  watch: {
    $attrs: {
      deep: true,
      immediate: true,
      async handler(newValue, oldValue) {
        await this.initAttrs(newValue, oldValue)
      },
    },
    formValues: {
      deep: true,
      immediate: true,
      async handler(newValue, oldValue) {
        if (lang.isObject(this.form)) {
          await this.bindValidationObjectToForm({
            id: this.form.id,
            $v: this.$v,
          })
          await this.updateDependency({
            oldValue,
            newValue,
            formID: this.form.id,
          })
          await this.bindValidationObjectToForm({
            id: this.form.id,
            $v: this.$v,
          })
          this.$emit("update", newValue, oldValue)
        }
      },
    },
    step: {
      immediate: true,
      handler(value) {
        if (!lang.isNull(value)) {
          this.$emit("change-step", value)
        }
      },
    },
  },
  methods: {
    async initAttrs(attrs, oldAttrs = {}) {
      const values = [
        "id",
        "editMode",
        {
          key: "valudators",
          init: (v) => {
            return {
              ...defaultValidators,
              ...v,
            }
          },
        },
      ]
      for (const value of values) {
        let key = value
        let init = async (v) => await Promise.resolve(v)
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
          this[key] = await init(attrs[key])
        }
      }
    },
    ...mapActions({
      createForm: "form/create",
      removeForm: "form/remove",
      addField: "form/addField",
      updateFormField: "form/updateField",
      updateDependency: "form/updateDependency",
      bindValidationObjectToForm: "form/bindValidation",
    }),
    async create(config) {
      try {
        const form = await this.createForm(config)
        this.id = form.id
        return Promise.resolve(form)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    remove(id = null) {
      if (lang.isNull(id)) {
        id = this.id
      }
      return Promise.resolve(this.removeForm(id))
    },
    capitalize(value) {
      return string.capitalize(value)
    },
    showError(e) {
      this.$notify({
        title: this.$t("error"),
        message: this.$t(e.message),
        type: "error",
      })
    },
    async updateField(fieldId, value) {
      try {
        await this.updateFormField({
          formID: this.form.id,
          fieldId,
          value: value.masked,
        })
        return Promise.resolve(value.masked)
      } catch (e) {
        this.showError(e)
      }
    },
    resetFieldValidation(fieldId) {
      this.$v.formValues[fieldId].$reset()
    },
    getErrorMessage(fieldId) {
      const field = this.$v.formValues[fieldId]
      const exclude = [
        "$anyDirty",
        "$model",
        "$pending",
        "$params",
        "$anyError",
        "$dirty",
        "$invalid",
        "$error",
      ]
      const validations = Object.keys(field).filter((v) => !exclude.includes(v))
      for (const v of validations) {
        console.log(v, field[v], field)
        if (field[v] === false) {
          return this.$t(`form.validation.${v}`)
        }
      }
      return ""
    },
    showMessage(fieldId) {
      if (this.editMode) {
        return this.$v.formValues[fieldId].$invalid
      }
      return false
    },
    isRequired(fieldId) {
      if (this.editMode) {
        return object.has(this.$v.formValues[fieldId], "required")
      }
      return false
    },
    getSuggestions(id, data) {
      this.$emit("get-suggestions", id, data)
    },
    async selectSuggestion(id, suggestion) {
      this.$emit("select-suggestion", id, suggestion)
      const filter = this.fields.filter(
        (f) => f.params.suggestion && object.has(suggestion.data, f.id)
      )
      for (const field of filter) {
        await this.updateField(field.id, { masked: suggestion.data[field.id] })
      }
    },
  },
  validations() {
    try {
      const formValues = {}
      for (const field of this.fields) {
        formValues[field.id] = {}
        for (const val of field.validations) {
          if (lang.isString(val)) {
            formValues[field.id][val] = this.validators[val]
          } else if (lang.isObject(val)) {
            const id =
              lang.isNull(val.customID) || lang.isUndefined(val.customID)
                ? val.id
                : val.customID
            console.log("CEE", val.payload)
            formValues[field.id][id] = val.payload
              ? this.validators[val.id](val.payload)
              : this.validators[val.id]
          }
          /*
          
          formValues[field.id][id] = val.payload
            ? this.validators[val.id](val.payload)
            : this.validators[val.id]
          */
        }
      }
      return {
        formValues,
      }
    } catch (e) {
      console.log(e)
      this.showError(e)
    }
  },
}
</script>
<template>
  <el-form
    ref="form"
    :inline="inline"
    :label-position="labelPosition"
    :label-width="labelWidth"
    :disabled="disabled"
    @submit.native.prevent
  >
    <el-form-item
      v-for="field of visibleFields"
      :key="field.id"
      :label="$t(field.label)"
      :error="getErrorMessage(field.id)"
      :show-message="showMessage(field.id)"
      inline-message="SDASD"
      :required="isRequired(field.id)"
    >
      <component
        :is="`Base${capitalize(field['field-type'])}`"
        :id="field.id"
        :label="field.label"
        :value="field.value"
        v-bind="field.params"
        @change="updateField(field.id, $event)"
        @reset="resetFieldValidation(field.id)"
        @get-suggestions="getSuggestions"
        @select-suggestion="selectSuggestion"
      />
    </el-form-item>
  </el-form>
</template>
