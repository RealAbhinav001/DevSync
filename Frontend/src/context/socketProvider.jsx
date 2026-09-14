import { socketContext } from "./socketContext";
import { io } from "socket.io-client"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";

export const SocketProvider = ({children})=>{
    const {accessToken} = useContext(AuthContext)
    const [socket,setSocket] = useState(null)

    useEffect(()=>{
        if(!accessToken) return
        const socket = io(import.meta.env.VITE_SOCKET_URL,{auth:{token:accessToken}})
        setSocket(socket)
        return ()=> socket.disconnect()
    },[accessToken]) 

    return (
        <socketContext.Provider value={socket}>
            {children}
        </socketContext.Provider>
    )
}