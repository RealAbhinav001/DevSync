const mongoose = require("mongoose")
const projectModel = require("../Projects/projectModel.js")
const taskModel = require("../Tasks/taskModel.js")
const orgModel = require("../Organization/orgModels.js")

const taskMiddleware =async (req,res,next)=>{
    try{
        const projectId = req.params.projectId;
        const taskId = req.params.taskId
        let realproject

        if(projectId){
            if(!mongoose.isObjectIdOrHexString(projectId)){
                return res.status(400).json({
                    message:"Project Id is not Valid."
                })
            }

            const project = await projectModel.findById(projectId).populate("team")
            if(!project){
                return res.status(404).json({
                    message:"You Don't Have a Valid Project"
                })
            }

            realproject = project
        }
        else if(taskId){
            if(!mongoose.isObjectIdOrHexString(taskId)){
                return res.status(400).json({
                    message:"Your Task Id is not Valid."
                })
            }

            const task = await taskModel.findById(taskId)
            if(!task){
                return res.status(404).json({
                    message:"You Don't Have Valid Task."
                })
            }

            const project = await projectModel.findById(task.project).populate("team")
            if(!project){
                return res.status(404).json({
                    message:"You Don't Have Valid Projects"
                })
            }

            realproject= project

            req.task = task
        }
        else{
            return res.status(400).json({
                message:"Not Valid Id Found"
            })
        }
        const team = realproject.team
        if(!team){
            return res.status(404).json({
                message:"Team Not Found"
            })
        }

        const org = await orgModel.findById(team.organization)
        if(!org){
            return res.status(404).json({
                message:"Organization Not Found"
            })
        }

        const isOwner = org.owner.toString() === req.user.id.toString()
        if(!isOwner){
            return res.status(403).json({
                message:"You are not the Owner of the Organization"
            })
        }

        req.project = realproject

        next()
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

module.exports = taskMiddleware