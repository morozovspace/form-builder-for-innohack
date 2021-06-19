const express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , http = require('http')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '30mb'}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors(
  {
    credentials: true,
      origin: function (origin, callback) {
        callback(null, true)
      }   
  }
))

module.exports= {
  initServer: function () {
    try {
      return http.Server(app)
    } catch (e) {
      throw new Error('Init server error')
    }
  },
  getAppInstance: function () {
    return app
  }
} 
