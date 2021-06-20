<script>
import { mapState, mapActions } from "vuex"
import BaseButton from "@/components/controls/BaseButton"
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
    currentForm: {},
  }),
  components: {
    BaseButton,
  },
  computed: {
    ...mapState({
      forms: (state) => state.forms,
    }),
  },
  async mounted() {
    try {
      await this.$store.dispatch("bindForms")
    } catch (e) {
      console.log("ERROR", e)
    }
  },
  methods: {
    ...mapActions({
      addForm: "addForm",
    }),
    select(f) {
      this.show = true
      this.currentForm = {
        id: f.id,
        label: f.label,
        description: f.description,
      }
    },
    editForm() {
      this.$router.push(`/constructor/${this.currentForm.id}`)
    },
  },
}
</script>
<template>
  <main class="index-page__wrapper">
    <BaseButton @change="addForm" label="Add form to list" />
    <ul class="forms__wrapper">
      <li v-for="(form, i) of forms" :key="i" class="forms__form-wrapper">
        <div @click="select(form)">
          {{ form.label }}
        </div>
      </li>
    </ul>
    <div v-if="show">
      {{ currentForm.label }}
      <br />
      {{ currentForm.description }}
      <br />
      {{ currentForm.stat || "Stat" }}
      <br />
      <BaseButton @change="editForm" label="Edit form" />
    </div>
  </main>
</template>
