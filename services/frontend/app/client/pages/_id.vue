<script>
import BaseForm from "@/components/BaseForm"
import { mapActions } from "vuex"
import BaseButton from "@/components/controls/BaseButton"
// const lang = require("lodash/lang")
export default {
  components: {
    BaseForm,
    BaseButton,
  },
  data() {
    return {
      id: null,
    }
  },
  beforeDestroy() {
    if (this.id) {
      this.remove(this.id)
    }
  },
  async mounted() {
    try {
      const vm = this
      const form = vm.$refs.form
      if (this.id) {
        await this.remove(this.id)
      }
      const config = await this.$axios.$get(
        `/public/form/${this.$route.params.id}`
      )
      this.id = (await form.create(config)).id
      form.$on("update", (value, oldValue) => {
        try {
          if (form.$v.formValues.$invalid) {
            this.$refs.control.disable()
          } else {
            this.$refs.control.enable()
          }
        } catch (e) {
          vm.showError(e)
        }
      })
    } catch (e) {
      console.log(e)
      this.showError(e)
    }
  },
  methods: {
    ...mapActions({
      remove: "form/remove",
    }),
    action() {
      console.log("AUTH")
    },
    showError(e) {
      this.$notify({
        title: this.$t("error"),
        message: this.$t(e.message),
        type: "error",
      })
    },
  },
}
</script>
<template>
  <div>
    <BaseForm ref="form" />
    <div>
      <BaseButton ref="control" label="form.send-button" @change="action" />
    </div>
  </div>
</template>
