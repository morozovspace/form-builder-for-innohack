<script>
import { mapState } from "vuex"
export default {
  data() {
    return {
      darkMode: false,
    }
  },
  computed: {
    ...mapState({
      theme: (state) => state.theme,
    }),
  },
}
</script>
<template>
  <div :class="[`theme-${theme}`]">
    <div :class="['page__wrapper']">
      <div :class="['header-and-page__wrapper']">
        <Header />
        <Nuxt />
      </div>
      <Footer />
    </div>
  </div>
</template>
<!--
<style lang="scss">
@import "@/assets/styles/layouts/default.scss";
</style>
-->
