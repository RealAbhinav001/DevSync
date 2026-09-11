require("dotenv").config()
const app = require("./app")
const config = require("./config/config.js")
const connectDB = require("./config/db.js")
const http = require("http")
const server = http.createServer(app)
const { setIo } = require("./modules/realTime/socketManager.js")
const { Server } = require("socket.io")
const logger = require("./utils/logger.js")
const io = new Server(server, {
    cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST"]
    }
})

setIo(io)
const setUpSocket = require("./modules/realTime/socket.js")

const startServer = async () => {
    try {
        await connectDB()

        setUpSocket(io)

        server.listen(config.PORT || 5000, () => {
            logger.info(`Backend running on port ${config.PORT || 5000}`)
        })
    } catch (error) {
        logger.error(error.message, { stack: error.stack })
        process.exit(1)
    }
}

startServer()
