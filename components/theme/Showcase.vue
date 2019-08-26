<template>
  <main class="spotlight-container">
    <article class="spotlight article-container">
      <section class="article-header">
        <div class="article-showcase">
          <figure
            v-for="image in item.images"
            :key="`image-${image.id}`"
            class="article-showcase-image"
          >
            <img
              :src="image.file.path"
              :alt="image.name"
            >
          </figure>
          <table class="article-table article-narrator">
            <tbody>
              <template v-for="statements in Object.keys(item.statements).map(key => (item.statements[key])).sort((a, b) => (a[0].property.i18n.filter(data => data.lang.code.indexOf(lang) > -1)[0].text.length - b[0].property.i18n.filter(data => data.lang.code.indexOf(lang) > -1)[0].text.length > 0 ? 1 : -1))">
                <tr
                  v-for="(statement, index) in statements"
                  :key="statement.id"
                  class="statement"
                >
                  <td
                    v-if="index === 0"
                    :rowspan="statements.length"
                    class="property"
                  >
                    <p>{{ statement.property.i18n.filter(data => data.lang.code.indexOf(lang) > -1)[0].text || statement.property.name }}</p>
                  </td>
                  <td class="value">
                    <p v-if="statement.property.meta && statement.property.meta.type === 'Date'">{{ dateFormat(statement.entity.value) }}</p>
                    <p v-else-if="statement.property.meta && statement.property.meta.type === 'Link'">
                      <a :href="statement.entity.value" target="_blank" rel="noopener noreferrer">點此開啟</a>
                    </p>
                    <p v-else>{{ statement.entity.value }} {{ statement.property.meta ? statement.property.meta.unit : '' }}</p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>
      <section
        class="article-content font-serif"
      >
        <Paragraph
          v-for="paragraph in item.introduction"
          :key="paragraph.id"
          :paragraph="paragraph"
        />
      </section>
    </article>
    <footer class="article-footer">
      <div class="tag-container tag-container-belong-article">
        <nuxt-link
          v-for="tag in item.tags"
          :key="tag.name"
          :to="`/tag/${tag.name}`"
          class="tag tag--article"
        >
          <span>{{ tag.name }}</span>
        </nuxt-link>
      </div>
      <div class="button-social-container row">
        <div
          :class="{ 'liked': liked }"
          class="button-social button-social-likes"
          @click="liked = !liked"
        >
          <div class="icon">
            <font-awesome-icon class="like" :icon="['far', 'heart']" />
            <font-awesome-icon class="liked" :icon="['fas', 'heart']" />
          </div>
          <span class="bubble-count">{{ likeCount }} likes</span>
        </div>
        <div class="button-social-placeholder" />
        <div class="button-social">
          <div class="icon">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </div>
          <div class="icon">
            <font-awesome-icon :icon="['fab', 'facebook']" />
          </div>
        </div>
        <div
          :class="{ 'bookmarked': bookmarked }"
          class="button-social button-social-bookmark"
          @click="bookmarked = !bookmarked"
        >
          <div class="icon">
            <font-awesome-icon class="bookmark" :icon="['far', 'bookmark']" />
            <font-awesome-icon class="bookmarked" :icon="['fas', 'bookmark']" />
          </div>
        </div>
      </div>
    </footer>
  </main>
</template>

<script>
import * as _ from 'lodash'
import { mapGetters } from 'vuex'
import Paragraph from '~/components/element/Paragraph.vue'

export default {
  name: 'Showcase',

  head () {
    return {
      title: `${this.item.name} - ${this.$route.meta.head ? this.$route.meta.head.title : ''}`,
      meta: this.$route.meta.head ? this.$route.meta.head.meta : ''
    }
  },

  components: {
    Paragraph
  },

  data () {
    return {
      bookmarked: false,
      liked: false,
      likeCount: 1023
    }
  },

  computed: {
    ...mapGetters({ lang: 'app/language' })
  },

  watch: {
    liked: {
      immediate: true,
      handler (newValue, oldValue) {
        this.likeCount += isNaN(+newValue - +oldValue) ? 0 : +newValue - +oldValue
      }
    }
  },

  async asyncData ({ params, store }) {
    const item = await store.dispatch('item/getById', params.id)
    const _result = await Promise.all(item.introduction.map(async (context) => {
      const _result = await store.dispatch('paragraph/parseMarkup', context)
      return _result
    }))
    item.introduction = item.introduction.map((context, index) => ({ ...context, nested: _result[index] }))

    if (Array.isArray(item.statements)) {
      item.statements = item.statements.filter(ele => (ele.property.meta ? (!ele.property.meta.hidden) : true))
      item.statements = _.groupBy(item.statements, 'property.name')
    }

    return {
      item
    }
  },

  methods: {
    highlightHandler (selected) {
      // eslint-disable-next-line no-console
      console.log({ selected })
    },

    dateFormat (date) {
      const _date = new Date(date).toDateString().split(' ').slice(1)
      return `${_date[0]} ${_date[1]}, ${_date[2]}`
    }
  }
}
</script>
