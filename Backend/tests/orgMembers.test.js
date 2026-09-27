const request = require("supertest")
const app = require("../src/app.js")

// owner (A) + an outsider (B). A owns the org; B is just a registered user.
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

    const org = await request(app)
        .post("/api/organization/create")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Editing", description: "Editing platform" })
    const orgID = org.body.organization._id

    return { tokenA, tokenB, orgID, memberEmail }
}

describe("Organization members", () => {
    describe("POST /:id/addMember", () => {
        let tokenA, tokenB, orgID, memberEmail
        beforeEach(async () => {
            ;({ tokenA, tokenB, orgID, memberEmail } = await setup())
        })

        it("should add a member as the owner (200)", async () => {
            const res = await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: memberEmail })

            expect(res.status).toBe(200)
        })

        it("should reject addMember without token (401)", async () => {
            const res = await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .send({ email: memberEmail })

            expect(res.status).toBe(401)
        })

        it("should reject addMember by a non-owner (403)", async () => {
            const res = await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ email: memberEmail })

            expect(res.status).toBe(403)
        })

        it("should reject adding a non-existent user (404)", async () => {
            const res = await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: "ghost@test.com" })

            expect(res.status).toBe(404)
        })

        it("should reject adding a duplicate member (409)", async () => {
            // add once (succeeds)
            await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: memberEmail })

            // add again → duplicate
            const res = await request(app)
                .post(`/api/organization/${orgID}/addMember`)
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ email: memberEmail })

            expect(res.status).toBe(409)
        })
    })

    describe("GET /:id/members", () => {
        let tokenA, tokenB, orgID
        beforeEach(async () => {
            ;({ tokenA, tokenB, orgID } = await setup())
        })

        it("should return members for an org member (200)", async () => {
            const res = await request(app)
                .get(`/api/organization/${orgID}/members`)
                .set("Authorization", `Bearer ${tokenA}`)

            expect(res.status).toBe(200)
        })

        it("should reject a non-member (403)", async () => {
            const res = await request(app)
                .get(`/api/organization/${orgID}/members`)
                .set("Authorization", `Bearer ${tokenB}`)

            expect(res.status).toBe(403)
        })
    })
})
