import instance from "./axios";

export const createTask = async(projectId,{title,description,email,status,priority,deadline})=>{
    const response = await instance.post(`/task/createtask/${projectId}`,{
        title,
        description,
        email,
        status,
        priority,
        deadline
    })

    return response.data
}

export const getTask = async(projectId)=>{
    const response = await instance.get(`/task/getTask/${projectId}`)

    return response.data
}

export const updateStatus = async(taskId,status)=>{
    const response = await instance.post(`/task/status/${taskId}`,{
        status
    })
    return response.data
}

export const assignUser = async(taskId,email)=>{
    const response = await instance.post(`/task/assignee/${taskId}`,{
        email
    }
    )
    return response.data
}

export const deleteTask = async(taskId)=>{
    const response = await instance.post(`/task/delete/${taskId}`)
    return response.data
}