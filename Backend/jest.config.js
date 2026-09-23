module.exports = {
    // Node environment (not browser/jsdom) — we test a Node/Express backend
    testEnvironment: "node",

    // runs BEFORE the app is imported — sets test env vars
    setupFiles: ["<rootDir>/tests/env.js"],

    // runs AFTER the test framework is ready — DB lifecycle (beforeAll/afterEach/afterAll)
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

    // only treat files ending in .test.js as tests
    testMatch: ["**/tests/**/*.test.js"]
}
