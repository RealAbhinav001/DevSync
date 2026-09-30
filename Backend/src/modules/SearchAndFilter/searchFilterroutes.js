const express = require("express")
const {
    searchController,
    searchprojectController,
    searchtaskController,
    projectfilterController
} = require("./searchFilterController.js")

const authMiddleWare = require("../Authentication/authmiddleware.js")

const {organizationMiddleware} = require("../Organization/organizationMiddleware.js")

const teamMiddleware = require("../Team/teamMiddleWare.js")
const taskMiddleware = require("../Tasks/taskMiddleWare.js")

const router = express.Router()

router.get("/teamsearch/:id",authMiddleWare,organizationMiddleware, searchController)
router.get("/projectsearch/:id",authMiddleWare,teamMiddleware, searchprojectController)
router.get("/tasksearch/:id",authMiddleWare,taskMiddleware, searchtaskController)
router.get("/projectfilter/:id",authMiddleWare,teamMiddleware, projectfilterController)
module.exports = router
