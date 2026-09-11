const teamModel = require("../Team/teamModel.js")
const chatModel = require("../chats/teamChatModel.js")
const {getIo} = require("../realTime/socketManager.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const sendMessageController = asyncHandler(async (req,res)=>{
    const teamId = req.params.teamId;
    if(!teamId){
        throw new ApiError(400,"Team Id not found")
    }

    const team = await teamModel.findById(teamId)
    if(!team){
        throw new ApiError(404,"Team not found")
    }

    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"User Id is not found")
    }

    const isteamMember = team.members.some(
        member =>member.user.toString() === userId.toString()
    )

    if(!isteamMember){
        throw new ApiError(403,"User not the part of team")
    }

    const content = req.body.content;
    if(!content || !content.trim()){
        throw new ApiError(400,"Message is required")
    }

    const chat = await chatModel.create({
        organization:team.organization,
        team:teamId,
        sender:userId,
        content:content.trim()
    })

    res.status(201).json({
        message:"Chat Created Successfully",
        chat
    })
})


const getMessageController = asyncHandler(async (req,res)=>{
    const teamId = req.params.teamId
    if(!teamId){
        throw new ApiError(400,"Team Id not found")
    }

    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"User Id is not found")
    }

    const team = await teamModel.findById(teamId)
    if(!team){
        throw new ApiError(404,"Team is not found")
    }

    const isteamMember = team.members.some(
        member => member.user.toString() === userId.toString()
    )

    if(!isteamMember){
        throw new ApiError(403,"User is not Team member")
    }

    const chats = await chatModel.find({team:teamId,deletedAt:null}).sort({createdAt:1}).populate("sender","name email")
    if(chats.length === 0){
        return res.status(200).json({
            message:"No Chats Found Start the Conversation",
            chats:[]
        })
    }


    res.status(200).json({
        message:"Chats Found",
        chats:chats
    })
})

const deleteMessageController = asyncHandler(async (req,res)=>{
    const messageId = req.params.messageId;
    if(!messageId){
        throw new ApiError(400,"Message Id not found")
    }

    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"User Id not Found")
    }

    const message = await chatModel.findById(messageId)
    if(!message){
        throw new ApiError(404,"message not found")
    }

    if(message.sender.toString() !== userId.toString()){
        throw new ApiError(403,"You are not sender of this message")
    }

    if(message.deletedAt !== null){
        throw new ApiError(400,"Message Already Deleted")
    }

    message.deletedAt = new Date()
    await message.save()

    res.status(200).json({
        message:"Message Deleted Successfully",
        messageId:message._id,
        messageDeletedAt:message.deletedAt
    })
})

const editMessageController = asyncHandler(async (req,res)=>{
    const messageId = req.params.messageId
    if(!messageId){
        throw new ApiError(400,"Message Id is not found")
    }

    const userId = req.user._id
    if(!userId){
        throw new ApiError(400,"User Id is not found")
    }

    const message = await chatModel.findById(messageId)
    if(!message){
        throw new ApiError(404,"Message not found")
    }

    if(message.deletedAt !== null){
        throw new ApiError(400,"Message already deleted")
    }

    if(message.sender.toString() !== userId.toString()){
        throw new ApiError(403,"You are not sender of this message")
    }

    const newContent = req.body.content;
    if(!newContent || !newContent.trim()){
        throw new ApiError(400,"No message found")
    }

    message.content = newContent.trim();
    message.isEdited = true
    await message.save()

    res.status(200).json({
        message:"Message Edited Successfull",
        messageContent : message.content,
        messageId:messageId
    })
})

const uploadController = asyncHandler(async (req,res)=>{
    const teamId = req.params.teamId
    if(!teamId){
        throw new ApiError(400,"Team Id not found")
    }

    const team = await teamModel.findById(teamId)
    if(!team){
        throw new ApiError(400,"Team not found")
    }

    const isMember = team.members.some(
        member => member.user.toString() === req.user._id.toString()
    )
    if(!isMember){
        throw new ApiError(400,"Member not found in the team")
    }

    if(!req.file){
        throw new ApiError(400,"File not uploaded")
    }


    const chat = await chatModel.create({
        organization:team.organization,
        team:teamId,
        sender:req.user._id,
        content:req.body.content,
        attachments:[{
            originalName:req.file.originalname,
            fileName:req.file.filename,
            filePath:`/uploads/chats/${req.file.filename}`,
            mimeType:req.file.mimetype,
            size:req.file.size
        }]
    })

    await chat.populate("sender","name email")

    const io = getIo()
    const room = `team:${teamId}`
    io.to(room).emit("receive-team-message",chat)

    res.status(201).json({
        message:"File uploaded Successfully",
        chat
    })
})

const filesController = asyncHandler(async(req,res)=>{
    const teamId = req.params.teamId
    if(!teamId){
        throw new ApiError(400,"Team Id not found")
    }

    const team = await teamModel.findById(teamId)
    if(!team){
        throw new ApiError(400,"Team not found")
    }

    const isMember = team.members.some(
        member => member.user.toString() === req.user.id.toString()
    )

    if(!isMember){
        throw new ApiError(403,"You are not member of team")
    }

    const chat = await chatModel.find({team:teamId,deletedAt:null,"attachments.0":{$exists:true}}).sort({createdAt:-1}).populate("sender","name email")
    if(chat.length === 0){
        return res.status(200).json({
            message:"Files not found",
            files:[]
        })
    }

    res.status(200).json({
        message:"Files Found",
        files:chat
    })
})

module.exports = {
    sendMessageController,
    getMessageController,
    deleteMessageController,
    editMessageController,
    uploadController,
    filesController
}
