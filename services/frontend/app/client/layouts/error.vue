<template>
  <div>
    <h1>An error occurred</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  layout: "error", // you can set a custom layout for the error page
}
</script>
