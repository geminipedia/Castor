<template>
  <div id="home">
    <section />
  </div>
</template>

<script>
export default {
  name: 'Home',
  head () {
    return {
      title: this.$route.meta.head.title,
      meta: this.$route.meta.head.meta
    }
  }
}
</script>

<style scoped>

</style>
