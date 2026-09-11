const setupChatSocket = require("./chatSocket.js")
const setupNotificationSocket = require("./notification.js")
const kanbanBoardSocket = require("./kanbanBoard.js")
const authSocket = require("./authSocket.js")

const setUpSocket = (io) => {
    io.use(authSocket)
    io.on("connection", (socket) => {
        console.log(`A user connected ${socket.id}`)

        setupNotificationSocket(io, socket)
        setupChatSocket(io, socket)
        kanbanBoardSocket(io, socket)

        socket.on("disconnect", () => {
            console.log(`Same User Disconnect ${socket.id}`)
        })
    })
}

module.exports = setUpSocket
