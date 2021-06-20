<script>
import BaseForm from "@/components/BaseForm"
import { mapActions } from "vuex"
const lang = require("lodash/lang")
const object = require("lodash/object")
export default {
  components: {
    BaseForm,
  },
  data() {
    return {
      auth: "",
      signin: true,
    }
  },
  beforeDestroy() {
    if (this.auth) {
      this.remove(this.auth)
    }
  },
  async mounted() {
    try {
      const vm = this
      const form = vm.$refs.config
      await getForm()
      form.$on("update", async (value, oldValue) => {
        try {
          if (!lang.isEqual(value, oldValue)) {
            console.log("FORM UPDATED")
          }
        } catch (e) {
          vm.showError(e)
        }
      })
    } catch (e) {
      this.showError(e)
    }
  },
  methods: {
    ...mapActions({
      remove: "form/remove",
    }),
    async getForm() {
      if (this.signin) {
        this.auth = (
        await form.create(
            "/public/signin-form"
        )
        ).id
      } else {
        this.auth = (
        await form.create(
            "/public/signup-form"
        )
        ).id
      }
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
    <BaseForm ref="auth" />
    <span @click="signin = !signin">{{ signin ? "Already registered? Sign in" : "Don`t have account ? Sign up" }}</span>
  </div>
</template>
