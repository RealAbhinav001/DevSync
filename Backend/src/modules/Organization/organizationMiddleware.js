const orgModel = require("./orgModels.js")
const mongoose = require("mongoose")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")


const organizationMiddleware = asyncHandler(async (req,res,next)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(400,"Organization Id not found")
    }

    if(!mongoose.isObjectIdOrHexString(orgId)){
        throw new ApiError(400,"Organization Id is not valid")
    }

    const organization = await orgModel.findById(orgId)
    if(!organization){
        throw new ApiError(404,"Organization Not Found")
    }

    const isMember = organization.members.some(
        member => member.toString() === req.user.id.toString()
    )


    const isOwner = organization.owner.toString() === req.user.id.toString()

    if(!isMember && !isOwner){
        throw new ApiError(403,"You are not the member of organization")
    }

    req.organization = organization

    next()
})

const organizationOwnerMiddleware = asyncHandler((req,res,next)=>{
    const isOwner = req.organization.owner.toString() === req.user.id.toString()

    if(!isOwner){
        throw new ApiError(403,"Only the organization owner can perform this action")
    }

    next()
})

module.exports = {organizationMiddleware,
    organizationOwnerMiddleware
}
