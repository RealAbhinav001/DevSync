const request = require("supertest")
const app = require("../src/app.js")

describe("auth test", ()=>{
    let accessToken

    beforeEach(async()=>{
        const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush551@gmail.com",password:"12345678"})
        accessToken  = res.body.accessToken
    })

    it("runs auth test",async ()=>{
        const res = await request(app).post("/api/auth/signup").send({name:"sarthak",email:"sarthak112@gmail.com",password:"112233888"})

        expect(res.status).toBe(201)
        expect(res.body.user.email).toBe("sarthak112@gmail.com")
        expect(res.body.user.password).toBe(undefined)
    })

    it("detect duplicate user", async()=>{
        const res = await request(app).post("/api/auth/signup").send({name:"pratyush",email:"pratyush551@gmail.com",password:"12345678"})

        expect(res.status).toBe(400)
    })

    it("login without password",async()=>{
        const res = await request(app).post("/api/auth/login").send({email:"pratyush551@gmail.com"})

        expect(res.status).toBe(400)
    })

    it("login with incorrect password",async ()=>{
        const res = await request(app).post("/api/auth/login").send({email:"pratyush551@gmail.com",password:"1233121212"})

        expect(res.status).toBe(401)
    })

    it("logs in an existing user with correct credentials",async ()=>{
        const res = await request(app).post("/api/auth/login").send({email:"pratyush551@gmail.com",password:"12345678"})

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe("pratyush551@gmail.com")
        expect(res.body.user.password).toBe(undefined)
    })

    it("found user in database",async ()=>{
        const res = await request(app).get("/api/auth/getme").set("Authorization",`Bearer ${accessToken}`)

        expect(res.status).toBe(200)
        expect(res.body.user.email).toBe("pratyush551@gmail.com")
    })

    it("requesting user without token",async()=>{
        const res = await request(app).get("/api/auth/getme")

        expect(res.status).toBe(401)
    })
})