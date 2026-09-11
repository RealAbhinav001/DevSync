const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        status: {
            type: String,
            enum: ["to-do", "in-progress", "review", "done"],
            default: "to-do"
        },
        priority: {
            type: String,
            enum: ["high", "low", "medium", "urgent"],
            default: "medium"
        },
        deadline: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
