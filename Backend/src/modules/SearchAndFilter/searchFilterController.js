const teamModel = require("../Team/teamModel.js")
const projectModel = require("../Projects/projectModel.js")
const taskModel = require("../Tasks/taskModel.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const searchController = asyncHandler(async (req, res) => {
    const orgId = req.params.id
    if (!orgId) {
        throw new ApiError(400, "Organization Id not found")
    }
    const query = req.query.query
    if (!query) {
        throw new ApiError(400, "Query not found")
    }

    const team = await teamModel.find({
        organization: orgId,
        name: { $regex: query, $options: "i" }
    })
    if (team.length === 0) {
        return res.status(200).json({
            message: "No Team Found Of this name",
            team: []
        })
    }

    res.status(200).json({
        message: "Team Found",
        team: team
    })
})

const searchprojectController = asyncHandler(async (req, res) => {
    const teamId = req.params.id
    if (!teamId) {
        throw new ApiError(400, "Team Id not found")
    }

    const query = req.query.query
    if (!query) {
        throw new ApiError(400, "Query not found")
    }

    const projects = await projectModel.find({
        team: teamId,
        title: { $regex: query, $options: "i" }
    })
    if (projects.length === 0) {
        return res.status(200).json({
            message: "Projects not found",
            projects: []
        })
    }

    res.status(200).json({
        message: "Projects Found",
        projects: projects
    })
})

const searchtaskController = asyncHandler(async (req, res) => {
    const projectId = req.params.id
    if (!projectId) {
        throw new ApiError(400, "Project Id is not found")
    }

    const query = req.query.query
    if (!query) {
        throw new ApiError(400, "Query Not Found")
    }

    const tasks = await taskModel.find({
        project: projectId,
        title: { $regex: query, $options: "i" }
    })
    if (tasks.length === 0) {
        return res.status(200).json({
            message: "Task not found",
            tasks: []
        })
    }

    res.status(200).json({
        message: "Task Found",
        tasks: tasks
    })
})

const projectfilterController = asyncHandler(async (req, res) => {
    const teamId = req.params.id
    if (!teamId) {
        throw new ApiError(400, "Project Id not found")
    }

    const status = req.query.status
    if (!status) {
        throw new ApiError(400, "Status not Found")
    }

    const projects = await projectModel.find({ team: teamId, status: status })
    if (projects.length === 0) {
        return res.status(200).json({
            message: "Project of this status not found",
            projects: []
        })
    }

    res.status(200).json({
        message: "Project Found",
        projects: projects
    })
})

module.exports = {
    searchController,
    searchprojectController,
    searchtaskController,
    projectfilterController
}
