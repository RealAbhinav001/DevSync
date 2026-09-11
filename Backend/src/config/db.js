const moongoose = require("mongoose")
const config = require("./config.js")
const logger = require("../utils/logger.js")

const connectDB = async () => {
    try {
        await moongoose.connect(config.MONGO_URI)
        logger.info("MongoDB connected successfully")
    } catch (error) {
        logger.error(error.message, { stack: error.stack })
        process.exit(1)
    }
}

module.exports = connectDB
