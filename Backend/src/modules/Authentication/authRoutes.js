const express = require("express")
const {
    signupController,
    loginController,
    getmeController,
    refreshController,
    logoutController
} = require("./authController.js")
const authMiddleWare = require("./authmiddleware.js")

const router = express.Router()

router.post("/signup", signupController)

router.get("/getme", authMiddleWare, getmeController)

router.post("/login", loginController)

router.post("/logout", logoutController)

router.post("/refresh", refreshController)

module.exports = router
