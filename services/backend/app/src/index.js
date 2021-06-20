const admin = require('firebase-admin')
const { initServer } = require('./server')
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../swagger_output.json")
const app = require('./server').getAppInstance()
const credentionals = require("../credentionals.json")
const router = require('./routes')
async function init () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(credentionals),
      projectId: "fb-form-builder"
    })
    const db = admin.firestore()
    app.use((req, res, next) => {
      req.db = db
      return next()
    })
    const server = await initServer()
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    app.use(require('./middlewares/auth'))
    app.use(router)
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