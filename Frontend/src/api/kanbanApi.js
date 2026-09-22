import instance from "./axios";

export const taskStatus = async (projectId)=>{
    const response = await instance.post(`/kanban/status/${projectId}`)

    return response.data
}