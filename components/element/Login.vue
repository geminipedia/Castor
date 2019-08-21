<template>
  <div id="login" class="popup-container">
    <div
      class="popup-close"
      @click="toggleLogin(false)"
    >
      <font-awesome-icon :icon="['fas', 'times']" />
    </div>
    <div class="popup-content-box">
      <div class="content">
        <h1 class="font-bold font-serif">
          Welcome
        </h1>
        <p>登入後使用文章發佈、訂閱內容、資料螢光筆等酷炫功能。</p>
      </div>
      <div class="action-block">
        <button
          class="button-large"
          @click="redirectToOAuth()"
        >
          <font-awesome-icon class="icon" :icon="['fab', 'google']" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Login',

  computed: {
    ...mapGetters({
      site: 'app/site'
    })
  },

  methods: {
    ...mapActions({
      toggleLogin: 'app/toggleLogin'
    }),

    redirectToOAuth () {
      window.location.href = `https://api.${this.site.domain}/googleOAuth`
    }
  }
}
</script>
