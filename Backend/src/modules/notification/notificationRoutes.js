const express = require("express")
const { notifyController, readController } = require("./notificationController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")

const router = express.Router()

router.get("/notify/:id", authMiddleWare, notifyController)
router.post("/read/:id", readController)

module.exports = router
