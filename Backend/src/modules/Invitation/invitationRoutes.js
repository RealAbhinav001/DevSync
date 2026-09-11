const express = require("express")
const authMiddleware = require("../Authentication/authmiddleware.js")
const {
    organizationMiddleware,
    organizationOwnerMiddleware
} = require("../Organization/organizationMiddleware.js")
const {
    createInvitationController,
    acceptInvitationController,
    rejectInvitationController,
    cancelInvitationController,
    listOrganizationInvitesController,
    listuserInvitesController
} = require("./invitationController.js")
const validator = require("../../middleware/validator.js")
const { inviteSchema } = require("../../validators/invitationValidator.js")

const router = express.Router()

router.post(
    "/:id",
    authMiddleware,
    organizationMiddleware,
    organizationOwnerMiddleware,
    validator(inviteSchema),
    createInvitationController
)
router.post("/accept/:token", authMiddleware, acceptInvitationController)
router.post("/reject/:token", authMiddleware, rejectInvitationController)
router.post("/cancel/:inviteId", authMiddleware, cancelInvitationController)
router.get(
    "/invites/:id",
    authMiddleware,
    organizationMiddleware,
    organizationOwnerMiddleware,
    listOrganizationInvitesController
)
router.get("/yourinvites", authMiddleware, listuserInvitesController)

module.exports = router
