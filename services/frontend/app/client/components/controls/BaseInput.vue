<script>
import base from "./_mixins/base"
import input from "./_mixins/input"
export default {
  mixins: [base, input],
}
</script>
<template>
  <el-autocomplete
    v-if="showSuggestion"
    ref="control"
    v-model="value"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    @select="select"
    :autofocus="autofocus"
    :type="type"
    :inputmode="inputmode"
    :disabled="cDisabled"
    :placeholder="$t(placeholder)"
    clearable
  >
    <template slot="prepend" v-if="prepend">
      {{ prepend }} {{ showSuggestion }}
      <i v-if="prependIcon" :class="prependIcon"></i>
    </template>
  </el-autocomplete>
  <el-input
    v-else
    ref="control"
    v-model="value"
    :value="value"
    :autofocus="autofocus"
    :type="type"
    :inputmode="inputmode"
    :disabled="cDisabled"
    :placeholder="$t(placeholder)"
    :step="step"
    :min="min"
    :max="max"
    clearable
  >
    <template slot="prepend" v-if="prepend">
      {{ prepend }} {{ showSuggestion }}
      <i v-if="prependIcon" :class="prependIcon"></i>
    </template>
  </el-input>
</template>
