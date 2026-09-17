const teamModel = require("../Team/teamModel.js")
const chatModel = require("../chats/teamChatModel.js")

const setupChatSocket = (io, socket) => {
    socket.on("join-team-chat", async (teamId) => {
        try {
            if (!teamId) {
                return socket.emit("socket-error", {
                    message: "Team Id not found"
                })
            }

            const team = await teamModel.findById(teamId)
            if (!team) {
                return socket.emit("socket-error", {
                    message: "Team not found"
                })
            }

            const isMember = team.members.some(
                (member) => member.user.toString() === socket.user.id.toString()
            )

            if (!isMember) {
                return socket.emit("socket-error", {
                    message: "User is not a member of this team"
                })
            }

            const room = `team:${teamId}`
            socket.join(room)

            const message = "Joined Team Successfully"
            const eventName = "joined-team-chat"
            const data = { teamId, room, message }

            socket.emit(eventName, data)
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })

    socket.on("send-team-message", async (teamId, content) => {
        try {
            if (!teamId) {
                return socket.emit("socket-error", {
                    message: "Team Id is not found"
                })
            }

            const team = await teamModel.findById(teamId)
            if (!team) {
                return socket.emit("socket-error", {
                    message: "Team not found"
                })
            }

            const isMember = team.members.some(
                (member) => member.user.toString() === socket.user.id.toString()
            )
            if (!isMember) {
                return socket.emit("socket-error", {
                    message: "You are not the member of team"
                })
            }

            if (!content || content.trim() === "") {
                return socket.emit("socket-error", {
                    message: "Content is not found"
                })
            }
            const chat = await chatModel.create({
                organization: team.organization,
                team: teamId,
                sender: socket.user.id,
                content: content.trim()
            })

            await chat.populate("sender", "name email")
            const room = `team:${teamId}`
            io.to(room).emit("receive-team-message", chat)
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })

    socket.on("edit-team-message", async (messageId, content) => {
        try {
            if (!messageId) {
                return socket.emit("socket-error", {
                    message: "Message Id not found"
                })
            }

            const message = await chatModel.findById(messageId)
            if (!message) {
                return socket.emit("socket-error", {
                    message: "Message not found"
                })
            }

            if (message.sender.toString() !== socket.user.id.toString()) {
                return socket.emit("socket-error", {
                    message: "You are not the sender"
                })
            }

            if (message.deletedAt !== null) {
                return socket.emit("socket-error", {
                    message: "This message is already deleted"
                })
            }

            if (!content || content.trim() === "") {
                return socket.emit("socket-error", {
                    message: "Content not found"
                })
            }

            message.content = content.trim()
            message.isEdited = true
            await message.save()
            message.populate("sender","name email")
            const room = `team:${message.team}`
            io.to(room).emit("message-edited", message)
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })

    socket.on("delete-team-message", async (messageId) => {
        try {
            if (!messageId) {
                return socket.emit("socket-error", {
                    message: "Message Id not found"
                })
            }

            const message = await chatModel.findById(messageId)
            if (!message) {
                return socket.emit("socket-error", {
                    message: "Message Not Found"
                })
            }

            if (message.sender.toString() !== socket.user.id.toString()) {
                return socket.emit("socket-error", {
                    message: "You are not a sender of this message"
                })
            }

            if (message.deletedAt !== null) {
                return socket.emit("socket-error", {
                    message: "This message already Deleted"
                })
            }

            message.deletedAt = new Date()
            await message.save()

            const room = `team:${message.team}`
            io.to(room).emit("message-deleted", message)
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })

    socket.on("typing-team-message", async (teamId) => {
        try {
            if (!teamId) {
                return socket.emit("socket-error", {
                    message: "Team Id not found"
                })
            }

            const team = await teamModel.findById(teamId)
            if (!team) {
                return socket.emit("socket-error", {
                    message: "Team not found"
                })
            }

            const isMember = team.members.some(
                (member) => member.user.toString() === socket.user.id.toString()
            )

            if (!isMember) {
                return socket.emit("socket-error", {
                    message: "You are not the member of team"
                })
            }

            const room = `team:${teamId}`

            socket.to(room).emit("user-typing-team-message", {
                teamId: teamId,
                userId: socket.user.id,
                name: socket.user.name,
                message: `${socket.user.name} is typing...`
            })
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })
    socket.on("stop-typing-team-message", async (teamId) => {
        try {
            if (!teamId) {
                return socket.emit("socket-error", {
                    message: "Team Id not found"
                })
            }

            const team = await teamModel.findById(teamId)
            if (!team) {
                return socket.emit("socket-error", {
                    message: "Team not found"
                })
            }

            const isMember = team.members.some(
                (member) => member.user.toString() === socket.user.id.toString()
            )

            if (!isMember) {
                return socket.emit("socket-error", {
                    message: "You are not the member of team"
                })
            }

            const room = `team:${teamId}`

            socket.to(room).emit("user-stop-typing-team-message", {
                teamId: teamId,
                userId: socket.user.id,
                name: socket.user.name,
                message: `${socket.user.name} stopped typing`
            })
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })
}

module.exports = setupChatSocket
