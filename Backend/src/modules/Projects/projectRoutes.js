const express = require("express")
const {
    createProject,
    getProject,
    updateController,
    deleteController
} = require("./projectController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const projectMiddleware = require("./projectMiddleware.js")
const validator = require("../../middleware/validator.js")
const { createProjectSchema, updateProjectSchema } = require("../../validators/projectValidator.js")

const router = express.Router()

router.post(
    "/create/:teamId",
    authMiddleWare,
    projectMiddleware,
    validator(createProjectSchema),
    createProject
)
router.get("/getProject/:teamId", authMiddleWare, projectMiddleware, getProject)
router.post(
    "/update/:projectId",
    authMiddleWare,
    projectMiddleware,
    validator(updateProjectSchema),
    updateController
)
router.post("/delete/:projectId", authMiddleWare, projectMiddleware, deleteController)

module.exports = router
