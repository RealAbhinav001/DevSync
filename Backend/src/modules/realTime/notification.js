const setupNotificationSocket = (io, socket) => {
    try {
        const userRoom = `user:${socket.user.id}`

        socket.join(userRoom)
    } catch (error) {
        socket.emit("socket-error", {
            message: error.message
        })
    }
}

module.exports = setupNotificationSocket
