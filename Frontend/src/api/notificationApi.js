import instance from "./axios";

export const getNotifications = async (id)=>{
    const response = await instance.get(`/notify/notify/${id}`)

    return response.data
}

export const readNotification = async (id)=>{
    const response = await instance.post(`/notify/read/${id}`)

    return response.data
}