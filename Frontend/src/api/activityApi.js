import instance from "./axios"

// full activity log (all types) for an organization
export const getAllActivity = async (id) => {
    const response = await instance.get(`/activity/Changes/${id}`)
    return response.data
}

export const getTaskActivity = async (id) => {
    const response = await instance.get(`/activity/taskChange/${id}`)
    return response.data
}

export const getTeamActivity = async (id) => {
    const response = await instance.get(`/activity/teamChange/${id}`)
    return response.data
}

export const getProjectActivity = async (id) => {
    const response = await instance.get(`/activity/projectChange/${id}`)
    return response.data
}
