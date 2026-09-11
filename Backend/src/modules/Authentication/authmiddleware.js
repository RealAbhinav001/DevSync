const express = require("express")
const jwt = require("jsonwebtoken")
const config = require("../../config/config.js")
const userModel = require("./authModels.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const authMiddleWare = asyncHandler(async (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        throw new ApiError(401,"Token not found")
    }

    const token = authHeader.split(" ")[1]
    if(!token){
        throw new ApiError(401,"Invalid token format")
    }

    let decoded
    try{
        decoded = jwt.verify(token,config.SECRET_KEY)
    }
    catch(error){
        throw new ApiError(401,error.message)
    }

    const user = await userModel.findById(decoded.id).select("-password")
    if(!user){
        throw new ApiError(401,"User not found")
    }

    req.user = {
        id:user.id,
        _id:user._id,
        name:user.name,
        email:user.email
    }

    next()
})

module.exports = authMiddleWare
