const request = require("supertest")
const app = require("../src/app.js")

// owner (A) + user B. A owns the org & team. B is added to the ORG (so B is
// eligible to be added to a team), but NOT yet to the team itself.
// teamMiddleware requires the ORG OWNER → B (non-owner) must be rejected with 403.
async function setup() {
    const a = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Owner", email: "owner@test.com", password: "12345678" })
    const tokenA = a.body.accessToken

    const b = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Member", email: "member@test.com", password: "12345678" })
    const tokenB = b.body.accessToken
    const memberEmail = "member@test.com"
    const memberId = b.body.user._id

    const org = await request(app)
        .post("/api/organization/create")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Editing", description: "Editing platform" })
    const orgID = org.body.organization._id

    // B must be an org member before they can join a team
    await request(app)
        .post(`/api/organization/${orgID}/addMember`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ email: memberEmail })

    const team = await request(app)
        .post(`/api/team/create/${orgID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Test Team" })
    const teamID = team.body.team._id

    return { tokenA, tokenB, teamID, memberEmail, memberId }
}

// put B into the team (needed before remove / change-role tests)
async function addBToTeam(tokenA, teamID, memberEmail) {
    await request(app)
        .post(`/api/team/addmember/${teamID}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ email: memberEmail, role: "member" })
}

describe("Team members", () => {
    describe("POST /addmember/:id", () => {
        let tokenA, tokenB, teamID, memberEmail
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID, memberEmail } = await setup())
        })

        it("should add a member as the owner (200)", async () => {
            const res = await request(app)
                .post(`/api/team/addmember/${teamID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: memberEmail, role: "member" })

            expect(res.status).toBe(200)
        })

        it("should reject addmember without token (401)", async () => {
            const res = await request(app)
                .post(`/api/team/addmember/${teamID}`)
                .send({ email: memberEmail, role: "member" })

            expect(res.status).toBe(401)
        })

        it("should reject addmember with invalid data (400)", async () => {
            const res = await request(app)
                .post(`/api/team/addmember/${teamID}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: memberEmail }) // role is required

            expect(res.status).toBe(400)
        })

        it("should reject addmember by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/team/addmember/${teamID}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ email: memberEmail, role: "member" })

            expect(res.status).toBe(403)
        })
    })

    describe("POST /removemembers/:teamid/:userid", () => {
        let tokenA, tokenB, teamID, memberEmail, memberId
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID, memberEmail, memberId } = await setup())
            await addBToTeam(tokenA, teamID, memberEmail)
        })

        it("should remove a member as the owner (200)", async () => {
            const res = await request(app)
                .post(`/api/team/removemembers/${teamID}/${memberId}`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject remove by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/team/removemembers/${teamID}/${memberId}`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })

    describe("POST /changerole/:teamid/:userid", () => {
        let tokenA, tokenB, teamID, memberEmail, memberId
        beforeEach(async () => {
            ;({ tokenA, tokenB, teamID, memberEmail, memberId } = await setup())
            await addBToTeam(tokenA, teamID, memberEmail)
        })

        it("should change a member's role as the owner (200)", async () => {
            const res = await request(app)
                .post(`/api/team/changerole/${teamID}/${memberId}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ newRole: "admin" })

            expect(res.status).toBe(200)
        })

        it("should reject invalid role value (400)", async () => {
            const res = await request(app)
                .post(`/api/team/changerole/${teamID}/${memberId}`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ newRole: "superadmin" }) // not in enum

            expect(res.status).toBe(400)
        })

        it("should reject role change by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/team/changerole/${teamID}/${memberId}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ newRole: "admin" })

            expect(res.status).toBe(403)
        })
    })
})
