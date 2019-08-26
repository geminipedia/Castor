import gql from 'graphql-tag'
import * as types from './mutation-types'

export const state = () => ({
  properties: []
})

export const getters = {
  properties: state => state.properties
}

export const actions = {
  async getAll ({ commit }) {
    try {
      const apollo = this.app.apolloProvider.defaultClient
      const res = await apollo.query({
        query: gql`
          query {
            properties {
              propertyId
              i18n {
                lang {
                  code
                }
                text
              }
            }
          }
        `
      })

      commit(types.PROPERTIES, res.data.properties)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export const mutations = {
  [types.PROPERTIES] (state, data) {
    state.properties = data
  }
}
