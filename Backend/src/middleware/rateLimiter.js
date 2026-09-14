const rateLimiter = require("express-rate-limit")

const generalLimiter = rateLimiter({
    windowMs:15 * 60 * 1000,
    limit:100,
    message:{success:false,message:"Rate Limit Exceeds"},
    standardHeaders: true
})

const authLimiter = rateLimiter({
    windowMs:15 * 60 * 1000, 
    limit:15,
    message:{success:false,message:"Too many login attempts, try again later"},
    standardHeaders: true

})

module.exports = {generalLimiter,authLimiter}