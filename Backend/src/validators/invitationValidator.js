const zod = require("zod")

const inviteSchema = zod.object({
    email: zod.email()
})

module.exports = { inviteSchema }
