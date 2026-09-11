const express = require("express")
const {
    createController,
    orgTeam,
    addMember,
    teamMember,
    removemember,
    changeRole
} = require("./teamController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const { organizationMiddleware } = require("../Organization/organizationMiddleware.js")
const { organizationOwnerMiddleware } = require("../Organization/organizationMiddleware.js")
const teamMiddleware = require("./teamMiddleWare.js")

const router = express.Router()

router.post(
    "/create/:id",
    authMiddleWare,
    organizationMiddleware,
    organizationOwnerMiddleware,
    createController
)
router.get("/getTeam/:id", authMiddleWare, organizationMiddleware, orgTeam)
router.post("/addmember/:id", authMiddleWare, teamMiddleware, addMember)
router.get("/getteammember/:id", authMiddleWare, teamMiddleware, teamMember)
router.post("/removemembers/:teamid/:userid", authMiddleWare, teamMiddleware, removemember)
router.post("/changerole/:teamid/:userid", authMiddleWare, teamMiddleware, changeRole)

module.exports = router
