const mongoose = require("mongoose")
const teamModel = require("./teamModel.js")
const organizationModel = require("../Organization/orgModels.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const teamMiddleware = asyncHandler(async(req,res,next)=>{
    const teamId = req.params.teamid || req.params.id;
    if(!teamId){
        throw new ApiError(400,"Team Id Not Found.")
    }

    if(!mongoose.isObjectIdOrHexString(teamId)){
        throw new ApiError(400,"Team Id is not Valid.")
    }

    const team = await teamModel.findById(teamId)

    if(!team){
        throw new ApiError(404,"Team not found.")
    }

    const org = await organizationModel.findById(team.organization)
    if(!org){
        throw new ApiError(404,"You are not the member of organization.")
    }

    const isOwner = org.owner.toString() === req.user.id.toString()
    if(!isOwner){
        throw new ApiError(403,"You are not the Owner of the Organization.")
    }

    req.team = team

    next()
})

module.exports = teamMiddleware;
