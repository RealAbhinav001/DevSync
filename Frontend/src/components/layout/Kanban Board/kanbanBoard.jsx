import { useState, useEffect } from "react";
import { taskStatus } from "../../../api/kanbanApi";
import { useParams } from "react-router-dom";
import { DndContext, useDraggable, useDroppable, DragOverlay } from "@dnd-kit/core";
import { updateStatus } from "../../../api/taskApi";
import { socketContext } from "../../../context/socketContext";
import { useContext } from "react";
import "./KanbanBoard.css";
import { deleteTask,assignUser } from "../../../api/taskApi";
import { Trash2, UserPlus } from "lucide-react";

const Column = ({ status, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <div className={`kbx-col ${isOver ? "kbx-col-over" : ""}`} ref={setNodeRef}>
            <div className="kbx-col-head">
                <span className="kbx-col-title">{status}</span>
                <span className="kbx-col-count">{tasks.length}</span>
            </div>
            <div className="kbx-col-body">
                {tasks.map((task) => (
                    <Card key={task._id} task={task} />
                ))}
            </div>
        </div>
    );
};

const Card = ({ task }) => {
    const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
        id: task._id
    });

    const handleDelete = async(taskId)=>{
        await deleteTask(taskId)
    }

    const [showAssign,setShowAssign] = useState(false)
    const [email,setEmail] = useState("")

    const handleAssignee =async(e,taskId)=>{
        e.preventDefault()
        await assignUser(taskId,email)
        setShowAssign(false)
        setEmail("")
    }

    return (
        <div
            className={`kbx-card ${isDragging ? "kbx-card-dragging" : ""}`}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                transform: transform
                    ? `translate(${transform.x}px, ${transform.y}px)`
                    : undefined
            }}
        >
            <button
                className="kbx-card-del"
                title="Delete task"
                aria-label="Delete task"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(task._id)}
            >
                <Trash2 size={13} strokeWidth={2.2} />
            </button>
            <p className="kbx-card-title">{task.title}</p>
            <div className="kbx-card-foot">
                <span className={`kbx-prio kbx-prio-${task.priority}`}>{task.priority}</span>
                <span className="kbx-card-who">{task.assignee?.name}</span>
            </div>
            <button className="kbx-assign-toggle" onClick={()=>setShowAssign(prev => !prev)} onPointerDown={(e)=>e.stopPropagation()}>
                <UserPlus size={12} strokeWidth={2.2} /> Reassign
            </button>
            {showAssign && <form className="kbx-assign" onSubmit={(e)=>handleAssignee(e,task._id)}>
                <input className="kbx-assign-input" type="email" placeholder="new assignee email" value={email} onChange={(e)=>setEmail(e.target.value)} onPointerDown={(e)=>e.stopPropagation()}/>
                <button className="kbx-assign-submit" type="submit" onPointerDown={(e)=>e.stopPropagation()}>Assign</button>
            </form>}
        </div>
    );
};

const Kanban = () => {
    const [board, setBoard] = useState({
        "to-do": [],
        "in-progress": [],
        review: [],
        done: []
    });
    const params = useParams();
    const socket = useContext(socketContext);
    const [activeTask,setActiveTask] = useState(null)

    useEffect(() => {
        const status = async () => {
            if (!socket) return;
            socket.emit("join-project-kanban", params.projectId);
            const data = await taskStatus(params.projectId);
            setBoard(data.board);
        };
        status();
    }, [socket, params.projectId]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over) return;
        const taskId = active.id;
        const newStatus = over.id;

        const data = await updateStatus(taskId, newStatus);
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("task-status-updated", (task) => {
            setBoard((prev) => {
                const cleaned = Object.fromEntries(
                    Object.entries(prev).map(([status, tasks]) => [
                        status,
                        tasks.filter((t) => t._id !== task._id)
                    ])
                );
                cleaned[task.status] = [...cleaned[task.status], task];
                return cleaned;
            });
        });

        socket.on("task-created",(task)=>{
            setBoard((prev)=>({
                ...prev,
                [task.status]:[...prev[task.status],task]
            }))
        })

        socket.on("task-deleted",(task)=>{
            setBoard((prev)=>{
                const cleaned = Object.fromEntries(
                    Object.entries(prev).map(([status,tasks])=>([status,tasks.filter(t => t._id !== task._id)]))
                )

                return cleaned
            })
        })

        socket.on("task-assigned",(task)=>{
            setBoard((prev)=>{
                return Object.fromEntries(
                    Object.entries(prev).map(([status,tasks])=>([status,tasks.map(t => t._id === task._id?task:t)]))
                )
            })
        })
        return () => {
            socket.off("task-status-updated"),
            socket.off("task-created")
            socket.off("task-deleted")
            socket.off("task-assigned")
        };
    }, [socket]);

    return (
        <div className="kbx-board">
            <DndContext onDragStart={(event)=> {
                const task = Object.values(board).flat().find(t => t._id === event.active.id)
                setActiveTask(task)
            }} onDragEnd={handleDragEnd}>
                {Object.entries(board).map(([status, tasks]) => (
                    <Column key={status} status={status} tasks={tasks} />
                ))}
                <DragOverlay>
                        {activeTask? <Card task={activeTask}/>:null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default Kanban;
