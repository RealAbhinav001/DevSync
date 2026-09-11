const express = require("express")
const projectModel = require("./projectModel.js")
const teamModel = require("../Team/teamModel.js")
const taskModel = require("../Tasks/taskModel.js")
const activityLogger = require("../../utils/activityLog.js")
const notification = require("../../services/notificationService.js")
const asyncHandler = require("../../utils/asyncHandler.js")

const createProject = asyncHandler(async (req,res)=>{
    const {title,description,status,deadline} = req.body

    const team = req.team

    const project = await projectModel.create({
        title,
        description,
        team:team._id,
        status,
        deadline
    })

    team.projects.push(project._id)
    await team.save()

    await activityLogger({
        actor:req.user._id,
        project:project._id,
        organization:team.organization,
        entityType:"Project",
        entity:project._id,
        action:"CREATE_PROJECT",
        message:`${req.user.name} created project`,
        oldValue:null,
        newValue:{
            title:project.title,
            status:project.status,
            deadline:project.deadline
        }

    })

    res.status(201).json({
        message:"Project Created Successfully",
        project,
        team
    })
})

const getProject = asyncHandler(async (req,res)=>{
    const team = req.team
    await team.populate("projects")

    if(team.projects.length === 0){
        return res.status(200).json({
            message:"Project not found",
            projects:[]
        })
    }

    res.status(200).json({
        message:"Projects Fonud Successflly",
        projects:team.projects
    })
})

const updateController = asyncHandler(async (req,res)=>{
    const {title,description,status,deadline} = req.body

    const project = req.project

    const orgId = project.team.organization

    const oldProject = {
        title:project.title,
        description:project.description,
        status:project.status,
        deadline:project.deadline
    }

    if(title){
        project.title = title
    }
    if(description){
        project.description = description
    }

    if(status){
        project.status = status
    }

    if(deadline){
        project.deadline = deadline
    }



    await project.save()

    await activityLogger({
        actor:req.user._id,
        project:project._id,
        organization:orgId,
        entityType:"Project",
        entity:project._id,
        action:"UPDATE_PROJECT",
        message:`${req.user.name} updated the Project`,
        oldValue:oldProject,
        newValue:{
            title:project.title,
            description:project.description,
            status:project.status,
            deadline:project.deadline
        }
    })

    res.status(200).json({
        message:"project Updated Successfully",
        project
    })
})

const deleteController = asyncHandler(async (req,res)=>{
    const project = req.project

    const team = req.team

    const oldProject = {
        title:project.title,
        description:project.description,
        status:project.status,
        deadline:project.deadline
    }

    await taskModel.deleteMany({
        _id:{
            $in:project.tasks
        }
    })

    const remainingProject = team.projects.filter(
        p => p.toString() !== project._id.toString()
    )

    team.projects = remainingProject
    await team.save()

    await projectModel.findByIdAndDelete(project._id)

    await activityLogger({
        actor:req.user._id,
        project:project._id,
        organization:team.organization,
        entityType:"Project",
        entity:project._id,
        action:"DELETE_PROJECT",
        message:`${req.user.name} deleted  project ${oldProject.title}`,
        oldValue:oldProject,
        newValue:null
    })

    res.status(200).json({
        message:"Project Deleted Successfully",
        project,
        team
    })
})

module.exports = {
    createProject,
    getProject,
    updateController,
    deleteController
}
