module.exports.ErrorHandler = (err, req, res, next) => {
    console.log("ERROR HANDLER", err)
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    })
}
