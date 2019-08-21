<template>
  <div class="navbar">
    <div class="navbar-top">
      <div
        class="navbar-logo-box"
        @click="$router.go({ path: '/' })"
      >
        <img src="~/static/logo/MSLibLogo.svg" :alt="`${site.name}'s Logo'`">
        <div class="text-block font-slab font-thin">
          MS Library
        </div>
      </div>
      <div
        v-for="item in menuItem"
        :key="item.name"
        class="navbar-pagename-box"
      >
        <div
          v-if="$route.name.includes(item.name) && item.name !== 'Home'"
          class="text-block"
          @click="$router.push({ name: item.name })"
        >
          <span
            v-if="lang !== 'en_US'"
            class="font-serif"
          >
            {{ item.meta.label[lang] }}
          </span>
          <span>．</span>
          <span class="font-slab">{{ item.meta.label['en_US'] }}</span>
        </div>
      </div>
    </div>
    <nav class="navbar-menu">
      <ul>
        <li
          v-for="item in menuItem"
          :key="item.name"
          :class="{ 'active': $route.name.includes(item.name) }"
        >
          <nuxt-link :to="item.path">
            <span class="label font-serif">{{ item.meta.label[lang] }}</span>
            <span
              v-if="lang !== 'en_US'"
              class="uppercase"
            >
              {{ item.meta.label['en_US'] }}
            </span>
          </nuxt-link>
        </li>
      </ul>
      <div class="toolbar">
        <div
          :class="{ 'active': activeSearchBar }"
          class="search-bar"
        >
          <input type="search" name="" placeholder="Search" maxlength="13">
          <div
            class="button"
            @click="activeSearchBar = !activeSearchBar"
          >
            <font-awesome-icon icon="search" />
          </div>
        </div>
        <no-ssr>
          <div
            v-if="user && user.userName"
            class="user-menu"
          >
            <img
              v-if="user.avatar"
              :src="user.avatar.file.path"
            >
            <font-awesome-icon v-else :icon="['fas', 'user']" />
          </div>
          <div
            v-else
            class="user-menu no-signin"
            @click="toggleLogin(true)"
          >
            <span class="font-thin uppercase">Sign In</span>
          </div>
        </no-ssr>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Navbar',

  data () {
    return {
      activeSearchBar: false,
      oldScrollPosition: 0
    }
  },

  computed: {
    ...mapGetters({
      lang: 'app/language',
      menuItem: 'menu/item',
      isMobile: 'app/isMobile',
      isToggleNavbar: 'app/isToggleNavbar',
      scrollDirect: 'app/scrollDirect',
      site: 'app/site',
      user: 'user/info'
    })
  },

  watch: {
    $route () {
      this.addScrollHandler()
    }
  },

  mounted () {
    this.addScrollHandler()
  },

  destroyed () {
    this.removeScrollHandler()
  },

  methods: {
    ...mapActions({
      toggleLogin: 'app/toggleLogin',
      toggleNavbar: 'app/toggleNavbar',
      toggleScrollDirect: 'app/toggleScrollDirect'
    }),

    toggleNavbarHandler () {
      const scrollPosition = document.querySelector('#__nuxt').getBoundingClientRect().y * -1

      if (scrollPosition >= document.querySelector('.navbar-top').clientHeight * 0.5) {
        if (!this.isToggleNavbar) {
          this.toggleNavbar(true)
        }
      } else if (this.isToggleNavbar) {
        this.toggleNavbar(false)
      }
    },

    navbarEffectHandler () {
      const scrollPosition = document.querySelector('#__nuxt').getBoundingClientRect().y * -1

      if (scrollPosition - this.oldScrollPosition > 0 && scrollPosition > 0) {
        this.toggleScrollDirect('down')
      } else {
        this.toggleScrollDirect('up')
      }

      if (scrollPosition === 0) {
        this.toggleScrollDirect('')
      }

      this.oldScrollPosition = scrollPosition
    },

    addScrollHandler () {
      if (this.$route.name !== 'Home') {
        this.addNavbarEffectHandler()
      } else {
        this.removeNavbarEffectHandler()
      }

      if (this.$route.name === 'Home') {
        this.addToggleNavbarHandler()
        this.toggleNavbar(false)
      } else {
        this.removeToggleNavbarHandler()
        this.toggleNavbar(true)
      }
    },

    removeScrollHandler () {
      this.removeToggleNavbarHandler()
      this.removeNavbarEffectHandler()
    },

    addToggleNavbarHandler () {
      document.addEventListener('scroll', this.toggleNavbarHandler)
    },

    addNavbarEffectHandler () {
      document.addEventListener('scroll', this.navbarEffectHandler)
    },

    removeToggleNavbarHandler () {
      document.removeEventListener('scroll', this.toggleNavbarHandler)
    },

    removeNavbarEffectHandler () {
      document.removeEventListener('scroll', this.navbarEffectHandler)
    }
  }
}
</script>
