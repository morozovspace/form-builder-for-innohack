const admin = require('firebase-admin')
    , functions = require('firebase-functions')

const db = admin.initializeApp().firestore()

exports.api = functions.https.onRequest(() => {
  console.log('ssrapp')
  return true
})
// Recalculates the total cost of a cart; triggered when there's a change
// to any items in a cart.
/*

const app = require('express')()
const { loadNuxt, build } = require('nuxt')

const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  console.log('Nuxt JS started')
}

start()

module.exports = app

*/