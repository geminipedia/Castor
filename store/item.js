import gql from 'graphql-tag'
import * as types from './mutation-types'

export const state = () => ({
  items: [],
  nowPage: 1
})

export const getters = {
  items: state => state.items,
  nowPage: state => state.nowPage
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

  setNowPage ({ commit }, data) {
    commit(types.ITEM_NOWPAGE, data)
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
  }
}
