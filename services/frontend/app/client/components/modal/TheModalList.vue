<script>
import { mapGetters } from "vuex"
import BaseModal from "./BaseModal"
export default {
  components: {
    BaseModal,
  },
  computed: {
    ...mapGetters({
      openedModals: "modal/opened",
    }),
  },
}
</script>
<template>
  <div class="modals__wrapper">
    <BaseModal
      v-for="(modal, i) of openedModals"
      :id="modal.id"
      :key="modal.id"
      :label="modal.label"
      :current="i === openedModals.length - 1"
      :description="modal.description"
      :open="modal.open"
      :disabled="modal.disabled"
      :form="modal.form"
      :controls="modal.controls"
      :promises="modal.promises"
    />
  </div>
</template>
<style lang="scss">
@import "@/assets/scss/components/layout/Modal.scss";
</style>
