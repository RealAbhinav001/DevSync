const taskModel = require("./taskModel.js")
const projectModel = require("../Projects/projectModel.js")
const userModel = require("../Authentication/authModels.js")
const activityLogger = require("../../utils/activityLog.js")
const notification = require("../../services/notificationService.js")
const { getIo } = require("../realTime/socketManager.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const createController = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId
    if (!projectId) {
        throw new ApiError(400, "Project Id is not found")
    }

    const { title, description, email, status, priority, deadline } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError(404, "Assigne not found")
    }

    const project = await projectModel.findById(projectId).populate("team")
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const task = await taskModel.create({
        title,
        description,
        project: projectId,
        assignee: user._id,
        status,
        priority,
        deadline
    })

    project.tasks.push(task._id)
    await project.save()

    await activityLogger({
        actor: req.user._id,
        project: projectId,
        organization: project.team.organization,
        entityType: "Task",
        entity: task._id,
        action: "CREATE_TASK",
        message: `${req.user.name} created Task`,
        oldValue: null,
        newValue: {
            status: task.status
        }
    })

    const io = getIo()
    io.to(`project:${projectId}`).emit("task-created", task)

    res.status(201).json({
        message: "Task Created Successfully",
        task,
        project
    })
})

const getController = asyncHandler(async (req, res) => {
    const projectId = req.params.projectId
    if (!projectId) {
        throw new ApiError(404, "Project Id not found")
    }

    const project = await projectModel
        .findById(projectId)
        .populate({ path: "tasks", populate: { path: "assignee" } })
    if (!project) {
        throw new ApiError(404, "Project is not found")
    }

    if (project.tasks.length === 0) {
        return res.status(200).json({
            message: "Taks not found",
            tasks: []
        })
    }

    res.status(200).json({
        message: "Tasks Found Successfully",
        tasks: project.tasks
    })
})

const updateController = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId
    if (!taskId) {
        throw new ApiError(404, "Task Id not found")
    }

    const { status } = req.body

    const task = await taskModel.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const project = await projectModel.findById(task.project).populate("team")

    const oldStatus = task.status

    task.status = status
    await task.save()

    await activityLogger({
        actor: req.user._id,
        project: task.project,
        organization: project.team.organization,
        entityType: "Task",
        entity: taskId,
        action: "STATUS_CHANGE",
        message: `${req.user.name} updated the task Status`,
        oldValue: {
            status: oldStatus
        },
        newValue: {
            status: status
        }
    })

    const io = getIo()
    io.to(`project:${task.project}`).emit("task-status-updated", task)

    res.status(200).json({
        message: "Status Update Successfully",
        task
    })
})

const assignController = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId
    if (!taskId) {
        throw new ApiError(400, "Task Id not found.")
    }

    const { email } = req.body

    const task = await taskModel.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task Not Found")
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User Not Found")
    }

    const project = await projectModel.findById(task.project).populate("team")

    task.assignee = user._id
    await task.save()
    await task.populate("assignee")

    await notification({
        receiver: user._id,
        sender: req.user._id,
        action: "TASK_ASSIGN",
        message: "You were assigned Task",
        entityType: "Task",
        entityId: task._id,
        organization: project.team.organization,
        read: false
    })

    const io = getIo()
    io.to(`project:${task.project}`).emit("task-assigned", task)

    res.status(200).json({
        message: "Task Assign Successfully",
        task
    })
})

const deleteController = asyncHandler(async (req, res) => {
    const taskId = req.params.taskId
    if (!taskId) {
        throw new ApiError(400, "TaskId not Found")
    }

    const task = await taskModel.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const project = await projectModel.findById(task.project).populate("team")
    if (!project) {
        throw new ApiError(404, "Project Not Found")
    }

    const oldTask = {
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee
    }

    const remainingTask = project.tasks.filter((task) => task.toString() !== taskId.toString())

    project.tasks = remainingTask
    await project.save()

    await taskModel.findByIdAndDelete(taskId)

    await activityLogger({
        actor: req.user._id,
        project: project._id,
        organization: project.team.organization,
        entityType: "Task",
        entity: task._id,
        action: "DELETE_TASK",
        message: `${req.user.name} deleted task`,
        oldValue: oldTask,
        newValue: null
    })

    const io = getIo()
    io.to(`project:${task.project}`).emit("task-deleted", task)

    res.status(200).json({
        message: "Tasks Deleted Successfully",
        project
    })
})

module.exports = {
    createController,
    getController,
    updateController,
    assignController,
    deleteController
}
