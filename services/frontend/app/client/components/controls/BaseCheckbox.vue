<template>
  <el-checkbox-group
    v-if="show"
    ref="control"
    :min="cMin"
    :max="cMax"
    v-model="value"
    :disabled="cDisabled"
  >
    <el-checkbox
      v-for="item of options"
      :label="item.value"
      :key="item.value"
      :disabled="isDisabled(item)"
    >
      {{ $t(item.label) }}
    </el-checkbox>
  </el-checkbox-group>
</template>
<script>
import Base from "./_mixins/base"
import Checkbox from "./_mixins/checkbox"
export default {
  mixins: [Base, Checkbox],
}
</script>
