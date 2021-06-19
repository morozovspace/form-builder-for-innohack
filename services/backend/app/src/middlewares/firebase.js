var _ = require('lodash')
const createError = require('http-errors')
const router = require('express').Router()
module.exports = function (req, res, next ) {
  console.log("FIREBASE")
  return next(createError.Unauthorized('Unauthorized'))
}