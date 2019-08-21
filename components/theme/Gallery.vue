<template>
  <main class="spotlight-container">
    <div class="spotlight">
      <div
        :class="scrollDirect"
        :style="`--number-of-col: ${numberOfCol}`"
        class="card-container card-container--cols"
      >
        <div
          v-for="col in numberOfCol"
          :key="`col-${col}`"
          class="card-col"
        >
          <figure
            v-for="item in items.filter((_, index) => (index % numberOfCol === (col - 1)))"
            :key="item.id"
            class="card"
          >
            <img :src="item.images[0].file.path" alt="">
            <figcaption class="content">
              <a :href="`/relics/${item.itemId}`">{{ item.name }}</a>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Gallery',
  head () {
    return {
      title: this.$route.meta.head ? this.$route.meta.head.title : '',
      meta: this.$route.meta.head ? this.$route.meta.head.meta : ''
    }
  },
  data () {
    return {
      numberOfCol: 4
    }
  },
  computed: {
    ...mapGetters({
      lang: 'app/language',
      scrollDirect: 'app/scrollDirect',
      title: 'head/title',
      items: 'item/items'
    })
  }
}
</script>
