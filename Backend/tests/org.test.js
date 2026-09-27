const request = require("supertest")
const app = require("../src/app.js")


describe("Organization Test",()=>{
    describe("POST /create",()=>{
        let accessToken
        beforeEach(async()=>{
            const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush331@gmail.com",password:"1221191"})
            accessToken = res.body.accessToken
        })

        it("Should create new Organization",async ()=>{
            const res = await request(app).post("/api/organization/create").set("Authorization",`Bearer ${accessToken}`).send({name:"Editing",description:"Creating Platform for Editor"})

            expect(res.status).toBe(201)
            expect(res.body.organization.name).toBe("Editing")
        })

        it("should reject create without token (401)",async ()=>{
            const res = await request(app).post("/api/organization/create").send({name:"Editing",description:"Creating Platform for Editing"})

            expect(res.status).toBe(401)
        })

        it("should reject create with invalid data (400)",async ()=>{
            const res = await request(app).post("/api/organization/create").set("Authorization",`Bearer ${accessToken}`).send({name:"E"})

            expect(res.status).toBe(400)
        })
    })

    describe("GET /getorganization",()=>{
        let accessToken
        beforeEach(async()=>{
            const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush331@gmail.com",password:"1221191"})
            accessToken = res.body.accessToken
        })

        it("should return organization",async()=>{
            const res = await request(app).get("/api/organization/getorganization").set("Authorization",`Bearer ${accessToken}`)

            expect(res.status).toBe(200)
        })
    })

   describe("RABC guard",()=>{
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

    it("should provide Organization",async ()=>{
        const res = await request(app).get(`/api/organization/${orgID}`).set("Authorization" ,`Bearer ${accessTokenA}`)

        expect(res.status).toBe(200)
    })

    it("should reject Organization",async ()=>{
        const res = await request(app).get(`/api/organization/${orgID}`).set("Authorization",`Bearer ${accessTokenB}`)

        expect(res.status).toBe(403)
    })
   })

   describe("Owner Guard",()=>{
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

    it("Should Reject To add Member",async()=>{
        const res = await request(app).post(`/api/organization/${orgID}/addMember`).set("Authorization",`Bearer ${accessTokenB}`)

        expect(res.status).toBe(403)
    })
   })
})