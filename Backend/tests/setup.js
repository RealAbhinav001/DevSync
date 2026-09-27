const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const { setIo } = require("../src/modules/realTime/socketManager.js")

let mongo

// ── before ALL tests: start an in-memory MongoDB + connect mongoose to it ──
// Tests run against this throwaway DB, never your real Atlas data.
beforeAll(async () => {
    mongo = await MongoMemoryServer.create()
    await mongoose.connect(mongo.getUri())

    // Stub socket.io: controllers (task/project) emit real-time events via getIo().
    // The real io is only wired up on the HTTP server, which tests don't start —
    // so without this stub, getIo() throws and those endpoints would 500 in tests.
    setIo({ to: () => ({ emit: () => {} }) })
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
