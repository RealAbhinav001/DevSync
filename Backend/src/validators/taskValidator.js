const zod = require("zod")

const taskStatus = ["to-do", "in-progress", "review", "done"]
const taskPriority = ["high", "low", "medium", "urgent"]

const createTaskSchema = zod.object({
    title: zod.string().min(1),
    description: zod.string().optional(),
    email: zod.email(),
    status: zod.enum(taskStatus).optional(),
    priority: zod.enum(taskPriority).optional(),
    deadline: zod.string().optional()
})

const statusSchema = zod.object({
    status: zod.enum(taskStatus)
})

const assignSchema = zod.object({
    email: zod.email()
})

module.exports = { createTaskSchema, statusSchema, assignSchema }
