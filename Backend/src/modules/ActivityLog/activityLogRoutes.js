const express = require("express")
const {
    ChangeController,
    taskChangeController,
    teamChangeController,
    projectChangeController
} = require("./activityLogController.js")

const router = express.Router()

router.get("/Changes/:id", ChangeController)
router.get("/taskChange/:id", taskChangeController)
router.get("/teamChange/:id", teamChangeController)
router.get("/projectChange/:id", projectChangeController)

module.exports = router
