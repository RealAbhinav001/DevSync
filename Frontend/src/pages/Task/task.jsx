import { useState,useEffect } from "react"
import {useParams} from "react-router-dom"
import { getTask,createTask,updateStatus,deleteTask,assignUser } from "../../api/taskApi"

const Task = ()=>{
    const [tasks,setTasks] = useState([])
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const [taskForm,setTaskForm] = useState(false)
    const [assignInputs,setAssignInputs] = useState({})
    const [taskData,setTaskData] = useState({
        title:"",
        description: "",
        email:"",
        status:"to-do",
        priority:"medium",
        deadline:""
    })
    const params = useParams()

    const handleChange = (e)=>{
        const {name,value} = e.target

        setTaskData(prev =>({...prev,[name]:value}))
    }

    const handleTaskSubmit =async (e)=>{
        try{
            e.preventDefault()
            setError("")
            if(!taskData.title.trim() || !taskData.description.trim() || !taskData.email.trim() || !taskData.status.trim() || !taskData.priority.trim() || !taskData.deadline.trim()){
                setError("Please Fill All the Field")
                return
            }
            const data = await createTask(params.projectId,taskData)
            setTasks(prev => [data.task,...prev])
            setTaskData({
                title:"",
                description:"",
                email:"",
                status:"to-do",
                priority:"medium",
                deadline:""
            })
            setTaskForm(false)
        }
        catch(error){
            setError(error.response?.data?.message)
        }
    }   

    const handleStatusChange =async (taskId,newstatus)=>{
        try{
            setError("")

            const data = await updateStatus(taskId,newstatus)

            setTasks(prev => prev.map(t => t._id === taskId ? {...t,status:newstatus}:t))
        }
        catch(error){
            setError(error.response?.data?.message)
        }
    }

    const removeTask = async(taskId)=>{
        try{
            setError("")
            await deleteTask(taskId)

            setTasks(prev => prev.filter(t => t._id !== taskId))
        }
        catch(error){
            setError(error.response?.data?.message)
        }
    }


    const handleAssign = async(taskId,email)=>{
        try{
            setError("")

            const data = await assignUser(taskId,email)

            setTasks(prev => prev.map(t => t._id === taskId? data.task:t))
            setAssignInputs(prev =>({...prev,[taskId]:""}))
            
        }
        catch(error){
            setError(error.response?.data?.message)
        }
    }

    useEffect(()=>{
        const renderTask =async ()=>{
            try{
                setError("")
                setLoading(true)

                const data = await getTask(params.projectId)
                setTasks(data.tasks)
            }
            catch(error){
                setError(error.response?.data?.message)
            }
            finally{
                setLoading(false)
            }
        }
        renderTask()
    },[])
    return(
        <div className="taskContainer">
            {error && <div className="error-Container">
                <p>{error}</p>
            </div>}
            {!error && loading && <div className="loadingContainer">
                <p>Loading...</p>
            </div>}
            {!error && !loading && tasks.length ===0 && <div className="emptyTask">
                <p>You Don't Have Any Tasks Right Now</p>
            </div>}
            {!error && !loading && tasks.length>0 && <div className="taskmainContainer">
                {tasks.map((task)=>(
                    <div className="task" key={task._id}>
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                        <select onChange={(e)=>handleStatusChange(task._id,e.target.value)} name="status" id="" value={task.status}>
                            <option value="to-do">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                        <p>{task.priority}</p>
                        <p>{task.deadline}</p>
                        <p>{task.assignee.name}</p>
                        <p>{task.assignee.email}</p>
                        <div className="reassign-State">
                            <input type="email" placeholder="Assignee's Email" onChange={e => setAssignInputs(prev => ({...prev,[task._id]:e.target.value}))} value={assignInputs[task._id] || ""}/>
                            <button onClick={()=>{handleAssign(task._id,assignInputs[task._id])}}>Assign</button>
                        </div>
                    </div>
                ))}
            </div>}
            <button onClick={()=>(setTaskForm(prev => !prev))}>Create Task</button>

            {taskForm && <div className="taskformContainer">
                <form onSubmit={handleTaskSubmit}>
                    <input type="text" placeholder="Enter the Title of the Task" onChange={handleChange} name="title" value={taskData.title}/>
                    <input type="text" placeholder="Enter the Description of the Task" onChange={handleChange} name="description" value={taskData.description}/>
                    <input type="email" placeholder="Assignee's Email" onChange={handleChange} name="email" value={taskData.email}/>
                    <select onChange={handleChange} name="status" id="" value={taskData.status}>
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>
                    <select onChange={handleChange} name="priority" id="" value={taskData.priority}>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="urgent">Urgent</option>
                    </select>
                    <input type="date" placeholder="Enter the DeadLine for the Task" onChange={handleChange} name="deadline" value={taskData.deadline}/>
                    <button type="Submit">Create Task</button>
                </form>
            </div>}
        </div>
    )
}

export default Task