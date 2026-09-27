const rateLimiter = require("express-rate-limit")

// Disable rate limiting under tests — the suite fires many requests fast and
// would otherwise trip the limiter (429) and cascade into false failures.
const skipInTest = () => process.env.NODE_ENV === "test"

const generalLimiter = rateLimiter({
    windowMs:15 * 60 * 1000,
    limit:100,
    message:{success:false,message:"Rate Limit Exceeds"},
    standardHeaders: true,
    skip: skipInTest
})

const authLimiter = rateLimiter({
    windowMs:15 * 60 * 1000,
    limit:15,
    message:{success:false,message:"Too many login attempts, try again later"},
    standardHeaders: true,
    skip: skipInTest

})

module.exports = {generalLimiter,authLimiter}