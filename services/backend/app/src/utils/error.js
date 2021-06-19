const createError = require('http-errors')

module.exports.NotFound = (req, res, next) => {
    return next(createError.NotFound('This route does not exist.'))
}

module.exports.InternalServerError = (req, res, next) => {
    return next(createError.InternalServerError('InternalServerError.'))
}