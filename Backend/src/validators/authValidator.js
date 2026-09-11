const zod = require("zod")

const User = zod.object({
    name: zod.string().min(2),
    email: zod.email(),
    password: zod.string().min(6)
})

const login = zod.object({
    email: zod.email(),
    password: zod.string().min(6)
})

module.exports = { User, login }
