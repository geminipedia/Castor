import * as types from './mutation-types'
import routeList from '~/static/routeList.json'

export const state = () => ({
  site: {
    name: '',
    domain: ''
  },
  device: 'desktop',
  toggle: {
    navbar: false,
    login: false,
    signUp: false,
    scrollDirect: ''
  },
  language: 'zh_TW',
  availLang: ['zh_TW', 'en_US']
})

export const mutations = {
  [types.TOGGLE_LOGIN] (state, status) {
    state.toggle.login = status
  },

  [types.TOGGLE_SIGNUP] (state, status) {
    state.toggle.signUp = status
  },

  [types.TOGGLE_NAVBAR] (state, status) {
    state.toggle.navbar = status
  },

  [types.TOGGLE_SCROLL_DIRECT] (state, status) {
    state.toggle.scrollDirect = status
  },

  [types.TOGGLE_DEVICE] (state, status) {
    state.device = status === 'mobile' ? 'mobile' : 'desktop'
  },

  [types.LANGUAGE] (state, lang) {
    state.language = state.availLang.includes(lang) ? lang : 'zh_TW'
  },

  [types.SITE_NAME] (state, data) {
    state.site.name = data
  },

  [types.SITE_DOMAIN] (state, data) {
    state.site.domain = data
  }
}

export const getters = {
  isMobile: state => state.device === 'mobile',
  isToggleLogin: state => state.toggle.login,
  isToggleSignUp: state => state.toggle.signUp,
  isToggleNavbar: state => state.toggle.navbar,
  scrollDirect: state => state.toggle.scrollDirect,
  language: state => state.language,
  site: state => state.site,
  siteName: state => state.site.name,
  siteDomain: state => state.site.domain
}

export const actions = {
  toggleLogin ({ commit }, status) {
    commit(types.TOGGLE_LOGIN, status)
  },

  toggleSignUp ({ commit }, status) {
    commit(types.TOGGLE_SIGNUP, status)
  },

  toggleNavbar ({ commit }, status) {
    commit(types.TOGGLE_NAVBAR, status)
  },

  toggleDevice ({ commit }, status) {
    commit(types.TOGGLE_DEVICE, status)
  },

  toggleScrollDirect ({ commit }, status) {
    commit(types.TOGGLE_SCROLL_DIRECT, status)
  },

  toggleLanguage ({ commit }, lang) {
    commit(types.LANGUAGE, lang)
  },

  getSite ({ commit }) {
    commit(types.SITE_NAME, routeList.site.name)
    commit(types.SITE_DOMAIN, routeList.site.domain)
  }
}
