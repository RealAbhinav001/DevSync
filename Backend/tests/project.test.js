const request = require("supertest")
const app = require("../src/app.js")

// ── helper: build the org → team chain owned by user A, plus an outsider user B ──
// projectMiddleware only lets the ORG OWNER touch projects, so we need:
//   tokenA  → the owner (allowed)
//   tokenB  → an outsider / non-owner (must be rejected with 403)
//   teamID  → team inside A's org (used as :teamId when creating a project)
async function setupOrgTeam() {
    const a = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Owner", email: "owner@test.com", password: "12345678" })
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

    return { tokenA, tokenB, orgID, teamID }
}

// helper: create a project in A's team, return its id
async function createProject(tokenA, teamID) {
    const res = await request(app)
        .post(`/api/project/create/${teamID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "Landing Page", description: "Marketing site", deadline: "2026-12-31" })
    return res.body.project._id
}

describe("Project", () => {
    describe("POST /create/:teamId", () => {
        let tokenA, tokenB, teamID
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID } = await setupOrgTeam())
        })

        it("should create a project as org owner (201)", async () => {
            const res = await request(app)
                .post(`/api/project/create/${teamID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ title: "Landing Page", description: "Marketing site", deadline: "2026-12-31" })

            expect(res.status).toBe(201)
            expect(res.body.project.title).toBe("Landing Page")
        })

        it("should reject create without token (401)", async () => {
            const res = await request(app)
                .post(`/api/project/create/${teamID}`)
                .send({ title: "Landing Page" })

            expect(res.status).toBe(401)
        })

        it("should reject create with invalid data (400)", async () => {
            const res = await request(app)
                .post(`/api/project/create/${teamID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({}) // title is required

            expect(res.status).toBe(400)
        })

        it("should reject create by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/project/create/${teamID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ title: "Landing Page" })

            expect(res.status).toBe(403)
        })
    })

    describe("GET /getProject/:teamId", () => {
        let tokenA, tokenB, teamID
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID } = await setupOrgTeam())
            await createProject(tokenA, teamID)
        })

        it("should return projects for the org owner (200)", async () => {
            const res = await request(app)
                .get(`/api/project/getProject/${teamID}`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject a non-owner (403)", async () => {
            const res = await request(app)
                .get(`/api/project/getProject/${teamID}`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })

    describe("POST /update/:projectId", () => {
        let tokenA, tokenB, teamID, projectID
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID } = await setupOrgTeam())
            projectID = await createProject(tokenA, teamID)
        })

        it("should update a project as org owner (200)", async () => {
            const res = await request(app)
                .post(`/api/project/update/${projectID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ title: "New Title" })

            expect(res.status).toBe(200)
            expect(res.body.project.title).toBe("New Title")
        })

        it("should reject update by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/project/update/${projectID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ title: "Hacked" })

            expect(res.status).toBe(403)
        })
    })

    describe("POST /delete/:projectId", () => {
        let tokenA, tokenB, teamID, projectID
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID } = await setupOrgTeam())
            projectID = await createProject(tokenA, teamID)
        })

        it("should delete a project as org owner (200)", async () => {
            const res = await request(app)
                .post(`/api/project/delete/${projectID}`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject delete by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/project/delete/${projectID}`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })
})
