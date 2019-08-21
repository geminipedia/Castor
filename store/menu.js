import { fetchRouteDataFromSite } from '../router'
import * as types from './mutation-types'
import routeList from '~/static/routeList.json'

export const state = () => ({
  item: []
})

export const getters = {
  item: state => state.item
}

export const actions = {
  getItem ({ commit }) {
    const result = fetchRouteDataFromSite(routeList)
      .map((item) => {
        delete item.component

        return item
      })
      .filter(item => (item.meta.type === 'MAIN' || item.meta.type === 'HOME'))
    commit(types.MENU_ITEM, result)
  }
}

export const mutations = {
  [types.MENU_ITEM] (state, data) {
    state.item = data
  }
}
