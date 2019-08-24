const path = require('path')
const dotenv = require('dotenv')

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
  loading: { color: '#fff' },
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
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/pwa',
    '@nuxtjs/router',
    'nuxt-ssr-cache',
    '@nuxtjs/google-gtag',
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
