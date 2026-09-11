const zod = require("zod")

const teamRole = ["admin", "member"]

const createTeamSchema = zod.object({
    name: zod.string().min(2)
})

const addMemberSchema = zod.object({
    email: zod.email(),
    role: zod.enum(teamRole)
})

const changeRoleSchema = zod.object({
    newRole: zod.enum(teamRole)
})

module.exports = { createTeamSchema, addMemberSchema, changeRoleSchema }
