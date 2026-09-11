const express = require("express")
const { statusController } = require("./kanbanController.js")

const router = express.Router()

router.post("/status/:projectId", statusController)

module.exports = router
