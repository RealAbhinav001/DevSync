const isProd = process.env.NODE_ENV === "production"

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    REFRESH_KEY: process.env.REFRESH_KEY,
    ACCESS_KEY:process.env.ACCESS_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    SECURE: isProd,
    SAMESITE: isProd ? "none" : "strict"
}

const requireVars = ["MONGO_URI", "ACCESS_KEY","REFRESH_KEY"]

requireVars.forEach((req) => {
    if (!config[req]) {
        console.error(`Missing required environment variable: ${req}`)
        process.exit(1)
    }
})

module.exports = config
