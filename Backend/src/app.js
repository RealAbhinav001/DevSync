const express = require("express")
const cors = require("cors")
const cookie = require("cookie-parser")
const authRouter = require("./modules/Authentication/authRoutes.js")
const orgRouter = require("./modules/Organization/orgRoutes.js")
const teamRouter = require("./modules/Team/teamRoutes.js")
const projectRoter = require("./modules/Projects/projectRoutes.js")
const taskRouter = require("./modules/Tasks/taskRoutes.js")
const kanbanRoutes = require("./modules/Kanban Board/kanbanRoutes.js")
const activityRoutes = require("./modules/ActivityLog/activityLogRoutes.js")
const dashboardRoutes = require("./modules/Dashboard/dashboardRoutes.js")
const searchFilterRoutes = require("./modules/SearchAndFilter/searchFilterroutes.js")
const notificationRoutes = require("./modules/notification/notificationRoutes.js")
const chatRoutes = require("./modules/chats/teamChatRoutes.js")
const inviteRoutes = require("./modules/Invitation/invitationRoutes.js")
const config = require("./config/config.js")
const apiError = require("./utils/apiError.js")
const errorMiddleWare = require("./middleware/errorMiddleWare.js")
const morgan = require("morgan")
const helmet = require("helmet")

const app = express()

app.use(helmet())
app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true
    })
)
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "15kb" }))
app.use(cookie())
app.use(morgan("dev"))

app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
    res.send("DevSync Backend Making start")
})

app.use("/api/auth", authRouter)
app.use("/api/organization", orgRouter)
app.use("/api/team", teamRouter)
app.use("/api/project", projectRoter)
app.use("/api/task", taskRouter)
app.use("/api/kanban", kanbanRoutes)
app.use("/api/activity", activityRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/search", searchFilterRoutes)
app.use("/api/notify", notificationRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/invitation", inviteRoutes)
app.use((req, _res, _next) => {
    throw new apiError(404, `Route ${req.originalUrl} not found`)
})
app.use(errorMiddleWare)

module.exports = app
