import instance from "./axios.js"

export const getMessages = async (teamId)=>{
    const response = await instance.get(`/chat/getMessage/${teamId}`)

    return response.data
}

export const uploadFiles = async (teamId,formData)=>{
    const response = await instance.post(`/chat/${teamId}/upload`,formData)

    return response.data
}