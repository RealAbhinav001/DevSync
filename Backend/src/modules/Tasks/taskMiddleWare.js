const mongoose = require("mongoose")
const projectModel = require("../Projects/projectModel.js")
const taskModel = require("../Tasks/taskModel.js")
const orgModel = require("../Organization/orgModels.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const taskMiddleware = asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId
    const taskId = req.params.taskId
    let realproject

    if (projectId) {
        if (!mongoose.isObjectIdOrHexString(projectId)) {
            throw new ApiError(400, "Project Id is not Valid.")
        }

        const project = await projectModel.findById(projectId).populate("team")
        if (!project) {
            throw new ApiError(404, "You Don't Have a Valid Project")
        }

        realproject = project
    } else if (taskId) {
        if (!mongoose.isObjectIdOrHexString(taskId)) {
            throw new ApiError(400, "Your Task Id is not Valid.")
        }

        const task = await taskModel.findById(taskId)
        if (!task) {
            throw new ApiError(404, "You Don't Have Valid Task.")
        }

        const project = await projectModel.findById(task.project).populate("team")
        if (!project) {
            throw new ApiError(404, "You Don't Have Valid Projects")
        }

        realproject = project

        req.task = task
    } else {
        throw new ApiError(400, "Not Valid Id Found")
    }
    const team = realproject.team
    if (!team) {
        throw new ApiError(404, "Team Not Found")
    }

    const org = await orgModel.findById(team.organization)
    if (!org) {
        throw new ApiError(404, "Organization Not Found")
    }

    const isOwner = org.owner.toString() === req.user.id.toString()
    if (!isOwner) {
        throw new ApiError(403, "You are not the Owner of the Organization")
    }

    req.project = realproject

    next()
})

module.exports = taskMiddleware
