const request = require("supertest")
const app = require("../src/app.js")

describe("auth test", ()=>{
    it("runs auth test",async ()=>{
        const res = await request(app).post("/api/auth/signup").send({name:"sarthak",email:"sarthak112@gmail.com",password:"112233888"})

        expect(res.status).toBe(201)
        expect(res.body.user.email).toBe("sarthak112@gmail.com")
        expect(res.body.user.password).toBe(undefined)
    })
})