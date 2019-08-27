<template>
  <main class="spotlight-container">
    <div class="spotlight">
      <no-ssr>
        <SearchBar />
      </no-ssr>
      <div
        :style="{ '--number-of-col': numberOfCol, '--number-of-row': Math.floor(itemPrePage / numberOfCol) }"
        class="case-container"
      >
        <figure
          v-for="(item, index) in items"
          v-show="Math.floor(index / itemPrePage) + 1 === nowPage"
          :key="item.id"
          class="case"
        >
          <img
            v-lazy="item.images[0].file.path"
            :style="{ 'background-image': `url(${item.images[0].file.meta.min})` }"
            :data-loading="item.images[0].file.meta.min"
            :title="item.name"
            :alt="item.name"
          >
          <figcaption class="content">
            <nuxt-link :to="`${$route.path}/${item.itemId}`">{{ item.name }}</nuxt-link>
          </figcaption>
        </figure>
      </div>
      <no-ssr>
        <ul class="case-page-nav">
          <div
            :class="{ 'unavailable': nowPage === 1 }"
            class="page-number-pre page-number-box"
            @click="setNowPage(nowPage - 1)"
          >
            <font-awesome-icon :icon="['fas', 'angle-left']" />
          </div>
          <li
            v-for="index in Math.ceil(items.length / itemPrePage)"
            :key="`page-${index}`"
            :class="{ 'active': index === nowPage }"
            class="page-number-box"
            @click="setNowPage(index)"
          >
            <span class="font-slab">{{ index }}</span>
          </li>
          <div
            :class="{ 'unavailable': nowPage === Math.ceil(items.length / itemPrePage) }"
            class="page-number-next page-number-box"
            @click="setNowPage(nowPage + 1)"
          >
            <font-awesome-icon :icon="['fas', 'angle-right']" />
          </div>
        </ul>
      </no-ssr>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchBar from './element/SearchBar'

export default {
  name: 'Exhibition',

  head () {
    return {
      title: this.$route.meta.head ? this.$route.meta.head.title : '',
      meta: this.$route.meta.head ? this.$route.meta.head.meta : ''
    }
  },

  components: {
    SearchBar
  },

  data () {
    return {
      numberOfCol: 4,
      itemPrePage: 20
    }
  },

  computed: {
    ...mapGetters({
      lang: 'app/language',
      items: 'item/items',
      nowPage: 'item/nowPage'
    })
  },

  watch: {
    nowPage () {
      window.scrollTo(0, 0)
    }
  },

  methods: {
    ...mapActions({
      setNowPage: 'item/setNowPage'
    })
  }
}
</script>
