const projectModel = require("../Projects/projectModel.js")

const kanbanBoard = (io, socket) => {
    socket.on("join-project-kanban", async (projectId) => {
        try {
            if (!projectId) {
                return socket.emit("socket-error", {
                    message: "Project Id not found"
                })
            }

            const project = await projectModel.findById(projectId).populate("team")
            if (!project) {
                return socket.emit("socket-error", {
                    message: "Project not found"
                })
            }

            const isAllowed = project.team.members.some(
                (member) => member.user.toString() === socket.user.id.toString()
            )

            if (!isAllowed) {
                return socket.emit("socket-error", {
                    message: "You are not allowed"
                })
            }

            const room = `project:${projectId}`

            socket.join(room)

            socket.emit("joined-project-kanban", {
                projectId: projectId,
                room: room,
                message: "You joined Kanban Board"
            })
        } catch (error) {
            socket.emit("socket-error", {
                message: error.message
            })
        }
    })
}

module.exports = kanbanBoard
