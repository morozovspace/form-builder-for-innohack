var _ = require('lodash')
const createError = require('http-errors')
const router = require('express').Router()
const admin = require('firebase-admin')
const notSecureRoutes = [
    {
        methods: ["POST","GET"],
        url: /^\/public\/*/i,
    },
]
function checkRoute (method, url) {
    try {
        for(let route of notSecureRoutes) {
            if(route.methods.includes(method) && route.url.test(url)) {
                return Promise.resolve(true)
            }
        }

        return Promise.resolve(false)
    } catch (e) {
        return Promise.reject(e)
    }
}

module.exports = async function (req, res, next ) {
    try {
        const isPublic = await checkRoute(req.method, req.url)
        console.log("SECURE?", isPublic)
        if (isPublic) {
            return next()
        }
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