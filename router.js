import Vue from 'vue'
import Router from 'vue-router'
import dynamicRoutes from './static/routeList.json'

import * as theme from '~/components/theme'

Vue.use(Router)

export const fetchRouteDataFromSite = (data) => {
  try {
    const menu = data.site.menu

    if (!menu) {
      throw new Error('Site menu empty! Create router failed!')
    }

    return menu.map(page => ({
      path: page.path,
      name: page.name,
      component: theme[page.layout.component],
      meta: {
        index: page.index,
        label: {
          ...page.label.reduce((obj, item) => Object.assign(obj, { [item.lang.code]: item.text }), {})
        },
        head: page.head,
        type: page.type
      }
    }))
  } catch (error) {
    throw new Error(error)
  }
}

export const createRouter = () => {
  return new Router({
    mode: 'history',
    routes: fetchRouteDataFromSite(dynamicRoutes),
    scrollBehavior: (to, from, savedPosition) => {
      return { x: 0, y: 0 }
    }
  })
}
