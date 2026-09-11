const projectModel = require("../Projects/projectModel.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const statusController = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId
    if (!projectId) {
        throw new ApiError(400, "Project ID not found")
    }

    const project = await projectModel.findById(projectId).populate("tasks")
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const board = project.tasks.reduce(
        (acc, task) => {
            acc[task.status].push(task)

            return acc
        },
        {
            "to-do": [],
            "in-progress": [],
            review: [],
            done: []
        }
    )

    res.status(200).json({
        message: "Task Status",
        board
    })
})

module.exports = {
    statusController
}
