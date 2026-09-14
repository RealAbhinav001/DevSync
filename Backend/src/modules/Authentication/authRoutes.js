const express = require("express")
const {
    signupController,
    loginController,
    getmeController,
    refreshController,
    logoutController
} = require("./authController.js")
const authMiddleWare = require("./authmiddleware.js")
const validator = require("../../middleware/validator.js")
const { User, login } = require("../../validators/authValidator.js")
const {authLimiter} = require("../../middleware/rateLimiter.js")

const router = express.Router()

router.post("/signup", authLimiter,validator(User), signupController)

router.get("/getme", authMiddleWare, getmeController)

router.post("/login",authLimiter, validator(login), loginController)

router.post("/logout", logoutController)

router.post("/refresh", refreshController)

module.exports = router
