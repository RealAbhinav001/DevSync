const request = require("supertest")
const app = require("../src/app.js")

describe("Team Test",()=>{
    describe("POST /create",()=>{
        let orgID
        let accessTokenA
        let accessTokenB
        beforeEach(async()=>{
            const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush331@gmail.com",password:"1221191"})
            accessTokenA = res.body.accessToken

            const ress = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush1@gmail.com",password:"1221191"})
            accessTokenB = ress.body.accessToken

            const org = await request(app).post("/api/organization/create").set("Authorization",`Bearer ${accessTokenA}`).send({name:"Editing",description:"Creating Platform for Editor"})
            orgID = org.body.organization._id
        })

        it("Should Create Team",async()=>{
            const res = await request(app).post(`/api/team/create/${orgID}`).set("Authorization",`Bearer ${accessTokenA}`).send({name:"Test Team"})

            expect(res.status).toBe(200)

        })

        it("Should Reject Team",async()=>{
            const res = await request(app).post(`/api/team/create/${orgID}`).set("Authorization",`Bearer ${accessTokenB}`).send({name:"Test"})

            expect(res.status).toBe(403)
        })
    })

    describe("GET /getteammember/:id",()=>{
        let orgID
        let accessTokenA
        let accessTokenB
        let teamID
        beforeEach(async()=>{
            const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush331@gmail.com",password:"1221191"})
            accessTokenA = res.body.accessToken

            const ress = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush1@gmail.com",password:"1221191"})
            accessTokenB = ress.body.accessToken

            const org = await request(app).post("/api/organization/create").set("Authorization",`Bearer ${accessTokenA}`).send({name:"Editing",description:"Creating Platform for Editor"})
            orgID = org.body.organization._id

            const team = await request(app).post(`/api/team/create/${orgID}`).set("Authorization",`Bearer ${accessTokenA}`).send({name:"Test Team"})
            teamID = team.body.team._id
        })

        it("Should Return Team Member",async()=>{
            const res = await request(app).get(`/api/team/getteammember/${teamID}`).set("Authorization",`Bearer ${accessTokenA}`)

            expect(res.status).toBe(200)
        })

        it("Should Reject",async ()=>{
            const res = await request(app).get(`/api/team/getteammember/${teamID}`).set("Authorization",`Bearer ${accessTokenB}`)

            expect(res.status).toBe(403)
        })
    })
})