var _ = require('lodash')
const createError = require('http-errors')
const router = require('express').Router()
const admin = require('firebase-admin')

module.exports = async function (req, res, next ) {
    try {
        const { uid = null } = admin
          .auth()
          .verifyIdToken(idToken)
        if (!_.isNull(uid)) {
            return next()
        }
        return next(createError.Unauthorized('Unauthorized'))
    } catch(e) {
        return next(e)
    }
}