const express = require("express")
const activityModel = require("../ActivityLog/activityLogModel.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const ChangeController = asyncHandler(async (req,res)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(400,"Organization Id is not found")
    }

    const activities = await activityModel.find({organization:orgId}).sort({createdAt:-1}).populate("actor").populate("project").populate("entity")
    if(activities.length === 0){
        return res.status(200).json({
            message:"Activities not found",
            activities:[]
        })
    }

    res.status(200).json({
        message:"Activities Found",
        activity:activities
    })
})

const taskChangeController = asyncHandler(async (req,res)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(400,"Organization Id is not found")
    }

    const activities = await activityModel.find({
            organization:orgId,
            entityType:"Task"
    }).sort({createdAt:-1}).populate("actor").populate("project").populate("entity")

    if(activities.length == 0 ){
        return res.status(200).json({
            message:"Activities not found",
            activities:[]
        })
    }

    res.status(200).json({
        message:"Activities Found",
        activity:activities
    })
})


const teamChangeController = asyncHandler(async (req,res)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(400,"Organization Id is not found")
    }

    const activities = await activityModel.find({
            organization:orgId,
            entityType:"Team"
    }).sort({createdAt:-1}).populate("actor").populate("project").populate("entity")

    if(activities.length == 0 ){
        return res.status(200).json({
            message:"Activities not found",
            activities:[]
        })
    }

    res.status(200).json({
        message:"Activities Found",
        activity:activities
    })
})



const projectChangeController = asyncHandler(async (req,res)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(404,"Organization Id is not found")
    }

    const activities = await activityModel.find({
            organization:orgId,
            entityType:"Project"
    }).sort({createdAt:-1}).populate("actor").populate("project").populate("entity")

    if(activities.length == 0 ){
        return res.status(200).json({
            message:"Activities not found",
            activities:[]
        })
    }

    res.status(200).json({
        message:"Activities Found",
        activity:activities
    })
})


module.exports = {
    ChangeController,
    taskChangeController,
    teamChangeController,
    projectChangeController
}
