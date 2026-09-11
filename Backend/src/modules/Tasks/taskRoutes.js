const express = require("express")
const {
    createController,
    getController,
    updateController,
    assignController,
    deleteController
} = require("./tasksController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const taskMiddleware = require("../Tasks/taskMiddleWare.js")
const validator = require("../../middleware/validator.js")
const {
    createTaskSchema,
    statusSchema,
    assignSchema
} = require("../../validators/taskValidator.js")

const router = express.Router()

router.post(
    "/createtask/:projectId",
    authMiddleWare,
    taskMiddleware,
    validator(createTaskSchema),
    createController
)
router.get("/getTask/:projectId", authMiddleWare, taskMiddleware, getController)
router.post(
    "/status/:taskId",
    authMiddleWare,
    taskMiddleware,
    validator(statusSchema),
    updateController
)
router.post(
    "/assignee/:taskId",
    authMiddleWare,
    taskMiddleware,
    validator(assignSchema),
    assignController
)
router.post("/delete/:taskId", authMiddleWare, taskMiddleware, deleteController)

module.exports = router
