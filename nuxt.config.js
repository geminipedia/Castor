const path = require('path')
const dotenv = require('dotenv')
const axios = require('axios')
const gql = require('graphql-tag')

dotenv.config({ path: path.join(__dirname, '.env') })

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.SITE_NAME || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#282828' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~/plugins/font-awesome'
    },
    {
      src: '~/plugins/lazyload'
    }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/router',
    '@nuxtjs/sitemap',
    '@nuxtjs/google-gtag',
    'nuxt-ssr-cache',
    'nuxt-webfontloader',
    ['@nuxtjs/component-cache', { maxAge: 1000 * 60 * 60 }]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Apollo module configuration
  ** See https://github.com/nuxt-community/apollo-module
  */
  apollo: {
    includeNodeModules: true,
    clientConfigs: {
      default: {
        httpEndpoint: process.env.GRAPHQL_API_URI,
        httpLinkOptions: {
          credentials: 'same-origin'
        }
      },
      auth: {
        httpEndpoint: process.env.GRAPHQL_API_URI,
        httpLinkOptions: {
          credentials: 'include'
        }
      }
    }
  },
  /*
   ** Webfont
   */
  webfontloader: {
    google: {
      families: [
        'Noto+Sans+TC:100,300,400,500,700,900',
        'Noto+Serif+TC:100,300,400,500,700',
        'Roboto+Slab:100,300,400,500,700&subset=chinese-traditional,japanese'
      ]
    }
  },
  /*
  ** Optimizations
  */
  cache: {
    store: {
      type: 'memory',
      stores: [
        {
          type: 'memory',
          max: 4096,
          ttl: 60
        }
      ]
    },
    pages: [ '/' ]
  },
  parallel: true,
  /*
   ** GTM configuration
   */
  'google-gtag': {
    id: process.env.GOOGLE_GTM_ID,
    config: {
      // this are the config options for `gtag
      // check out official docs: https://developers.google.com/analytics/devguides/collection/gtagjs/
      anonymize_ip: false, // anonymize IP
      send_page_view: true, // might be necessary to avoid duplicated page track on page reload
      linker: {
        domains: [ process.env.SITE_DOMAIN ]
      }
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: false // disable if you don't want to track each page route with router.afterEach(...)
  },
  /*
  ** Sitemap module configurence
  */
  sitemap: {
    path: '/sitemap.xml',
    hostname: `https://${process.env.SITE_DOMAIN}`,
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false,
    routes (callback) {
      axios.all([
        // Persist route
        axios.post(process.env.GRAPHQL_API_URI, {
          query: gql`
            query($siteName: String!) {
              site (
                where: {
                  name: $siteName
                }
              ) {
                menu {
                  path
                  type
                }
              }
            }
          `,
          variables: {
            siteName: process.env.SITE_NAME
          }
        }),

        // Posts
        axios.post(process.env.GRAPHQL_API_URI, {
          query: gql`
            query {
              posts (
                where: {
                  published: true
                }
              ) {
                id
              }
            }
          `,
          variables: {
            siteName: process.env.SITE_NAME
          }
        }),

        // News
        axios.post(process.env.GRAPHQL_API_URI, {
          query: gql`
            query {
              newses (
                where: {
                  published: true
                }
              ) {
                id
              }
            }
          `,
          variables: {
            siteName: process.env.SITE_NAME
          }
        }),

        // Items
        axios.post(process.env.GRAPHQL_API_URI, {
          query: gql`
            query {
              items {
                itemId
              }
            }
          `,
          variables: {
            siteName: process.env.SITE_NAME
          }
        })
      ])
        .then(axios.spread((base, posts, newses, items) => {
          const baseRoutes = base.data.data.site.menu
            .filter(ele => (ele.type === 'HOME' || ele.type === 'MAIN'))
            .map(ele => ({
              url: ele.path,
              changefreq: 'daily',
              priority: 1
            }))

          const postRoutes = posts.data.data.posts
            .map(ele => ({
              url: `${process.env.POST_ROOT_PATH_ALIAS}/${ele.id}`,
              changefreq: 'daily',
              priority: 0.8
            }))

          const newsRoutes = newses.data.data.newses
            .map(ele => ({
              url: `${process.env.NEWS_ROOT_PATH_ALIAS}/${ele.id}`,
              changefreq: 'daily',
              priority: 0.8
            }))

          const itemRoutes = items.data.data.items
            .map(ele => ({
              url: `${process.env.ITEM_ROOT_PATH_ALIAS}/${ele.itemId}`,
              changefreq: 'daily',
              priority: 0.8
            }))

          callback(null, [
            ...baseRoutes,
            ...postRoutes,
            ...newsRoutes,
            ...itemRoutes
          ])
        }))
        .catch(callback)
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
