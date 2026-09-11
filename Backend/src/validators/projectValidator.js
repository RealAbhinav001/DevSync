const zod = require("zod")

const projectStatus = ["active", "completed", "on-hold", "cancelled"]

const createProjectSchema = zod.object({
    title: zod.string().min(1),
    description: zod.string().optional(),
    status: zod.enum(projectStatus).optional(),
    deadline: zod.string().optional()
})

const updateProjectSchema = zod.object({
    title: zod.string().min(1).optional(),
    description: zod.string().optional(),
    status: zod.enum(projectStatus).optional(),
    deadline: zod.string().optional()
})

module.exports = { createProjectSchema, updateProjectSchema }
