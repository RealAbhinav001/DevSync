const express = require("express")
const {createController,getController,updateController,assignController,deleteController} = require("./tasksController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const taskMiddleware = require("../Tasks/taskMiddleWare.js")

const router = express.Router()

router.post("/createtask/:projectId",authMiddleWare,taskMiddleware,createController)
router.get("/getTask/:projectId",authMiddleWare,taskMiddleware,getController)
router.post("/status/:taskId",authMiddleWare,taskMiddleware,updateController)
router.post("/assignee/:taskId",authMiddleWare,taskMiddleware,assignController)
router.post("/delete/:taskId",authMiddleWare,taskMiddleware,deleteController)

module.exports = router
