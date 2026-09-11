const express = require("express")
const {
    createController,
    getController,
    ownerController,
    singleOrganizationController,
    addMemberController,
    getOrganizationMembersController
} = require("./orgController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const {
    organizationMiddleware,
    organizationOwnerMiddleware
} = require("./organizationMiddleware.js")
const validator = require("../../middleware/validator.js")
const { createOrgSchema, addMemberSchema } = require("../../validators/orgValidator.js")

const router = express.Router()

router.post("/create", authMiddleWare, validator(createOrgSchema), createController)
router.get("/getorganization", authMiddleWare, getController)
router.get("/ownorganization", authMiddleWare, ownerController)
router.get("/:id", authMiddleWare, organizationMiddleware, singleOrganizationController)
router.post(
    "/:id/addMember",
    authMiddleWare,
    organizationMiddleware,
    organizationOwnerMiddleware,
    validator(addMemberSchema),
    addMemberController
)
router.get("/:id/members", authMiddleWare, organizationMiddleware, getOrganizationMembersController)

module.exports = router
