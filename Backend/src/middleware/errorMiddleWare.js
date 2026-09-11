const logger = require("../utils/logger.js")

const errorMiddleWare = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500

    logger.error(err.message, { statusCode, path: req.originalUrl, stack: err.stack })

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    })
}

module.exports = errorMiddleWare
