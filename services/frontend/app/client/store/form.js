import schema from "@/static/schemas/form/schema.json"
import defs from "@/static/schemas/form/defs.json"
const moment = require("moment")
const lang = require("lodash/lang")
const object = require("lodash/object")
export const state = () => ({
  list: [],
  configCopies: [],
})

export const actions = {
  async prepare({ dispatch }, source) {
    try {
      const modifyValidation = (
        data,
        dataPath,
        parentData,
        parentDataProperty,
        fullData
      ) => {
        if (!parentData) {
          return true
        }
        const validationID = lang.isObject(data) ? data.id : data
        const validationPayload = lang.isObject(data) ? data.payload : false
        const validation = {
          id: validationID,
          payload: validationPayload,
        }
        if (lang.isArray(parentData)) {
          parentData[parentDataProperty] = validation
        } else {
          parentData[parentDataProperty] = [validation]
        }
        return true
      }

      const isAllias = (
        data,
        dataPath,
        parentData,
        parentDataProperty,
        fullData
      ) => {
        if (lang.isObject(data) && !object.has(data, "from")) {
          return Promise.resolve(false)
        }
        const fieldId = lang.isObject(data) ? data.from : data
        const fieldIndex = fullData.fields.findIndex(
          (field) => field.id === fieldId
        )
        if (fieldIndex === -1) {
          return Promise.reject(new Error(`Allias: ${fieldId} undefined`))
        }
        return Promise.resolve(true)
      }
      const fieldFromAllias = (
        data,
        dataPath,
        parentData,
        parentDataProperty,
        fullData
      ) => {
        try {
          const fieldId = lang.isObject(data) ? data.from : data
          const fieldIndex = fullData.fields.findIndex(
            (field) => field.id === fieldId
          )
          let field = {}
          if (lang.isObject(data)) {
            field = {
              ...fullData.fields[fieldIndex],
              ...data,
            }
          } else {
            field = fullData.fields[fieldIndex]
          }
          if (lang.isArray(parentData)) {
            parentData[parentDataProperty] = field
          } else {
            parentData[parentDataProperty] = [field]
          }
          return Promise.resolve(true)
        } catch (e) {
          return Promise.reject(e)
        }
      }
      const changeData = (
        data,
        dataPath,
        parentData,
        parentDataProperty,
        fullData
      ) => {
        try {
          const prepare = (field) => {
            if (object.has(field, "data-type")) {
              switch (field["data-type"]) {
                case "date":
                  field.value = moment(lang.clone(field.value)).format("L")
                  break
              }
            }
            return field
          }
          parentData = prepare(parentData)
          return Promise.resolve(true)
        } catch (e) {
          return Promise.reject(e)
        }
      }
      source = await dispatch(
        "utils/validate",
        {
          schema,
          schemas: [defs],
          source,
          keywords: {
            modifyValidation: {
              modifying: true,
              schema: false,
              errors: true,
              validate: modifyValidation,
            },
            isAllias: {
              async: true,
              modifying: true,
              schema: false,
              errors: true,
              validate: isAllias,
            },
            fieldFromAllias: {
              async: false,
              modifying: true,
              schema: false,
              errors: true,
              validate: fieldFromAllias,
            },
            changeData: {
              async: false,
              modifying: true,
              schema: false,
              errors: true,
              validate: changeData,
            },
          },
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
  async bindValidation({ state, dispatch, getters }, { id, $v }) {
    try {
      const index = getters.getFormIndexById(id)
      if (index === -1) {
        throw new Error(`Form: ${id} doesn\`t exist.`)
      }
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[index],
          path: "$v",
          value: lang.cloneDeep($v),
        },
        { root: true }
      )
      return Promise.resolve($v)
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
        throw new TypeError(`Form source is invalid ${source}`)
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
      const form = await dispatch("prepare", source)
      const index = getters.getFormIndexById(form.id)
      if (index !== -1) {
        throw new Error(`Form with id: ${form.id} already created.`)
      }
      await dispatch(
        "utils/pushToArray",
        {
          obj: state,
          path: "list",
          value: lang.cloneDeep(form),
        },
        {
          root: true,
        }
      )
      await dispatch(
        "utils/pushToArray",
        {
          obj: state,
          path: "configCopies",
          value: lang.cloneDeep(form),
        },
        {
          root: true,
        }
      )
      return Promise.resolve(form)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async remove({ getters, state, dispatch }, id) {
    try {
      const index = getters.getFormIndexById(id)
      if (index === -1) {
        throw new Error(`Remove: Can\`t find form: ${id}.`)
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
      await dispatch(
        "utils/removeFromArrayByIndex",
        {
          obj: state,
          path: "configCopies",
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
  async addField({ state, getters, dispatch }, { formID, field }) {
    try {
      const formIndex = getters.getFormIndexById(formID)
      if (formIndex === -1) {
        throw new Error(`Form: ${formID} doesn\`t exist.`)
      }

      const fieldPosition = getters.getSchemaFieldIndexById(formIndex, field.id)
      if (fieldPosition.step !== -1 && fieldPosition.index !== -1) {
        throw new Error(`Field: ${field.id} already exist.`)
      }

      await dispatch(
        "utils/pushToArray",
        {
          obj: state.list[formIndex],
          path: "schema",
          value: lang.cloneDeep(field),
        },
        {
          root: true,
        }
      )
      return Promise.resolve(true)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async updateField({ state, getters, dispatch }, { formID, fieldId, value }) {
    try {
      const formIndex = getters.getFormIndexById(formID)
      if (formIndex === -1) {
        throw new Error(`Form: ${formID} doesn\`t exist.`)
      }
      const fieldPosition = getters.getSchemaFieldIndexById(formIndex, fieldId)
      if (fieldPosition.step === -1 || fieldPosition.index === -1) {
        throw new Error(`Update field: ${fieldId} doesn\`t exist.`)
      }
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[formIndex].schema[fieldPosition.step][
            fieldPosition.index
          ],
          path: "value",
          value: lang.cloneDeep(value),
        },
        { root: true }
      )
      return Promise.resolve(true)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async deleteField({ state, getters, dispatch }, { formID, fieldId }) {
    try {
      const formIndex = getters.getFormIndexById(formID)
      if (formIndex === -1) {
        throw new Error(`Form: ${formID} doesn\`t exist.`)
      }
      const fieldIndex = getters.getSchemaFieldIndexById(formIndex, fieldId)
      if (fieldIndex === -1) {
        throw new Error(`Delete field: ${fieldId} doesn\`t exist.`)
      }
      await dispatch(
        "utils/removeFromArrayByIndex",
        {
          obj: state.list[formIndex],
          path: "schema",
          index: fieldIndex,
        },
        {
          root: true,
        }
      )
      return Promise.resolve(true)
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async setStep({ state, getters, dispatch }, { value, formID }) {
    try {
      const formIndex = getters.getFormIndexById(formID)
      if (formIndex === -1) {
        throw new Error(`Form: ${formID} doesn\`t exist.`)
      }
      if (lang.isUndefined(state.list[formIndex].schema[value])) {
        throw new TypeError(`Form: ${formID} incorrect step value.`)
      }
      await dispatch(
        "utils/setProperty",
        {
          obj: state.list[formIndex],
          path: "step",
          value,
        },
        { root: true }
      )
    } catch (e) {
      return Promise.reject(e)
    }
  },
  async updateDependency(
    { state, getters, dispatch },
    { oldValue, newValue, formID }
  ) {
    try {
      const formIndex = getters.getFormIndexById(formID)
      if (formIndex === -1) {
        throw new Error(`Form: ${formID} doesn\`t exist.`)
      }
      // ПРоходимсся по значениям полей
      const form = lang.cloneDeep(state.list[formIndex])
      for (const fieldId of Object.keys(newValue)) {
        if (!lang.isEqual(oldValue[fieldId], newValue[fieldId])) {
          const dependency = form.dependency.find((d) => d.fieldId === fieldId)
          if (dependency) {
            // Обрабатываем только изменившееся поле с зависимостью
            // Убираем из обработки шаги без полей
            form.schema = form.schema.filter((step) => step.length)
            form.schema = form.schema.map((step) => {
              const filter = step.filter((field) => field.parent !== fieldId)
              return filter
            })
            const keyValue = dependency.keys.find(
              (k) => k.key === newValue[fieldId]
            )
            if (keyValue) {
              for (const change of Object.keys(keyValue)) {
                if (change === "field" || change === "schema") {
                  const target = keyValue[change].target
                  let fieldIndex = -1
                  let stepIndex = -1
                  for (const [index, step] of form.schema.entries()) {
                    let i
                    if (target) {
                      i = step.findIndex((f) => f.id === target)
                    } else {
                      i = step.findIndex((f) => f.id === fieldId)
                    }
                    if (i !== -1) {
                      fieldIndex = i
                      stepIndex = index
                      break
                    }
                  }
                  if (stepIndex !== -1 && fieldIndex !== -1) {
                    if (change === "field") {
                      const field = {
                        ...form.schema[stepIndex][fieldIndex],
                        ...keyValue[change].value,
                      }
                      form.schema[stepIndex][fieldIndex] = field
                    } else if (change === "schema") {
                      for (const field of keyValue[change].value) {
                        form.schema[stepIndex].splice(++fieldIndex, 0, {
                          parent: fieldId,
                          ...field,
                        })
                      }
                    }
                  }
                }
              }
            }
            await dispatch(
              "utils/setProperty",
              {
                obj: state.list[formIndex],
                path: "schema",
                value: lang.cloneDeep(form.schema),
              },
              { root: true }
            )
          }
        }
      }
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  },
}

export const getters = {
  getFormIndexById: (state) => (id) =>
    state.list.findIndex((form) => form.id === id),
  getFormFieldIndexById: (state) => (formIndex, id) =>
    state.list[formIndex].fields.findIndex((field) => field.id === id),
  getSchemaFieldIndexById: (state) => (formIndex, fieldId) => {
    let fieldIndex = -1
    let stepIndex = -1
    for (const [i, v] of state.list[formIndex].schema.entries()) {
      fieldIndex = v.findIndex((field) => field.id === fieldId)
      if (fieldIndex !== -1) {
        stepIndex = i
        break
      }
    }
    return { step: stepIndex, index: fieldIndex }
  },
  findByID: (state) => (id) => state.list.find((form) => form.id === id),
  plain: (state) => (id) => {
    const index = state.list.findIndex((form) => form.id === id)
    const plain = {}
    if (index === -1) {
      return plain
    }
    for (const step of state.list[index].schema) {
      for (const field of step) {
        plain[field.id] = field.value
      }
    }
    return plain
  },
}
