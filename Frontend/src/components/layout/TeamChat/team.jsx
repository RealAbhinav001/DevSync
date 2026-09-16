import { useContext, useState, useEffect, useRef } from "react";
import { socketContext } from "../../../context/socketContext";
import { getMessages } from "../../../api/chatApi";
import { useParams } from "react-router-dom"
import {AuthContext} from "../../../context/authContext"
import "./team.css"

const Chat = ()=>{
    const socket = useContext(socketContext)
    const {user} = useContext(AuthContext)
    const [messages,setMessages] = useState([])
    const params = useParams()
    const [input,setInput] = useState("");
    const [error,setError] = useState("")
    const bottomRef = useRef(null)

    useEffect(()=>{
        const getMessage = async ()=>{
            if(!socket || !params.teamId)return

            socket.emit("join-team-chat",params.teamId)
            const data =await getMessages(params.teamId)
            setMessages(data.chats)
        }
        getMessage()

    },[socket,params.teamId])

    const handleSend = (e)=>{
        e.preventDefault()
        if(!socket)return
        if(input.trim() == ""){
            setError("Write Your Message first")
            return
        }

        socket.emit("send-team-message",params.teamId,input)

        setInput("")
    }

    useEffect(()=>{
        setError("")
        if(!socket)return

        socket.on("receive-team-message",(newMessage)=>{
            setMessages(prev => [...prev,newMessage])
        })

        socket.on("socket-error", (err) => setError(err.message))

        return ()=>{socket.off("receive-team-message"),
            socket.off("socket-error")
        }
    },[socket])

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    },[messages])

    return (
        <div className="chat-shell">
            <header className="chat-head">
                <div className="chat-head-left">
                    <span className="chat-orb" aria-hidden="true"></span>
                    <div className="chat-head-text">
                        <span className="chat-eyebrow">Team Channel</span>
                        <h2 className="chat-title">Live Chat</h2>
                    </div>
                </div>
                <span className="chat-live">
                    <span className="chat-live-dot" aria-hidden="true"></span>
                    Live
                </span>
            </header>

            <div className="chat-stream">
                {messages.map((message)=>(
                    <article className={`chat-msg ${message.sender._id === user?._id?"chat-msg-mine": ""}`} key={message._id}>
                        <div className="chat-msg-avatar" aria-hidden="true"></div>
                        <div className="chat-msg-body">
                            <div className="chat-msg-meta">
                                <span className="chat-msg-name">{message.sender.name}</span>
                                <span className="chat-msg-time">{new Date(message.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="chat-msg-text">{message.content}</p>
                        </div>
                    </article>
                ))}
                <div ref={bottomRef}></div>
            </div>

            <form className="chat-composer" onSubmit={handleSend}>
                <p className="chat-error">{error}</p>
                <div className="chat-composer-row">
                    <input className="chat-input" type="text" placeholder="Enter Your Message" value={input} onChange={(e)=>(setInput(e.target.value))}/>
                    <button className="chat-send" type="submit">
                        <span>Send</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M22 2 11 13" />
                            <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Chat