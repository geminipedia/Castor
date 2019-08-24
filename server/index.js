const fs = require('fs')
const path = require('path')
const axios = require('axios')
const consola = require('consola')
const gql = require('graphql-tag')
const md5 = require('js-md5')
const Koa = require('koa')
const dotenv = require('dotenv')
const { Nuxt, Builder } = require('nuxt')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

const getDynamicRoutes = async () => {
  const res = await axios.post(process.env.GRAPHQL_API_URI, {
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

  return res.data.data
}

const saveFile = (filePath, fileData) => new Promise((resolve, reject) => {
  const writeStream = fs.createWriteStream(filePath)
  writeStream.write(fileData, 'UTF8')
  writeStream.end()

  writeStream.on('finish', () => {
    resolve()
  })

  writeStream.on('error', (err) => {
    reject(err)
  })
})

async function start () {
  // Get dynamic routes and write to file before init Nuxt worker
  const dynamicRoutes = await getDynamicRoutes()
  const generatedTarget = path.resolve(__dirname, '../static/routeList.json')
  const isExisted = await fs.existsSync(generatedTarget)

  if (!isExisted) {
    consola.info({
      message: `Generating dynamic router file: static/routeList.json \n\nhash ${md5(JSON.stringify(dynamicRoutes))}`,
      badge: true
    })
    await saveFile(generatedTarget, JSON.stringify(dynamicRoutes))
  } else {
    // Compare if file existed
    const oldFile = require('../static/routeList.json')
    const oldHash = md5(JSON.stringify(oldFile))
    const newHash = md5(JSON.stringify(dynamicRoutes))

    if (oldHash !== newHash) {
      consola.info({
        message: `Updating dynamic router file: static/routeList.json \n\nhash ${md5(JSON.stringify(dynamicRoutes))}`,
        badge: true
      })
      await saveFile(generatedTarget, JSON.stringify(dynamicRoutes))
    } else {
      consola.info({
        message: `Dynamic router file is up-to-date, skip generating...`,
        badge: true
      })
    }
  }

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
