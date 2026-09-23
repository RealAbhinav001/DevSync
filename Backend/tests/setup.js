const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")

let mongo

// ── before ALL tests: start an in-memory MongoDB + connect mongoose to it ──
// Tests run against this throwaway DB, never your real Atlas data.
beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())
})

// ── after EACH test: wipe every collection ──
// Keeps tests isolated — one test's data never leaks into the next.
afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})

// ── after ALL tests: disconnect + stop the in-memory server ──
afterAll(async () => {
    await mongoose.disconnect()
    await mongo.stop()
})
