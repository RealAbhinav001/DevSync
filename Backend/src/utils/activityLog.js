const activityModel = require("../modules/ActivityLog/activityLogModel.js")

const activityLogger = async ({
    actor,
    project,
    organization,
    entityType,
    entity,
    action,
    message,
    oldValue,
    newValue
}) => {
    try {
        await activityModel.create({
            actor,
            project,
            organization,
            entityType,
            entity,
            action,
            message,
            oldValue,
            newValue
        })
    } catch (error) {
        console.error("activity log failed:", error.message)
    }
}

module.exports = activityLogger
