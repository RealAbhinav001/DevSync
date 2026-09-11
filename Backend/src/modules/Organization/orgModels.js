const moongoose = require("mongoose")

const orgSchema = new moongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        owner: {
            type: moongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        members: [
            {
                type: moongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        teams: [
            {
                type: moongoose.Schema.Types.ObjectId,
                ref: "Team"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Organization = moongoose.model("Organization", orgSchema)

module.exports = Organization
