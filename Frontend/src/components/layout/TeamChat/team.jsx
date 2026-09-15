import { useContext,useState,useEffect } from "react";
import { socketContext } from "../../../context/socketContext";
import { getMessages } from "../../../api/chatApi";
import { useParams } from "react-router-dom"

const Chat = ()=>{
    const socket = useContext(socketContext)
    const [messages,setMessages] = useState([])
    const params = useParams()

    useEffect(()=>{
        const getMessage = async ()=>{
            if(!socket || !params.teamId)return

            socket.emit("join-team-chat",params.teamId)
            const data =await getMessages(params.teamId)
            setMessages(data.chats)
        }
        getMessage()

    },[socket,params.teamId])

    return (
        <div className="main-container">
            {messages.map((message)=>(
                <div className="message-container" key={message._id}>
                    <p>{message.sender.name}</p>
                    <p>{message.content}</p>
                    <p>{new Date(message.createdAt).toLocaleTimeString()}</p>
                </div>
            ))}
        </div>
    )
}

export default Chat