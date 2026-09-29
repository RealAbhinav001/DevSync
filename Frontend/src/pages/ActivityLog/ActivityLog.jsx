import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    getAllActivity,
    getTaskActivity,
    getTeamActivity,
    getProjectActivity
} from "../../api/activityApi"
import "./ActivityLog.css"

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
})

// each tab maps to the endpoint it fetches from
const FILTERS = [
    { key: "all", label: "ALL", fetcher: getAllActivity },
    { key: "task", label: "TASK", fetcher: getTaskActivity },
    { key: "team", label: "TEAM", fetcher: getTeamActivity },
    { key: "project", label: "PROJECT", fetcher: getProjectActivity }
]

const ActivityLog = () => {
    const params = useParams()
    const [filter, setFilter] = useState("all")
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const active = FILTERS.find((f) => f.key === filter)

        setLoading(true)
        setError("")

        active
            .fetcher(params.id)
            .then((data) => setActivities(data.activity ?? []))
            .catch((err) =>
                setError(err.response?.data?.message ?? "Failed to load activity")
            )
            .finally(() => setLoading(false))
    }, [params.id, filter])

    return (
        <div className="alx-page">
            <div className="alx-frame">
                <div className="alx-head">
                    <span>(LOG)</span>
                    <span>THE PULSE — ACTIVITY LOG</span>
                </div>

                <div className="alx-tabs">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            className={`alx-tab ${filter === f.key ? "alx-tab-active" : ""}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="alx-state">
                        <p>❯ pulling the pulse…</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="alx-state alx-state-error">
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && activities.length === 0 && (
                    <div className="alx-state">
                        <p>
                            <em>Silence, for now.</em> Every move your crew makes will echo
                            here.
                        </p>
                    </div>
                )}

                {!loading && !error && activities.length > 0 && (
                    <div className="alx-timeline">
                        {activities.map((activity) => (
                            <div key={activity._id} className="alx-item">
                                <strong>{activity.actor?.name ?? "Unknown user"}</strong>
                                <p>
                                    {activity.message ?? activity.action ?? "Something happened"}
                                </p>
                                <span>
                                    CTX — {activity.project?.title ?? activity.entityType}
                                </span>
                                <time dateTime={activity.createdAt}>
                                    {dateFormatter.format(new Date(activity.createdAt))}
                                </time>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityLog
