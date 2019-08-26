<template>
  <div id="search" class="search-container">
    <div class="search-box-container">
      <div class="search-box">
        <input
          v-model="searchText"
          type="search"
          class="search-input"
          placeholder="Type something here to search..."
          @keyup.enter="searchItem()"
        >
        <div
          class="search-box-clear"
          @click="clearSearch()"
        >
          <span>×</span>
        </div>
      </div>
      <div
        class="search-box-submit"
        @click="searchItem()"
      >
        <span class="font-slab">Search</span>
        <font-awesome-icon :icon="['fas', 'arrow-right']" />
      </div>
    </div>
    <div class="search-option-box-container">
      <div id="advance-search" class="search-option-box">
        <input
          type="checkbox"
          class="search-checkbox"
          name="advance-search"
          @click="setSearchMode('ADVANCE')"
        >
        <div
          v-show="advanceSearch"
          class="checked-mark"
        >
          <font-awesome-icon :icon="['fas', 'check']" />
        </div>
        <label for="advance-search">
          <span class="font-slab">Advance Search</span>
        </label>
      </div>
      <div id="query-search" class="search-option-box">
        <input
          type="checkbox"
          class="search-checkbox"
          name="query-search"
          @click="setSearchMode('QUERY')"
        >
        <div
          v-show="querySearch"
          class="checked-mark"
        >
          <font-awesome-icon :icon="['fas', 'check']" />
        </div>
        <label for="query-search">
          <span class="font-slab">GraphQL Search</span>
        </label>
      </div>
    </div>
    <div
      v-if="searchResultMode"
      class="search-result-number-container"
    >
      <span class="font-slab">{{ items.length }} results.</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SearchBar',

  data () {
    return {
      searchText: ''
    }
  },

  computed: {
    ...mapGetters({
      lang: 'app/language',
      items: 'item/items',
      searchRawText: 'item/searchRawText',
      searchOrderBy: 'item/searchOrderBy',
      searchResultMode: 'item/searchResultMode',
      advanceSearch: 'item/advanceSearch',
      querySearch: 'item/querySearch'
    })
  },

  mounted () {
    this.searchText = this.searchRawText
  },

  methods: {
    ...mapActions({
      search: 'item/search',
      setSearchMode: 'item/setSearchMode',
      setSearchRawText: 'item/setSearchRawText',
      setSearchOrderBy: 'item/setSearchOrderBy',
      setSearchResultMode: 'item/setSearchResultMode'
    }),

    async searchItem () {
      let query = ''

      if (this.querySearch) {
        query = JSON.parse(this.searchText)
      } else if (this.advanceSearch) {
        // Advance search placeholder...
      } else {
        query = { name_contains: this.searchText }
      }

      this.setSearchRawText(this.searchText)
      this.setSearchOrderBy(this.searchOrderBy)

      await this.search({ where: query, orderBy: this.searchOrderBy })
      this.setSearchResultMode(true)
    },

    clearSearch () {
      this.setSearchRawText('')
      this.searchText = ''

      if (this.searchResultMode) {
        this.setSearchMode('NORMAL')
        this.setSearchResultMode(false)
      }
    }
  }
}
</script>
