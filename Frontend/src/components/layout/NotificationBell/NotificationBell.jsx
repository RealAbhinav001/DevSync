import "./notificationBell.css"
import { Bell } from "lucide-react"
import { useContext, useState } from "react"
import { notificationContext } from "../../../context/notificationContext"
import { readNotification } from "../../../api/notificationApi"

const NotificationBell = () => {
    const { notifications, setNotifications } = useContext(notificationContext)
    const [open, setOpen] = useState(false)
    const unreadCount = notifications.filter((n) => !n.read).length

    const handleNotifications = async (nId) => {
        await readNotification(nId)
        setNotifications((prev) => prev.map((n) => (n._id === nId ? { ...n, read: true } : n)))
    }

    return (
        <div className="nbell">
            <button
                className="nbell-btn"
                onClick={() => setOpen((prev) => !prev)}
                aria-label="Notifications"
            >
                <Bell size={17} strokeWidth={1.75} />
                {unreadCount > 0 && <span className="nbell-badge">{unreadCount}</span>}
            </button>

            {open && (
                <div className="nbell-panel">
                    <div className="nbell-head">
                        <span className="nbell-title">NOTIFICATIONS</span>
                        {unreadCount > 0 && <span className="nbell-count">{unreadCount} NEW</span>}
                    </div>

                    {notifications.length > 0 && (
                        <ul className="nbell-list">
                            {notifications.map((n) => (
                                <li
                                    className={`nbell-item ${!n.read ? "nbell-unread" : ""}`}
                                    key={n._id}
                                >
                                    <span className="nbell-dot" />
                                    <div className="nbell-body">
                                        <p className="nbell-msg">{n.message}</p>
                                        <span className="nbell-time">
                                            {new Date(n.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className="nbell-read"
                                        onClick={() => handleNotifications(n._id)}
                                    >
                                        Mark read
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {notifications.length === 0 && (
                        <div className="nbell-empty">
                            <Bell size={26} strokeWidth={1.5} />
                            <p>No notifications yet</p>
                            <span>You're all caught up.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotificationBell
