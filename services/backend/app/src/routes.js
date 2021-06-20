const express = require('express')
const router = express.Router()

const Public = require('./controllers/Public')

router.use('/public', Public)

module.exports = router