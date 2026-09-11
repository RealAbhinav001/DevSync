const express = require("express")
const {
    sendMessageController,
    getMessageController,
    deleteMessageController,
    editMessageController,
    uploadController,
    filesController
} = require("./teamChatController.js")
const authMiddleWare = require("../Authentication/authmiddleware.js")
const uploadMiddleWare = require("../../middleware/upload.js")
const validator = require("../../middleware/validator.js")
const { messageSchema } = require("../../validators/chatValidator.js")
const router = express.Router()

router.post("/sendMessage/:teamId", authMiddleWare, validator(messageSchema), sendMessageController)
router.get("/getMessage/:teamId", authMiddleWare, getMessageController)
router.post("/deleteMessage/:messageId", authMiddleWare, deleteMessageController)
router.post("/edit/:messageId", authMiddleWare, validator(messageSchema), editMessageController)
router.post(
    "/:teamId/upload",
    authMiddleWare,
    uploadMiddleWare.single("chatFiles"),
    uploadController
)
router.get("/:teamId/files", authMiddleWare, filesController)
module.exports = router
