const teamModel = require("./teamModel.js")
const orgModel = require("../Organization/orgModels.js")
const userModel = require("../Authentication/authModels.js")
const activityLogger = require("../../utils/activityLog.js")
const notification = require("../../services/notificationService.js")
const asyncHandler = require("../../utils/asyncHandler.js")
const ApiError = require("../../utils/apiError.js")

const createController = asyncHandler(async (req, res) => {
    const orgId = req.params.id
    const { name } = req.body
    if (!orgId) {
        throw new ApiError(401, "Invalid Organization")
    }

    const org = await orgModel.findById(orgId)
    if (!org) {
        throw new ApiError(401, "Organization not found")
    }

    const team = await teamModel.create({
        name,
        organization: orgId
    })

    org.teams.push(team._id)
    await org.save()

    await activityLogger({
        actor: req.user._id,
        project: null,
        organization: orgId,
        entityType: "Team",
        entity: team._id,
        action: "CREATE_TEAM",
        message: `${req.user.name} created team`,
        oldValue: null,
        newValue: {
            name: team.name
        }
    })

    res.status(200).json({
        message: "Team Created Successfully",
        team,
        org
    })
})

const orgTeam = asyncHandler(async (req, res) => {
    const orgId = req.params.id
    if (!orgId) {
        throw new ApiError(400, "Organization not found")
    }

    const team = await teamModel.find({ organization: orgId })
    if (team.length === 0) {
        return res.status(200).json({
            message: "Team not found",
            team: []
        })
    }

    res.status(200).json({
        message: "Team found in the organization",
        team
    })
})

const addMember = asyncHandler(async (req, res) => {
    const teamId = req.params.id
    const { email, role } = req.body
    if (!teamId) {
        throw new ApiError(400, "Team Id not found")
    }

    const team = await teamModel.findById(teamId)
    if (!team) {
        throw new ApiError(400, "Team not found")
    }

    const user = await userModel.findOne({
        email
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const duplicate = team.members.some((member) => member.user.toString() === user._id.toString())

    if (duplicate) {
        throw new ApiError(409, "User already exits")
    }

    const org = await orgModel.findById(team.organization)
    if (!org) {
        throw new ApiError(404, "No Organization Found")
    }

    const isMember = org.members.some((member) => member.toString() === user._id.toString())
    if (!isMember) {
        throw new ApiError(404, "You are not the Member of the Organization")
    }

    const oldMember = [...team.members]

    team.members.push({ user: user._id, role })
    await team.save()
    await team.populate("members.user")

    await activityLogger({
        actor: req.user._id,
        project: null,
        organization: team.organization,
        entityType: "Team",
        entity: team._id,
        action: "ADD_MEMBER",
        message: `${req.user.name} added member to team`,
        oldValue: oldMember,
        newValue: team.members
    })

    await notification({
        receiver: user._id,
        sender: req.user._id,
        action: "TEAM_MEMBER_ADD",
        message: `You were added to ${team.name}`,
        entityType: "Team",
        entityId: team._id,
        organization: team.organization,
        read: false
    })
    res.status(200).json({
        message: "Member Added",
        members: team.members
    })
})

const teamMember = asyncHandler(async (req, res) => {
    const teamId = req.params.id
    if (!teamId) {
        throw new ApiError(404, "Team not found")
    }

    const team = await teamModel.findById(teamId).populate("members.user")
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    res.status(200).json({
        message: "User Found",
        members: team.members
    })
})

const removemember = asyncHandler(async (req, res) => {
    const teamId = req.params.teamid
    if (!teamId) {
        throw new ApiError(404, "Team ID not fouund")
    }

    const userId = req.params.userid
    if (!userId) {
        throw new ApiError(404, "User ID not found")
    }

    const user = await userModel.findById(userId)
    if (!user) {
        throw new ApiError(400, "User does not exits")
    }

    const team = await teamModel.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not found")
    }

    const userPresent = team.members.some((member) => member.user.toString() === userId)
    if (!userPresent) {
        throw new ApiError(404, "User not found")
    }

    const oldMember = [...team.members]

    team.members = team.members.filter((member) => member.user.toString() !== userId)
    await team.save()

    await activityLogger({
        actor: req.user._id,
        project: null,
        organization: team.organization,
        entityType: "Team",
        entity: team._id,
        action: "REMOVE_MEMBER",
        message: `${req.user.name} removed member from ${team.name}`,
        oldValue: oldMember,
        newValue: team.members
    })

    await notification({
        receiver: user._id,
        sender: req.user._id,
        action: "TEAM_MEMBER_REMOVE",
        message: `You were remove from ${team.name}`,
        entityType: "Team",
        entityId: teamId,
        organization: team.organization,
        read: false
    })

    res.status(200).json({
        message: "User deleted suuccessfully",
        members: team.members
    })
})

const changeRole = asyncHandler(async (req, res) => {
    const teamId = req.params.teamid
    if (!teamId) {
        throw new ApiError(404, "Team id not found")
    }

    const userId = req.params.userid
    if (!userId) {
        throw new ApiError(404, "User id not found")
    }

    const { newRole } = req.body

    const team = await teamModel.findById(teamId)
    if (!team) {
        throw new ApiError(404, "Team not fouund")
    }

    const user = await userModel.findById(userId)
    if (!user) {
        throw new ApiError(400, "User not found")
    }

    const member = team.members.find((member) => member.user.toString() === userId.toString())
    if (!member) {
        throw new ApiError(404, "User not found")
    }

    const oldRole = member.role

    member.role = newRole
    await team.save()
    await team.populate("members.user")
    await activityLogger({
        actor: req.user._id,
        project: null,
        organization: team.organization,
        entityType: "Team",
        entity: team._id,
        action: "UPDATE_ROLE",
        message: `${req.user.name} changed roles in ${team.name}`,
        oldValue: { role: oldRole },
        newValue: { role: member.role }
    })

    await notification({
        receiver: user._id,
        sender: req.user._id,
        action: "ROLE_UPDATE",
        message: `Your role updated in ${team.name}`,
        entityType: "Team",
        entityId: teamId,
        organization: team.organization,
        read: false
    })

    res.status(200).json({
        message: "Role Change Suuccessfully",
        members: team.members
    })
})

module.exports = {
    createController,
    orgTeam,
    addMember,
    teamMember,
    removemember,
    changeRole
}
