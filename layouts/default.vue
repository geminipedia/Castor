<template>
  <div id="app">
    <Navbar />
    <nuxt />
  </div>
</template>

<script>
import Navbar from '~/components/element/Navbar'
export default {
  name: 'Default',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import '~assets/scss/main.scss';
</style>
