import "./member.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrganizationMembers } from "../../api/organizationApi"
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Asterisk, Search, UsersRound } from "lucide-react";

const joinedDate = new Intl.DateTimeFormat("en-IN")

const lineReveal = {
    hidden: { y: "115%" },
    visible: (i) => ({
        y: "0%",
        transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 },
    }),
};

const OrganizationMember = () => {
    const [members, setMembers] = useState([]);
    const params = useParams(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [page,setPage] = useState(1)
    const [pagination,setPagination] = useState(null)
    const [debounceSearch, setDebounceSearch] = useState("")
    const [isOwner,setIsOwner] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {setDebounceSearch(search) 
            setPage(1)}, 500)
        return () => clearTimeout(timer)

    }, [search])

    useEffect(() => {
        const fetchOrganizationMembers = async () => {
            try {
                const data = await getOrganizationMembers(params.id, { page: page, limit: 10, search: debounceSearch })
                setMembers(data.members)
                setPagination(data.pagination)
                setIsOwner(data.isOwner)
            }
            catch (error) {
                setError(error.response?.data?.message)
            }
            finally {
                setLoading(false)
            }
        }

        fetchOrganizationMembers();
    }, [params.id, debounceSearch,page])

    return (
        <div className="mbx-page">
            <div className="mbx-frame">

                {/* back rail */}
                <motion.div
                    className="mbx-backrail"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <Link to={`/organization/${params.id}`}>
                        <ArrowLeft size={15} /> COMMAND DECK
                    </Link>
                    <span>SECTION — MEMBERS</span>
                </motion.div>

                {/* giant headline */}
                <header className="mbx-head">
                    <motion.p
                        className="mbx-welcome"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                    >
                        the people behind the pulse
                    </motion.p>
                    {isOwner && <button className="mbx-invite">+ Invite</button>}
                    <h1 className="mbx-title" aria-label="The crew.">
                        <span className="mbx-mask">
                            <motion.span
                                className="mbx-line"
                                custom={0}
                                variants={lineReveal}
                                initial="hidden"
                                animate="visible"
                            >
                                THE <em>crew</em>
                                <motion.i
                                    className="mbx-star"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                                >
                                    <Asterisk size={"100%"} strokeWidth={2.4} />
                                </motion.i>
                            </motion.span>
                        </span>
                    </h1>
                </header>

                {/* editorial search */}
                <motion.div
                    className="mbx-scan"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="mbx-scan-label">(SCAN) — NAME OR EMAIL</span>
                    <div className="mbx-scan-shell">
                        <Search size={20} strokeWidth={2.2} />
                        <input
                            type="text"
                            placeholder="type to filter the crew…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </motion.div>

                {/* list head */}
                <div className="mbx-list-head">
                    <span>(INDEX)</span>
                    <span><UsersRound size={13} /> {members.length} ON THIS PAGE</span>
                </div>

                {loading && <div className="mbx-loading">
                    <p>❯ pulling the crew manifest…</p>
                    <div className="mbx-track" aria-hidden="true"><span /></div>
                </div>}

                {error && <div className="mbx-error">
                    <p>⚠ {error}</p>
                </div>}

                {!loading && !error && members.length === 0 && <div className="mbx-empty">
                    <p><em>Nobody matches that signal.</em> Adjust the scan or invite new crew.</p>
                </div>}

                {!loading && !error && members.length > 0 && <div className="mbx-list">
                    {members.map((member) => (
                        <div className="mbx-row" key={member._id}>
                            <span className="mbx-index" aria-hidden="true" />
                            <div className="mbx-mark">{member.name.slice(0, 2).toUpperCase()}</div>
                            <div className="mbx-who">
                                <h2>{member.name}</h2>
                                <p>{member.email}</p>
                            </div>
                            <div className="mbx-meta">
                                <span className={`mbx-role ${member.role === "owner" ? "own" : ""}`}>
                                    {member.role === "owner" ? "OWNER" : "MEMBER"}
                                </span>
                                <time>SINCE {joinedDate.format(new Date(member.createdAt))}</time>
                            </div>
                        </div>
                    ))}
                </div>}

                <div className="mbx-pager">
                    <button className="mbx-pager-btn" disabled={!pagination?.hasPreviousPage} onClick={()=>setPage(p =>p-1)}>
                        <ArrowLeft size={15} strokeWidth={2.4} /> PREV
                    </button>
                    <p className="mbx-pager-status">
                        PAGE <b>{page}</b> / {pagination?.totalPages ?? "—"}
                    </p>
                    <button className="mbx-pager-btn" disabled={!pagination?.hasNextPage} onClick={()=>setPage(p => p+1)}>
                        NEXT <ArrowRight size={15} strokeWidth={2.4} />
                    </button>
                </div>

                {/* bottom rail */}
                <div className="mbx-foot">
                    <span><i className="mbx-blip" /> ROSTER LIVE</span>
                    <span>SEARCH DEBOUNCED — 500MS</span>
                    <span>© 2026</span>
                </div>
            </div>
        </div>
    )
}

export default OrganizationMember
