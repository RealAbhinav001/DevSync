const mongoose = require("mongoose")
const projectModel = require("../Projects/projectModel.js")
const teamModel = require("../Team/teamModel.js")
const orgModel = require("../Organization/orgModels.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const project = asyncHandler(async (req,res,next)=>{
    const projectId = req.params.projectId
    const teamId = req.params.teamId

    let team;

    if(projectId){
        if(!mongoose.isObjectIdOrHexString(projectId)){
            throw new ApiError(400,"Object Id is not valid.")
        }

        const project = await projectModel.findById(projectId).populate("team");

        if(!project){
            throw new ApiError(404,"Project not found.")
        }

        team = project.team;

        req.project = project
    }
    else if(teamId){
        if(!mongoose.isObjectIdOrHexString(teamId)){
            throw new ApiError(400,"Team id is not found.")
        }

        team = await teamModel.findById(teamId)

        if(!team){
            throw new ApiError(404,"Team not Found.")
        }
    }
    else{
        throw new ApiError(404,"Project and Team Id is not found")
    }

    const org = await orgModel.findById(team.organization)
    if(!org){
        throw new ApiError(404,"Organization not found.")
    }

    const isOwner = req.user.id.toString() === org.owner.toString()
    if(!isOwner){
        throw new ApiError(403,"You are not Owner of the organization.")
    }

    req.team = team;

    next();
})

module.exports = project
