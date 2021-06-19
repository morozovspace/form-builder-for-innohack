/*
 * Run the project and access the documentation at: http://localhost:3000/doc
 *
 * Use the command below to generate the documentation without starting the project:
 * $ npm start
 *
 * Use the command below to generate the documentation at project startup:
 * $ npm run start-gendoc
 */
const { initServer } = require('./server')
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("../swagger_output.json")
const app = require('./server').getAppInstance()
async function init () {
  try {
    const server = await initServer()
    app.use(require('./middlewares/firebase'))
    app.use(require('./middlewares/auth'))
    // app.use(require('./routes'))
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    app.use(require('./utils/error').NotFound)
    app.use(require('./middlewares/error').ErrorHandler)
    server.listen(3000)
  } catch (e) {
    console.log('SERVER ERROR:')
    console.log(`*** ${e} ***`)
    app.use(require('./utils/error').InternalServerError)
    app.use(require('./middlewares/error').ErrorHandler) 
  }
}
init()