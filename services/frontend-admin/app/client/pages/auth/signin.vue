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
      signIn: true,
      config: null,
    }
  },
  beforeDestroy() {
    if (this.id) {
      this.remove(this.id)
    }
  },
  async mounted() {
    try {
      console.log(process.browser, this.$refs)
      const vm = this
      const form = vm.$refs.auth
      await this.getConfig()
      this.id = (await form.create(this.config)).id
      /*
      form.$on("update", (value, oldValue) => {
        try {
          if (!lang.isEqual(value, oldValue)) {
            console.log("FORM UPDATED")
          }
        } catch (e) {
          vm.showError(e)
        }
      })
      */
    } catch (e) {
      console.log(e)
      this.showError(e)
    }
  },
  methods: {
    ...mapActions({
      remove: "form/remove",
    }),
    async getConfig() {
      const url = !this.signIn ? "/public/signup-form" : "/public/signin-form"
      if (this.id) {
        console.log(this.id)
        await this.remove(this.id)
      }
      this.config = await this.$axios.$get(url)
    },
    action() {
      console.log("AUTH")
    },
    switchConfigs() {
      this.$router.push("/auth/signup")
    },
    showError(e) {
      this.$notify({
        title: this.$t("error"),
        message: this.$t(e.message),
        type: "error",
      })
    },
  },
  computed: {
    label() {
      return this.signIn
        ? "Don`t have  account? Sign up"
        : "Already have account? Sign in"
    },
    actionLabel() {
      return this.signIn ? "Sign in" : "Sign up"
    },
  },
}
</script>
<template>
  <div>
    <BaseForm ref="auth" />
    <div>
      <BaseButton :label="actionLabel" @change="action" />
      <BaseButton :label="label" @change="switchConfigs" />
    </div>
  </div>
</template>
