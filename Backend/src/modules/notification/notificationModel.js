const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
    {
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        action: {
            type: String,
            enum: [
                "TASK_ASSIGN",
                "TEAM_ADD",
                "TEAM_MEMBER_ADD",
                "TEAM_MEMBER_REMOVE",
                "ROLE_UPDATE",
                "PROJECT_ADD",
                "INVITE_RECEIVED",
                "INVITE_ACCEPTED",
                "INVITE_REJECTED",
                "INVITE_CANCELLED"
            ]
        },
        message: {
            type: String
        },
        entityType: {
            type: String,
            enum: ["Task", "Project", "Team"]
        },
        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "entityType"
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },
        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
