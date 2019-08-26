import gql from 'graphql-tag'
import * as types from './mutation-types'

export const state = () => ({
  info: {}
})

export const getters = {
  info: state => state.info
}

export const actions = {
  async verify ({ commit }) {
    try {
      const apollo = this.app.apolloProvider.clients.auth
      const res = await apollo.mutate({
        mutation: gql`
          mutation {
            verifyUser {
              userName
              firstName
              lastName
              email
              group {
                name
                meta
              }
              avatar {
                file {
                  path
                }
              }
              meta
            }
          }
        `
      })

      commit(types.USER_INFO, res.data.verifyUser)
    } catch (error) {
      throw new Error(error)
    }
  },

  logout ({ commit }) {
    commit(types.USER_LOGOUT)
  }
}

export const mutations = {
  [types.USER_INFO] (state, data) {
    state.info = data
  },

  [types.USER_LOGOUT] (state) {
    state.info = null
  }
}
