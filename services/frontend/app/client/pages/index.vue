<script>
import { mapState, mapActions } from "vuex"
export default {
  async fetch({ store }) {
    if (process.browser) return
    try {
      // Binds it on server side then unbind again to avoid memory leaks on the server.
      // await store.dispatch("bindNotes")
      // store.dispatch("unbindNotes")
    } catch (e) {
      return false
    }
  },
  data: () => ({}),
  computed: {
    ...mapState({
      notes: (state) => state.notes,
    }),
  },
  async mounted() {
    try {
      await this.$store.dispatch("bindNotes")
    } catch (e) {
      console.log("ERROR", e)
    }
  },
  methods: {
    ...mapActions({
      addNote: "addNote",
    }),
  },
}
</script>
<template>
  <main class="index-page__wrapper">
    <h1 @click="addNote">Hellssso from s</h1>
    {{ notes }}
  </main>
</template>
