import "./Organization.css"
import { listOrganizationInvites, cancelInvitation } from "../../api/invitationApi"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Asterisk, X } from "lucide-react"

const dateFmt = new Intl.DateTimeFormat("en-IN")

const lineReveal = {
    hidden: { y: "115%" },
    visible: (i) => ({
        y: "0%",
        transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 },
    }),
};

const OrganizationInvites = () => {
    const [orgInvites, setOrgInvites] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const param = useParams()

    useEffect(() => {
        const getOrganizationInvites = async () => {
            try {
                setError("");
                setLoading(true)

                const response = await listOrganizationInvites(param.id)
                setOrgInvites(response.invitations)
            }
            catch (error) {
                setError(error.response?.data?.message)
            }
            finally {
                setLoading(false)
            }
        }


        getOrganizationInvites()
    }, [])

    const cancelHandler = async (inviteId) => {
        try {
            setError("");
            await cancelInvitation(inviteId)

            setOrgInvites(prev => prev.filter(invite => invite._id !== inviteId))
        }
        catch (error) {
            setError(error.response?.data?.message)
        }
    }

    return (
        <div className="ovx-page">
            <div className="ovx-frame">

                {/* top rail */}
                <div className="ovx-rail">
                    <Link to={`/organization/${param.id}`} className="ovx-brand">DEVSYNC<sup>®</sup></Link>
                    <span className="ovx-rail-mid">OUTBOX — INVITES YOU SENT</span>
                </div>

                {/* headline */}
                <header className="ovx-head">
                    <motion.p
                        className="ovx-welcome"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                    >
                        summons awaiting a reply
                    </motion.p>
                    <h1 className="ovx-title" aria-label="Sent.">
                        <span className="ovx-mask">
                            <motion.span
                                className="ovx-line"
                                custom={0}
                                variants={lineReveal}
                                initial="hidden"
                                animate="visible"
                            >
                                THE <em>outbox</em>
                                <motion.i
                                    className="ovx-star"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                                >
                                    <Asterisk size={"100%"} strokeWidth={2.4} />
                                </motion.i>
                            </motion.span>
                        </span>
                    </h1>
                </header>

                {/* list head */}
                <div className="ovx-list-head">
                    <span>(SENT)</span>
                    <span>{orgInvites.length} PENDING</span>
                </div>

                {loading && <div className="ovx-loading">
                    <p>❯ loading dispatched invites…</p>
                    <div className="ovx-track" aria-hidden="true"><span /></div>
                </div>}

                {error && <div className="ovx-error">
                    <p>⚠ {error}</p>
                </div>}

                {!loading && !error && orgInvites.length === 0 && <div className="ovx-empty">
                    <p><em>No invites out there.</em> Nobody's been summoned to this workspace yet.</p>
                </div>}

                {!loading && !error && orgInvites.length > 0 && <div className="ovx-list">
                    {orgInvites.map((invite) => (
                        <div className="ovx-row" key={invite._id}>
                            <span className="ovx-index" aria-hidden="true" />
                            <div className="ovx-who">
                                <h2>{invite.receiver}</h2>
                                <p>sent {dateFmt.format(new Date(invite.createdAt))} · expires {dateFmt.format(new Date(invite.expiry))}</p>
                            </div>
                            <span className="ovx-status">{invite.status}</span>
                            <button className="ovx-cancel" onClick={() => { cancelHandler(invite._id) }}>
                                <X size={14} strokeWidth={2.6} /> CANCEL
                            </button>
                        </div>
                    ))}
                </div>}

                {/* bottom rail */}
                <div className="ovx-foot">
                    <span><i className="ovx-blip" /> OUTBOX LIVE</span>
                    <span>CANCEL TO REVOKE A PENDING INVITE</span>
                    <span>© 2026</span>
                </div>
            </div>
        </div>
    )
}

export default OrganizationInvites
