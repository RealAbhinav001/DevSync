const zod = require("zod")

const createOrgSchema = zod.object({
    name: zod.string().min(2),
    description: zod.string().optional()
})

const addMemberSchema = zod.object({
    email: zod.email()
})

module.exports = { createOrgSchema, addMemberSchema }
