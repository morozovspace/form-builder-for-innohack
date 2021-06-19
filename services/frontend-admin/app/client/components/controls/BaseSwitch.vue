<template>
  <el-switch
    v-model="value"
    :active-text="activeText"
    :inactive-text="inactiveText"
  >
  </el-switch>
</template>
<script>
import Base from "./_mixins/base"
import Switch from "./_mixins/switch"
export default {
  mixins: [Base, Switch],
}
</script>
