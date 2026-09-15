import instance from "./axios.js"

export const getMessages = async (teamId)=>{
    const response = await instance.get(`/chat/getMessage/${teamId}`)

    return response.data
}