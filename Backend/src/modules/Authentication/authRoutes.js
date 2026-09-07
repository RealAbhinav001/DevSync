const express = require("express");
const {
    getmeController,
    logoutController,
    createProfileController,
} = require("./authController.js");

const authMiddleWare = require("./authmiddleware.js");
const cognitoMiddleware = require("./cognitoMiddleware.js");

const router = express.Router();

router.get("/getme", authMiddleWare, getmeController);

router.post("/logout", cognitoMiddleware, logoutController);

router.post("/profile", cognitoMiddleware, createProfileController);

module.exports = router;