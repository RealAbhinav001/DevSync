const jwt = require("jsonwebtoken")
const userModel = require("../Authentication/authModels.js")
const config = require("../../config/config.js")

const authSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error("Token is not found"))
        }

        const decoded = jwt.verify(token, config.SECRET_KEY)
        if (!decoded) {
            return next(new Error("Token is Invalid"))
        }

        const user = await userModel.findById(decoded.id).select("-password")
        if (!user) {
            return next(new Error("User is already deleted"))
        }

        socket.user = {
            id: user.id,
            _id: user._id,
            name: user.name,
            email: user.email
        }

        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authSocket
