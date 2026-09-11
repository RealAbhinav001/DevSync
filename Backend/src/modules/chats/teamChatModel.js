const mongoose = require("mongoose")

const teamChatModel = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            trim: true
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        attachments: {
            type: [
                {
                    originalName: String,
                    fileName: String,
                    filePath: String,
                    mimeType: String,
                    size: Number
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
)

const Chat = mongoose.model("Chat", teamChatModel)

module.exports = Chat
