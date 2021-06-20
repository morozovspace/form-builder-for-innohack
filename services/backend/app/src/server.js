const express = require('express')
    , app = express()
    , cors = require('cors')
    , http = require('http')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
