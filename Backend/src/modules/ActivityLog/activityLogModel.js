const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },
        entityType: {
            type: String,
            enum: ["Task", "Project", "Team", "Invitation"]
        },
        entity: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "entityType"
        },
        action: {
            type: String,
            enum: [
                "CREATE_TASK",
                "UPDATE_TASK",
                "DELETE_TASK",
                "STATUS_CHANGE",
                "CREATE_TEAM",
                "ADD_MEMBER",
                "REMOVE_MEMBER",
                "UPDATE_ROLE",
                "CREATE_PROJECT",
                "UPDATE_PROJECT",
                "DELETE_PROJECT",
                "INVITE_SENT",
                "INVITE_ACCEPTED",
                "INVITE_REJECTED",
                "INVITE_CANCELLED"
            ]
        },
        message: {
            type: String
        },
        oldValue: {
            type: Object,
            default: null
        },
        newValue: {
            type: Object,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Activity = mongoose.model("Activity", activitySchema)

module.exports = Activity
