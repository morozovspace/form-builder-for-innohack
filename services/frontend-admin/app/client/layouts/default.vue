<script>
import { mapState } from "vuex"
import Header from "@/components/layout/Header"
import Navigation from "@/components/layout/Navigation"
import TheModalList from "@/components/modal/TheModalList"
const moment = require("moment")
export default {
  name: "App",
  components: {
    Header,
    Navigation,
    TheModalList,
  },
  created() {
    moment.locale(this.$i18n.locale)
  },
  computed: {
    ...mapState({
      theme: (state) => state.theme,
    }),
  },
}
</script>
<template>
  <div :class="['layout__wrapper', `theme-${theme}`]">
    <Header class="layout__header" />
    <Navigation class="layout__sidebar" />
    <section class="layout__content">
      <Nuxt class="layout__page" />
      <TheModalList />
    </section>
  </div>
</template>
<style lang="scss">
@import "@/assets/styles/layouts/default.scss";
</style>
