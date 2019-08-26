import gql from 'graphql-tag'
import * as types from './mutation-types'

export const state = () => ({
  items: [],
  nowPage: 1,
  search: {
    orderBy: 'itemId_ASC',
    rawText: '',
    resultMode: false,
    mode: 'NORMAL', // NORMAL | ADVANCED | QUERY
    result: []
  }
})

export const getters = {
  items: state => state.search.resultMode ? state.search.result : state.items,
  nowPage: state => state.nowPage,
  searchOrderBy: state => state.search.orderBy,
  searchRawText: state => state.search.rawText,
  searchResultMode: state => state.search.resultMode,
  advanceSearch: state => state.search.mode === 'ADVANCE',
  querySearch: state => state.search.mode === 'QUERY'
}

export const actions = {
  async getAll ({ commit }) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query {
            items (orderBy: itemId_ASC) {
              id
              itemId
              name
              images {
                file {
                  path
                }
              }
              meta
            }
          }
        `
      })

      commit(types.ITEMS, res.data.items)

      return res.data.items
    } catch (error) {
      throw new Error(error)
    }
  },

  async getPart ({ commit }, first = 20) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query($first: Int!) {
            items(
              first: $first
              orderBy: itemId_ASC
            ) {
              id
              itemId
              name
              images {
                file {
                  path
                }
              }
              meta
            }
          }
        `,
        variables: {
          first
        }
      })

      commit(types.ITEMS_APPEND, res.data.items)

      return res.data.items
    } catch (error) {
      throw new Error(error)
    }
  },

  async getPartAfter ({ commit }, first, after) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query($first: Int!, $after: String!) {
            items(
              first: $first
              after: $after
              orderBy: itemId_ASC
            ) {
              id
              itemId
              name
              images {
                file {
                  path
                }
              }
              meta
            }
          }
        `,
        variables: {
          first,
          after
        }
      })

      commit(types.ITEMS_APPEND, res.data.items)

      return res.data.items
    } catch (error) {
      throw new Error(error)
    }
  },

  async getById ({ commit }, id) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query($itemId: String!) {
            item(where: {
              itemId: $itemId
            }) {
              id
              itemId
              name
              statements {
                index
                property {
                  name
                  meta
                  i18n {
                    lang {
                      code
                    }
                    text
                  }
                }
                entity {
                  value
                  reference {
                    itemId
                  }
                  meta
                }
              }
              introduction {
                id
                index
                markup {
                  type
                  start
                  end
                  href
                  rel
                  src
                  title
                }
                text
                type
                meta
              }
              images {
                id
                name
                file {
                  path
                }
              }
              meta
            }
          }
        `,
        variables: {
          itemId: id
        }
      })

      return res.data.item
    } catch (error) {
      throw new Error(error)
    }
  },

  async search ({ commit }, { where, orderBy }) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query($itemWhereInput: ItemWhereInput, $itemOrderBy: ItemOrderByInput) {
            items(where: $itemWhereInput, orderBy: $itemOrderBy) {
              id
              itemId
              name
              statements {
                index
                property {
                  name
                  meta
                  i18n {
                    lang {
                      code
                    }
                    text
                  }
                }
                entity {
                  value
                  reference {
                    itemId
                  }
                  meta
                }
              }
              introduction {
                id
                index
                markup {
                  type
                  start
                  end
                  href
                  rel
                  src
                  title
                }
                text
                type
                meta
              }
              images {
                id
                name
                file {
                  path
                }
              }
              meta
            }
          }
        `,
        variables: {
          itemWhereInput: where,
          itemOrderBy: orderBy
        }
      })

      commit(types.ITEM_SEARCH_RESULTS, res.data.items)
    } catch (error) {
      throw new Error(error)
    }
  },

  setNowPage ({ commit }, data) {
    commit(types.ITEM_NOWPAGE, data)
  },

  setSearchMode ({ commit }, data) {
    commit(types.ITEM_SEARCH_MODE, data)
  },

  setSearchRawText ({ commit }, data) {
    commit(types.ITEM_SEARCH_RAW_TEXT, data)
  },

  setSearchOrderBy ({ commit }, data) {
    commit(types.ITEM_SEARCH_ORDERBY, data)
  },

  setSearchResultMode ({ commit }, data) {
    commit(types.ITEM_SEARCH_RESULT_MODE, data)
  }
}

export const mutations = {
  [types.ITEMS] (state, data) {
    state.items = data
  },

  [types.ITEMS_APPEND] (state, data) {
    state.items.push(...data)
  },

  [types.ITEM_NOWPAGE] (state, data) {
    state.nowPage = data
  },

  [types.ITEM_SEARCH_MODE] (state, data) {
    state.search.mode === data
      ? state.search.mode = 'NORMAL'
      : state.search.mode = data
  },

  [types.ITEM_SEARCH_RESULTS] (state, data) {
    state.search.result = data
  },

  [types.ITEM_SEARCH_RAW_TEXT] (state, data) {
    state.search.rawText = data
  },

  [types.ITEM_SEARCH_ORDERBY] (state, data) {
    state.search.orderBy = data
  },

  [types.ITEM_SEARCH_RESULT_MODE] (state, data) {
    state.search.resultMode = data
  }
}
