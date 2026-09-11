const zod = require("zod")

const messageSchema = zod.object({
    content: zod.string().min(1)
})

module.exports = { messageSchema }
