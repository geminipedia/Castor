<template>
  <div id="search" class="search-container">
    <div class="search-box-container">
      <div class="search-box">
        <input
          v-show="!advanceSearch"
          v-model="searchText"
          type="search"
          class="search-input"
          placeholder="Type something here to search..."
          @keyup.enter="searchItem()"
        >
        <div
          v-show="advanceSearch"
          class="search-input search-input-advance"
          placeholder="Pick up filters here to search..."
        >
          <div
            v-for="(filter, index) in advanceSearchBlock"
            :key="filter.name"
            class="search-advance-filter using"
          >
            <div
              class="remove"
              @click="removeFilter(index)"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </div>
            <span>{{ filter.name }}</span>
            <input
              v-model="advanceSearchBlock[index].value"
              type="text"
              :style="{ 'width': `${(filter.value.length <= 3 ? 3 : filter.value.length) * 13}pt` }"
            >
          </div>
        </div>
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
      v-if="advanceSearch"
      class="search-advance-filter-container"
    >
      <label class="font-slab">Filters</label>
      <div
        v-for="filter in filters"
        :key="filter.propertyId"
        class="search-advance-filter"
        @click="pickUpFilter(filter)"
      >
        <span>{{ filter.name }}</span>
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
      searchText: '',
      advanceSearchBlock: [],
      filters: []
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
      querySearch: 'item/querySearch',
      properties: 'property/properties'
    })
  },

  watch: {
    advanceSearch (newValue, oldValue) {
      this.setSearchRawText('')
      this.searchText = ''
      this.advanceSearchBlock = []
    },

    querySearch () {
      this.setSearchRawText('')
      this.searchText = ''
    }
  },

  async mounted () {
    this.searchText = JSON.parse(JSON.stringify(this.searchRawText)) // Fix js shadow copy
    this.advanceSearchBlock = JSON.parse(JSON.stringify(this.searchRawText)) // Fix js shadow copy
    await this.getAllProperties()
    this.generateFilterFromProperties()
  },

  methods: {
    ...mapActions({
      search: 'item/search',
      setNowPage: 'item/setNowPage',
      setSearchMode: 'item/setSearchMode',
      setSearchRawText: 'item/setSearchRawText',
      setSearchOrderBy: 'item/setSearchOrderBy',
      setSearchResultMode: 'item/setSearchResultMode',
      getAllProperties: 'property/getAll'
    }),

    async searchItem () {
      let query = ''

      if (this.querySearch) {
        query = JSON.parse(this.searchText)
      } else if (this.advanceSearch) {
        query = {
          AND: this.advanceSearchBlock.map(filter => ({
            statements_some: {
              property: {
                propertyId: filter.propertyId
              },
              entity: {
                value_contains: filter.value
              }
            }
          }))
        }

        this.searchText = JSON.parse(JSON.stringify(this.advanceSearchBlock)) // Fix js shadow copy
      } else {
        query = { name_contains: this.searchText }
      }

      this.setSearchRawText(this.searchText)
      this.setSearchOrderBy(this.searchOrderBy)

      await this.search({ where: query, orderBy: this.searchOrderBy })
      this.setNowPage(1)
      this.setSearchResultMode(true)
    },

    clearSearch () {
      this.setSearchRawText('')
      this.searchText = ''
      this.setSearchMode('NORMAL')

      if (this.searchResultMode) {
        this.setSearchResultMode(false)
        this.setNowPage(1)
      }
    },

    generateFilterFromProperties () {
      const properties = this.properties
      this.filters = properties
        .map(property => property.i18n.filter(value => value.lang.code === this.lang)[0].text)
        .map((ele, index) => ({
          name: ele,
          propertyId: properties[index].propertyId
        }))
        .sort((a, b) => (a.name.length > b.name.length))
    },

    pickUpFilter (filter) {
      this.advanceSearchBlock.push({ ...filter, value: '' })
    },

    removeFilter (index) {
      this.advanceSearchBlock.splice(index, 1)
    }
  }
}
</script>
