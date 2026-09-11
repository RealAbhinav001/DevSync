const express = require("express")
const notificationModel = require("../notification/notificationModel.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const notifyController = asyncHandler(async (req,res)=>{
    const orgId = req.params.id
    if(!orgId){
        throw new ApiError(400,"Organizaition Id is not found")
    }

    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"User not found")
    }

    const notifications = await notificationModel.find({receiver:userId,organization:orgId}).sort({createdAt:-1})
    if(notifications.length ===0){
        return res.status(200).json({
            message:"No Notifications Found",
            notifications:[]
        })
    }

    res.status(200).json({
        message:"Notifications Found",
        notifications:notifications
    })
})

const readController = asyncHandler(async (req,res)=>{
    const notificationId = req.params.id
    if(!notificationId){
        throw new ApiError(400,"Notification Id not found")
    }

    const notification = await notificationModel.findById(notificationId)
    if(!notification){
        throw new ApiError(400,"Notifaication Not Found")
    }

    notification.read = true
    await notification.save()

    res.status(200).json({
        message:"You read this notification",
        notification
    })
})

module.exports = {
    notifyController,
    readController
}
