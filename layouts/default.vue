<template>
  <div id="app">
    <Navbar />
    <nuxt />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Navbar from '~/components/element/Navbar'

export default {
  name: 'Default',

  components: {
    Navbar
  },

  async mounted () {
    // Don't poke API when development at localhost
    if (!window.location.host.includes('localhost')) {
      await this.verifyUser()
    }
  },

  methods: {
    ...mapActions({ verifyUser: 'user/verify' })
  }
}
</script>

<style lang="scss">
@import '~assets/scss/main.scss';
</style>
