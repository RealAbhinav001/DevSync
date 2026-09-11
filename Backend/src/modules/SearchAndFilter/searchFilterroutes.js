const express = require("express")
const {
    searchController,
    searchprojectController,
    searchtaskController,
    projectfilterController
} = require("./searchFilterController.js")

const router = express.Router()

router.get("/teamsearch/:id", searchController)
router.get("/projectsearch/:id", searchprojectController)
router.get("/tasksearch/:id", searchtaskController)
router.get("/projectfilter/:id", projectfilterController)
module.exports = router
