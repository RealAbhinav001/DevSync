const request = require("supertest")
const app = require("../src/app.js")

// ── helper: org → team → project chain owned by user A, plus outsider user B ──
// taskMiddleware only lets the ORG OWNER touch tasks, so:
//   tokenA     → owner (allowed)
//   tokenB     → outsider / non-owner (rejected with 403)
//   ownerEmail → a real registered user, used as the task assignee (create needs it)
//   projectID  → project inside A's team (used as :projectId when creating a task)
async function setupProject() {
    const ownerEmail = "owner@test.com"

    const a = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Owner", email: ownerEmail, password: "12345678" })
    const tokenA = a.body.accessToken

    const b = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Outsider", email: "outsider@test.com", password: "12345678" })
    const tokenB = b.body.accessToken

    const org = await request(app)
        .post("/api/organization/create")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Editing", description: "Editing platform" })
    const orgID = org.body.organization._id

    const team = await request(app)
        .post(`/api/team/create/${orgID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Test Team" })
    const teamID = team.body.team._id

    const project = await request(app)
        .post(`/api/project/create/${teamID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Landing Page", description: "Marketing site", deadline: "2026-12-31" })
    const projectID = project.body.project._id

    return { tokenA, tokenB, ownerEmail, projectID }
}

// helper: create a task in the project, return its id
async function createTask(tokenA, projectID, ownerEmail) {
    const res = await request(app)
        .post(`/api/task/createtask/${projectID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Build navbar", email: ownerEmail, description: "Top nav", deadline: "2026-12-31" })
    return res.body.task._id
}

describe("Task", () => {
    describe("POST /createtask/:projectId", () => {
        let tokenA, tokenB, ownerEmail, projectID
        beforeEach(async () => {
            ;({ tokenA, tokenB, ownerEmail, projectID } = await setupProject())
        })

        it("should create a task as org owner (201)", async () => {
            const res = await request(app)
                .post(`/api/task/createtask/${projectID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ title: "Build navbar", email: ownerEmail, description: "Top nav", deadline: "2026-12-31" })

            expect(res.status).toBe(201)
            expect(res.body.task.title).toBe("Build navbar")
        })

        it("should reject create without token (401)", async () => {
            const res = await request(app)
                .post(`/api/task/createtask/${projectID}`)
                .send({ title: "Build navbar", email: ownerEmail })

            expect(res.status).toBe(401)
        })

        it("should reject create with invalid data (400)", async () => {
            const res = await request(app)
                .post(`/api/task/createtask/${projectID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({}) // title + email are required

            expect(res.status).toBe(400)
        })

        it("should reject create by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/task/createtask/${projectID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ title: "Build navbar", email: ownerEmail })

            expect(res.status).toBe(403)
        })
    })

    describe("GET /getTask/:projectId", () => {
        let tokenA, tokenB, ownerEmail, projectID
        beforeEach(async () => {
            ;({ tokenA, tokenB, ownerEmail, projectID } = await setupProject())
            await createTask(tokenA, projectID, ownerEmail)
        })

        it("should return tasks for the org owner (200)", async () => {
            const res = await request(app)
                .get(`/api/task/getTask/${projectID}`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject a non-owner (403)", async () => {
            const res = await request(app)
                .get(`/api/task/getTask/${projectID}`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })

    describe("POST /status/:taskId", () => {
        let tokenA, tokenB, ownerEmail, projectID, taskID
        beforeEach(async () => {
            ;({ tokenA, tokenB, ownerEmail, projectID } = await setupProject())
            taskID = await createTask(tokenA, projectID, ownerEmail)
        })

        it("should update task status as org owner (200)", async () => {
            const res = await request(app)
                .post(`/api/task/status/${taskID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ status: "done" })

            expect(res.status).toBe(200)
            expect(res.body.task.status).toBe("done")
        })

        it("should reject invalid status value (400)", async () => {
            const res = await request(app)
                .post(`/api/task/status/${taskID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ status: "not-a-real-status" })

            expect(res.status).toBe(400)
        })

        it("should reject status change by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/task/status/${taskID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ status: "done" })

            expect(res.status).toBe(403)
        })
    })

    describe("POST /assignee/:taskId", () => {
        let tokenA, tokenB, ownerEmail, projectID, taskID
        beforeEach(async () => {
            ;({ tokenA, tokenB, ownerEmail, projectID } = await setupProject())
            taskID = await createTask(tokenA, projectID, ownerEmail)
        })

        it("should assign the task as org owner (200)", async () => {
            const res = await request(app)
                .post(`/api/task/assignee/${taskID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: ownerEmail })

            expect(res.status).toBe(200)
        })

        it("should reject assign by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/task/assignee/${taskID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ email: ownerEmail })

            expect(res.status).toBe(403)
        })
    })

    describe("POST /delete/:taskId", () => {
        let tokenA, tokenB, ownerEmail, projectID, taskID
        beforeEach(async () => {
            ;({ tokenA, tokenB, ownerEmail, projectID } = await setupProject())
            taskID = await createTask(tokenA, projectID, ownerEmail)
        })

        it("should delete the task as org owner (200)", async () => {
            const res = await request(app)
                .post(`/api/task/delete/${taskID}`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject delete by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/task/delete/${taskID}`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })
})
