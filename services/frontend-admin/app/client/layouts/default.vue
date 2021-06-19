<script>
import { mapState } from "vuex"
import TheModalList from "@/components/modal/TheModalList"
const moment = require("moment")
export default {
  name: "App",
  components: {
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
    <section class="layout__content">
      <Nuxt class="layout__page" />
      <TheModalList />
    </section>
  </div>
</template>
<style lang="scss">
@import "@/assets/styles/layouts/default.scss";
</style>
