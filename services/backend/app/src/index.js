const admin = require('firebase-admin')
const { initServer } = require('./server')
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../swagger_output.json")
const app = require('./server').getAppInstance()
const credentionals = require("../credentionals.json")
async function init () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentionals),
      databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
    })
    const server = await initServer()
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    app.use(require('./middlewares/auth'))
    // app.use(require('./routes'))
    app.use(require('./utils/error').NotFound)
    app.use(require('./middlewares/error').ErrorHandler)
    server.listen(3010)
  } catch (e) {
    console.log('SERVER ERROR:')
    console.log(`*** ${e} ***`)
    app.use(require('./utils/error').InternalServerError)
    app.use(require('./middlewares/error').ErrorHandler) 
  }
}
init()