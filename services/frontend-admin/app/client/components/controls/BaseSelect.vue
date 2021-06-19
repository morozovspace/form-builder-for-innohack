<template>
  <el-select
    ref="control"
    v-model="value"
    :size="size"
    :placeholder="$t(placeholder)"
    :disabled="cDisabled"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="$t(item.label)"
      :value="item.value"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>
<script>
import Base from "./_mixins/base"
import Select from "./_mixins/select"
export default {
  mixins: [Base, Select],
  props: {
    options: {
      type: [Array],
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "controls.select.placeholder",
    },
  },
}
</script>
