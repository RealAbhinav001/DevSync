const express = require("express")
const {
    totalteamController,
    totalProjectController,
    totaltaskController,
    totaltodoController,
    totalprogressController,
    totalreviewController,
    totaldoneController,
    organizationInfoController,
    previewactivityController,
    previewteamController,
    previewprojectController,
    overviewController
} = require("./dashboardController.js")
const { organizationMiddleware } = require("../Organization/organizationMiddleware.js")
const authMiddleware = require("../Authentication/authmiddleware.js")

const router = express.Router()

router.get("/totalteam/:id", authMiddleware, organizationMiddleware, totalteamController)
router.get("/totalproject/:id", authMiddleware, organizationMiddleware, totalProjectController)
router.get("/totaltask/:id", authMiddleware, organizationMiddleware, totaltaskController)
router.get("/todotask/:id", authMiddleware, organizationMiddleware, totaltodoController)
router.get("/totalprogress/:id", authMiddleware, organizationMiddleware, totalprogressController)
router.get("/totalreview/:id", authMiddleware, organizationMiddleware, totalreviewController)
router.get("/totaldone/:id", authMiddleware, organizationMiddleware, totaldoneController)
router.get("/orgInfo/:id", authMiddleware, organizationMiddleware, organizationInfoController)
router.get(
    "/previewactivity/:id",
    authMiddleware,
    organizationMiddleware,
    previewactivityController
)
router.get("/previewteam/:id", authMiddleware, organizationMiddleware, previewteamController)
router.get("/previewproject/:id", authMiddleware, organizationMiddleware, previewprojectController)
router.get("/overview/:id", authMiddleware, organizationMiddleware, overviewController)

module.exports = router
