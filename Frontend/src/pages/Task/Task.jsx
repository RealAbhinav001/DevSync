import "./Task.css"
import { useState,useEffect } from "react"
import {useParams} from "react-router-dom"
import { getTask,createTask,updateStatus,deleteTask,assignUser } from "../../api/taskApi"
import { motion } from "framer-motion"
import { Asterisk, Plus, X, Trash2, CalendarClock, UserPlus, ArrowUpRight } from "lucide-react"

const taskDateFormatter = new Intl.DateTimeFormat("en-IN", { day:"2-digit", month:"short", year:"numeric" })

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
        <div className="tkx-page">
          <div className="tkx-frame">

            {/* mini rail */}
            <div className="tkx-minirail">
              <span>DEVSYNC<sup>®</sup></span>
              <span>TASK BOARD</span>
              <span>[ {tasks.length.toString().padStart(2,"0")} ]</span>
            </div>

            {/* hero */}
            <header className="tkx-hero">
              <p className="tkx-kicker">the work, tracked</p>
              <h1 className="tkx-title">
                TASKS
                <i className="tkx-star" aria-hidden="true"><Asterisk size={"100%"} strokeWidth={2.2}/></i>
              </h1>
              <div className="tkx-heroline">
                <span className="tkx-count">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</span>
                <button className="tkx-new" onClick={()=>(setTaskForm(prev => !prev))}>
                  {taskForm ? <><X size={15}/> CLOSE</> : <><Plus size={15}/> NEW TASK</>}
                </button>
              </div>
            </header>

            {error && <div className="tkx-state tkx-state-error">
                <span className="tkx-state-tag">⚠ SIGNAL ERROR</span>
                <h2>{error}</h2>
            </div>}

            {!error && loading && <div className="tkx-state tkx-state-loading">
                <span className="tkx-state-tag">❯ SYNCING</span>
                <h2>Loading tasks…</h2>
                <div className="tkx-track" aria-hidden="true"><span/></div>
            </div>}

            {!error && !loading && tasks.length ===0 && <div className="tkx-state tkx-state-empty">
                <span className="tkx-state-tag">[ VOID ]</span>
                <h2>No tasks yet.</h2>
                <p>Break the work down — add the first task.</p>
            </div>}

            {!error && !loading && tasks.length>0 && <div className="tkx-list">
                {tasks.map((task)=>(
                    <div className="tkx-card" key={task._id}>
                        <span className={`tkx-rail is-${task.status}`} aria-hidden="true"/>

                        <div className="tkx-card-head">
                          <div className="tkx-card-body">
                            <h3 className="tkx-name">{task.title}</h3>
                            <p className="tkx-desc">{task.description}</p>
                          </div>
                          <button className="tkx-del" onClick={()=>removeTask(task._id)} aria-label="Delete task"><Trash2 size={15}/></button>
                        </div>

                        <div className="tkx-meta">
                          <select className={`tkx-status is-${task.status}`} onChange={(e)=>handleStatusChange(task._id,e.target.value)} value={task.status}>
                              <option value="to-do">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="done">Done</option>
                          </select>
                          <span className={`tkx-prio is-${task.priority}`}>{task.priority}</span>
                          <span className="tkx-date"><CalendarClock size={13}/> {task.deadline ? taskDateFormatter.format(new Date(task.deadline)) : "—"}</span>
                        </div>

                        <div className="tkx-assignee">
                          <span className="tkx-avatar">{task.assignee?.name ? task.assignee.name.slice(0,2).toUpperCase() : "—"}</span>
                          <span className="tkx-who">
                            <b>{task.assignee?.name}</b>
                            <small>{task.assignee?.email}</small>
                          </span>
                        </div>

                        <details className="tkx-reassign">
                          <summary><UserPlus size={13}/> Reassign</summary>
                          <div className="tkx-reassign-row">
                              <input type="email" placeholder="Assignee's Email" onChange={e => setAssignInputs(prev => ({...prev,[task._id]:e.target.value}))} value={assignInputs[task._id] || ""}/>
                              <button onClick={()=>{handleAssign(task._id,assignInputs[task._id])}}>Assign</button>
                          </div>
                        </details>
                    </div>
                ))}
            </div>}

          </div>

          {taskForm && <div className="tkx-modal">
            <motion.div
              className="tkx-modal-card"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="tkx-modal-head">
                  <span>NEW TASK</span>
                  <button type="button" className="tkx-modal-x" onClick={()=>(setTaskForm(prev => !prev))}><X size={16}/></button>
                </div>
                <form onSubmit={handleTaskSubmit} className="tkx-form">
                    <label className="tkx-field">
                      <span>TITLE</span>
                      <input type="text" placeholder="e.g. Build login page" onChange={handleChange} name="title" value={taskData.title}/>
                    </label>
                    <label className="tkx-field">
                      <span>DESCRIPTION</span>
                      <input type="text" placeholder="one line about it" onChange={handleChange} name="description" value={taskData.description}/>
                    </label>
                    <label className="tkx-field">
                      <span>ASSIGNEE EMAIL</span>
                      <input type="email" placeholder="name@company.com" onChange={handleChange} name="email" value={taskData.email}/>
                    </label>
                    <div className="tkx-field-row">
                      <label className="tkx-field">
                        <span>STATUS</span>
                        <select onChange={handleChange} name="status" value={taskData.status} className="tkx-select">
                            <option value="to-do">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                      </label>
                      <label className="tkx-field">
                        <span>PRIORITY</span>
                        <select onChange={handleChange} name="priority" value={taskData.priority} className="tkx-select">
                            <option value="high">High</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="urgent">Urgent</option>
                        </select>
                      </label>
                    </div>
                    <label className="tkx-field">
                      <span>DEADLINE</span>
                      <input type="date" onChange={handleChange} name="deadline" value={taskData.deadline}/>
                    </label>
                    <button type="Submit" className="tkx-submit">CREATE TASK <ArrowUpRight size={16}/></button>
                </form>
            </motion.div>
          </div>}

        </div>
    )
}

export default Task
