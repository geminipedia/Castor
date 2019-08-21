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
          :class="{ 'active' : $route.name.includes(item.name) }"
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
    </nav>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',

  computed: {
    ...mapGetters({
      lang: 'app/language',
      menuItem: 'menu/item',
      site: 'app/site'
    })
  }
}
</script>
