const express = require('express')

const router = express.Router()

const apiV1 = require('./controllers/ApiRoute1')

router.use(apiV1)

module.exports = router