import { notificationContext } from "./notificationContext";
import { useState,useEffect } from "react";
import {getNotifications} from "../api/notificationApi.js"
import { useParams} from "react-router-dom";
import { useContext } from "react";
import { socketContext } from "./socketContext.jsx";

export const NotificationProvider = ({children})=>{
    const [notifications,setNotifications] = useState([])
    const socket = useContext(socketContext)
    const params = useParams()

    useEffect(()=>{
        if(!params.id) return
        const userNotification =async (orgId)=>{
            const data = await getNotifications(orgId)
            setNotifications(data.notifications)
        }

        userNotification(params.id)
    },[params.id])

    useEffect(()=>{
        if(!socket) return
        socket.on("receive-notification", (newNotification)=>{
            setNotifications(prev => [newNotification,...prev])
        })

        return ()=>socket.off("receive-notification")
    },[socket])

    return (
        <notificationContext.Provider value={{notifications,setNotifications}}>
            {children}
        </notificationContext.Provider>
    )
}