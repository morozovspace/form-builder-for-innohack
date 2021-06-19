<template>
  <el-radio-group ref="control" v-model="value" :disabled="cDisabled">
    <el-radio
      v-for="item of options"
      :key="item.value"
      :label="item.value"
      :disabled="isDisabled(item)"
    >
      {{ $t(item.label) }}
    </el-radio>
  </el-radio-group>
</template>
<script>
import Base from "./_mixins/base"
import Checkbox from "./_mixins/checkbox"
export default {
  mixins: [Base, Checkbox],
}
</script>
