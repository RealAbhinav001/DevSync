const isProd = process.env.NODE_ENV === "production"

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    SECRET_KEY: process.env.SECRET_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    SECURE: isProd,
    SAMESITE: isProd ? "none" : "strict"
}

const requireVars = ["MONGO_URI", "SECRET_KEY"]

requireVars.forEach((req) => {
    if (!config[req]) {
        console.error(`Missing required environment variable: ${req}`)
        process.exit(1)
    }
})

module.exports = config
