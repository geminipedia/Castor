import Vue from 'vue'
import Router from 'vue-router'
import gql from 'graphql-tag'

import apolloClient from './util/apolloClient'
import * as theme from '~/components/theme'

Vue.use(Router)

const fetchRouteDataFromSite = (data) => {
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
        label: {
          ...page.label.map(label => ({
            [label.lang.code]: label.text
          }))
        },
        head: page.head
      }
    }))
  } catch (error) {
    throw new Error(error)
  }
}

export const createRouter = async () => {
  try {
    const apollo = apolloClient
    const res = await apollo.query({
      query: gql`
        query($siteName: String!) {
          site(
            where: {
              name: $siteName
            }
          ) {
            name
            domain
            menu {
              path
              name
              type
              index
              label {
                lang { code }
                text
              }
              head {
                title
                meta {
                  charset
                  name
                  property
                  content
                }
              }
              layout {
                name
                component
              }
            }
          }
        }
      `,
      variables: {
        siteName: process.env.SITE_NAME
      }
    })

    return new Router({
      mode: 'history',
      routes: [ ...fetchRouteDataFromSite(res.data) ],
      scrollBehavior: (to, from, savedPosition) => {
        return { x: 0, y: 0 }
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}
