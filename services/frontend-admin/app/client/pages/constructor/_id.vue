<script>
import { mapState, mapActions } from "vuex"
import BaseButton from "@/components/controls/BaseButton"
import BaseForm from "@/components/BaseForm"
// const lang = require("lodash/lang")
export default {
  fetch({ store }) {
    if (process.browser) return
    try {
      // Binds it on server side then unbind again to avoid memory leaks on the server.
      // await store.dispatch("bindNotes")
      // store.dispatch("unbindNotes")
    } catch (e) {
      return false
    }
  },
  data: () => ({
    show: false,
  }),
  components: {
    BaseButton,
    BaseForm,
  },
  computed: {
    ...mapState({
      form: (state) => state.form,
    }),
  },
  async mounted() {
    try {
      await this.$store.dispatch("bindForm", this.$route.params.id)
    } catch (e) {
      console.log("ERROR", e)
    }
  },
  methods: {
    ...mapActions({
      addForm: "addForm",
    }),
  },
  beforeDestroy() {
    if (this.form.id) {
      this.remove(this.form.id)
    }
  },
  watch: {
    form: {
      deep: true,
      async handler(value) {
        const form = this.$refs.form
        this.id = (await form.create(value)).id
        this.show = true
      },
    },
  },
}
</script>
<template>
  <main class="index-page__wrapper">
    <BaseButton @change="addForm" label="Add input field" />
    <BaseForm v-if="show" ref="form" />
  </main>
</template>
