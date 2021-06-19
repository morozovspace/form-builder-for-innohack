var _ = require('lodash')
const router = require('express').Router()

module.exports = async function (req, res, next ) {
    try {
        if (
          _.isFunction(req.isAuthenticated) &&
          req.isAuthenticated()
        ) {
            return next()
        }
        return next()

    } catch(e) {
        return next(e)
    }
}