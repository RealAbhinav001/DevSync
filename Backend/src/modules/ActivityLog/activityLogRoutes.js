const express = require("express")
const {
    ChangeController,
    taskChangeController,
    teamChangeController,
    projectChangeController
} = require("./activityLogController.js")

const authMiddleWare = require("../Authentication/authmiddleware.js")

const {organizationMiddleware} = require("../Organization/organizationMiddleware.js")

const router = express.Router()

router.get("/Changes/:id",authMiddleWare,organizationMiddleware, ChangeController)
router.get("/taskChange/:id",authMiddleWare,organizationMiddleware, taskChangeController)
router.get("/teamChange/:id",authMiddleWare,organizationMiddleware, teamChangeController)
router.get("/projectChange/:id",authMiddleWare,organizationMiddleware, projectChangeController)

module.exports = router
