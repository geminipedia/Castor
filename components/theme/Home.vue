<template>
  <section>
    <div />
  </section>
</template>

<script>
export default {
  name: 'Home',
  head () {
    return {
      title: this.$route.meta.head ? this.$route.meta.head.title : '',
      meta: this.$route.meta.head ? this.$route.meta.head.meta : ''
    }
  }
}
</script>

<style lang="scss">
@import "~/components/theme/assets/scss/main.scss";
</style>
