const userModel = require("./authModels.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../../config/config.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const signupController = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const isAlreadyRegister = await userModel.findOne({
        $or: [{ email }]
    })

    if (isAlreadyRegister) {
        throw new ApiError(400, "You Already Registed")
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        name,
        email,
        password: hashedPassword
    })

    const accessToken = jwt.sign(
        {
            id: user.id
        },
        config.ACCESS_KEY,
        {
            expiresIn: "15m"
        }
    )

    const refreshToken = jwt.sign(
        {
            id: user.id
        },
        config.REFRESH_KEY,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.SECURE,
        sameSite: config.SAMESITE,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    user.password = undefined

    res.status(201).json({
        message: "user successfull created",
        user,
        accessToken
    })
})

const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({
        $or: [{ email }]
    })
    if (!user) {
        throw new ApiError(400, "User Not Found")
    }
    const pass = await bcrypt.compare(password, user.password)

    if (!pass) {
        throw new ApiError(400, "Check your credentials")
    }

    const accessToken = jwt.sign(
        {
            id: user.id
        },
        config.ACCESS_KEY,
        {
            expiresIn: "15m"
        }
    )

    const refreshToken = jwt.sign(
        {
            id: user.id
        },
        config.REFRESH_KEY,
        {
            expiresIn: "7d"
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.SECURE,
        sameSite: config.SAMESITE,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    user.password = undefined

    res.status(200).json({
        message: "User Found",
        user,
        accessToken
    })
})

const getmeController = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user.id)

    if (!user) {
        throw new ApiError(400, "User not found")
    }

    user.password = undefined

    res.status(200).json({
        message: "User successfully found",
        user
    })
})

const logoutController = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.SECURE,
        sameSite: config.SAMESITE
    })

    res.status(200).json({
        message: "User successfull Logout"
    })
})

const refreshController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new ApiError(401, "Invalid")
    }

    let decoded
    try {
        decoded = jwt.verify(refreshToken, config.REFRESH_KEY)
    } catch (error) {
        throw new ApiError(401, error.message)
    }

    const accessToken = jwt.sign(
        {
            id: decoded.id
        },
        config.ACCESS_KEY,
        {
            expiresIn: "15m"
        }
    )

    res.status(200).json({
        message: "Access Token Created",
        accessToken
    })
})

module.exports = {
    signupController,
    loginController,
    getmeController,
    refreshController,
    logoutController
}
