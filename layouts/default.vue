<template>
  <div id="app">
    <Navbar />
    <nuxt class="spotlight-container" />
    <no-ssr>
      <Login v-if="isToggleLogin" />
    </no-ssr>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Login from '~/components/element/Login'
import Navbar from '~/components/element/Navbar'

export default {
  name: 'Default',

  components: {
    Login,
    Navbar
  },

  computed: {
    ...mapGetters({
      isToggleLogin: 'app/isToggleLogin',
      isToggleSignUp: 'app/isToggleSignUp'
    })
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
