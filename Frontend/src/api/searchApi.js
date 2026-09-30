import instance from "./axios.js"

export const searchTeam = async(orgId,query)=>{
    const response = await instance.get(`/search/teamsearch/${orgId}?query=${query}`)

    return response.data
}

export const searchProject = async(teamId,query)=>{
    const response = await instance.get(`/search/projectsearch/${teamId}?query=${query}`)

    return response.data
}

export const searchTask = async(projectId,query)=>{
    const response = await instance.get(`/search/tasksearch/${projectId}?query=${query}`)

    return response.data
}

export const projectFilter = async(teamId,status)=>{
    const response = await instance.get(`/search/projectfilter/${teamId}?status=${status}`)

    return response.data
}