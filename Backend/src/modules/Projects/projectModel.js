const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        },
        status: {
            type: String,
            enum: ["active", "completed", "on-hold", "cancelled"],
            default: "active"
        },
        deadline: {
            type: Date,
            
        },
        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            }
        ]
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model("Project", projectSchema)

module.exports = Project
