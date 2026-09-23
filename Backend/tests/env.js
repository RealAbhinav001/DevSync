// Runs before the app loads. config.js checks these exist (else process.exit(1)),
// so tests need them set. MONGO_URI here is a dummy just to pass that check —
// the REAL connection is to the in-memory server (see setup.js). ACCESS/REFRESH
// keys are used to sign/verify JWTs during tests.
process.env.NODE_ENV = "test"
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/devsync-test"
process.env.ACCESS_KEY = process.env.ACCESS_KEY || "test_access_secret_key"
process.env.REFRESH_KEY = process.env.REFRESH_KEY || "test_refresh_secret_key"
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
