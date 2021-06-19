import express from "express"
const app = express()
const PORT = 3001
app.get('/', (request, response) => {
  response.send('Hello world!');
})
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

const http = require('http')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

http.createServer(app).listen(3000)
console.log("Listening at:// port:%s (HTTP)", 3000)

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

require('./endpoints')(app)