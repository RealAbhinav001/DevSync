const mongoose = require("mongoose")

const invitationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },
        receiver: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected", "cancelled", "expired"],
            default: "pending"
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiry: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

const Invitation = mongoose.model("Invitation", invitationSchema)

module.exports = Invitation
