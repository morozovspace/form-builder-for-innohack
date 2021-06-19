<template>
  <el-tooltip
    v-model="showTooltip"
    :disabled="disableTooltip"
    placement="top"
    :enterable="false"
    :tabindex="0"
  >
    <div slot="content"><span v-text="cTooltip"></span></div>
    <el-button
      ref="control"
      :class="['transparent-bg-on-progress']"
      :type="type"
      :size="size"
      :icon="cIcon"
      :disabled="cDisabled"
      :circle="circle"
      @click="click"
    >
      <span v-if="cLabel">{{ cLabel }} </span>
      <el-progress
        v-if="timer"
        type="circle"
        :width="12"
        :stroke-width="2"
        color="#FFFFFF"
        :show-text="false"
        :percentage="percentage"
      ></el-progress>
    </el-button>
  </el-tooltip>
</template>
<script>
import base from "./_mixins/base"
import button from "./_mixins/button"
export default {
  mixins: [base, button],
}
</script>
