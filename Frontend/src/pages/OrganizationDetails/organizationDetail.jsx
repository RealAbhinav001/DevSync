import "./organizationDetail.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import NotificationBell from "../../components/layout/NotificationBell/NotificationBell"
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Asterisk,
  Bell,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react";
import { AuthContext } from "../../context/authContext";
import { useNavigate,Link } from "react-router-dom";
import { getDashboardOverview } from "../../api/dashboardApi";
import { X } from "lucide-react"
import {createInvitation} from "../../api/invitationApi"


const activityDateFormatter = new Intl.DateTimeFormat("en-IN");
const projectDateFormatter = new Intl.DateTimeFormat("en-IN");

const lineReveal = {
  hidden: { y: "115%" },
  visible: (i) => ({
    y: "0%",
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.12 },
  }),
};

const OrganizationDetail = () => {
  const params = useParams();
  const [overview, setOverview] = useState(null);
  const [retry, setRetry] = useState(0)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [showInviteForm,setShowInviteForm] = useState(false)
  const [email,setEmail] = useState("")
  const [inviteError,setInviteError] = useState("")
  const navigate = useNavigate();

  const headbacktoOrganization = () => {
    navigate("/organization");
  };


  const handleRetry = () => {
    setError("")
    setLoading(true)
    setRetry((previous) => (previous + 1))
  }

  const handleFormSubmit =async (e)=>{
    e.preventDefault()
    setInviteError("")
    try{
      if(!email.trim()){
        setInviteError("Enter the Valid Email")
        return
      }
      await createInvitation(params.id,email)
      setEmail("")
      setShowInviteForm(false)
    }
    catch(error){
      setInviteError(error.response?.data?.message)
    }
  }

  useEffect(() => {
    let ignore = false;
    getDashboardOverview(params.id).then((data) => {
      if (ignore) {
        return
      }
      setOverview(data)
      setError("")
    }).catch((error) => {
      if (ignore) {
        return
      }
      setError(error.response?.data?.message || "Organization Not Found")
    }).finally(() => {
      if (!ignore) {
        setLoading(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [params.id, retry]);

  if (loading) {
    return (
      <div className="dtx-page dtx-statepage">
        <div className="dtx-frame">
          <div className="dtx-minirail">
            <span>DEVSYNC<sup>®</sup></span>
            <span>OPENING UNIVERSE</span>
            <span>[ HOLD ]</span>
          </div>
          <div className="dtx-state-center">
            <h1 className="dtx-state-title">
              SYNCING
              <br />
              <em>the deck</em>
              <i className="dtx-state-star" aria-hidden="true">
                <Asterisk size={"100%"} strokeWidth={2.4} />
              </i>
            </h1>
            <div className="dtx-track" aria-hidden="true">
              <span />
            </div>
            <p className="dtx-state-sub">
              ❯ pulling members, structure and the pulse…
            </p>
          </div>
          <div className="dtx-minirail dtx-minirail-foot">
            <span><i className="dtx-blip" /> LINK ACTIVE</span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dtx-page dtx-statepage">
        <div className="dtx-frame">
          <div className="dtx-minirail">
            <span>DEVSYNC<sup>®</sup></span>
            <span>SIGNAL ERROR</span>
            <span>[ 404 ]</span>
          </div>
          <div className="dtx-state-center">
            <h1 className="dtx-state-title">
              LOST
              <br />
              <em>signal.</em>
            </h1>
            <p className="dtx-state-error">⚠ {error}</p>
            <div className="dtx-state-actions">
              <button type="button" onClick={headbacktoOrganization}>
                <ArrowLeft size={16} /> ALL UNIVERSES
              </button>
              <button
                type="button"
                className="dtx-retry"
                onClick={handleRetry}
              >
                <RefreshCw size={16} /> RETRY LINK
              </button>
            </div>
          </div>
          <div className="dtx-minirail dtx-minirail-foot">
            <span><i className="dtx-blip" /> CONSOLE LIVE</span>
            <span>© 2026</span>
          </div>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="dtx-page dtx-statepage">
        <div className="dtx-frame">
          <div className="dtx-minirail">
            <span>DEVSYNC<sup>®</sup></span>
            <span>EMPTY RESPONSE</span>
            <span>[ VOID ]</span>
          </div>
          <div className="dtx-state-center">
            <h1 className="dtx-state-title">
              THE
              <br />
              <em>void.</em>
            </h1>
            <p className="dtx-state-sub">
              ❯ the universe responded with nothing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const organization = overview.organization;
  const stats = overview.stats;
  const previews = overview.previews;
  const activityPreview = previews.activities ?? [];
  const teamPreview = previews.teams ?? [];
  const projectPreview = previews.projects ?? [];

  const displayName = organization.name ?? "DevSync Workspace";
  const organizationInitials = displayName.slice(0, 2).toUpperCase();
  const memberCount = organization.memberCount ?? 0;
  const teamCount = stats.totalTeams ?? 0;
  const ownerName = organization.owner?.name ?? "Workspace owner";
  const isOwner =
    organization?.owner?._id?.toString() === user?._id?.toString();
  const taskStats = stats.taskStats;

  const openTaskCount = Math.max(0, taskStats.total - taskStats.done);
  const completionPercentage =
    taskStats.total === 0
      ? 0
      : Math.round((taskStats.done / taskStats.total) * 100);

  return (
    <div className="dtx-page">
      <div className="dtx-frame">
        {/* back rail */}
        <motion.div
          className="dtx-backrail"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <button type="button" onClick={headbacktoOrganization}>
            <ArrowLeft size={15} /> ALL UNIVERSES
          </button>
          <span>ID — {organization.id}</span>
        </motion.div>

        {/* ── hero ── */}
        <header className="dtx-hero">
          <motion.p
            className="dtx-welcome"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            welcome back to
          </motion.p>

          <h1 className="dtx-title" aria-label={displayName}>
            <span className="dtx-mask">
              <motion.span
                className="dtx-line"
                custom={0}
                variants={lineReveal}
                initial="hidden"
                animate="visible"
              >
                {displayName}
                <motion.i
                  className="dtx-star"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                >
                  <Asterisk size={"100%"} strokeWidth={2.4} />
                </motion.i>
              </motion.span>
            </span>
          </h1>

          <motion.div
            className="dtx-hero-rail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.75 }}
          >
            <div className="dtx-hero-meta">
              <span className="dtx-live"><i className="dtx-blip" /> UNIVERSE ONLINE</span>
              <span className="dtx-mark-mini">{organizationInitials}</span>
              <span>OWNED BY {ownerName}</span>
              <span className={`dtx-role ${isOwner ? "own" : ""}`}>
                {isOwner ? "OWNER" : "MEMBER"}
              </span>
            </div>
            <div className="dtx-hero-actions">
              <NotificationBell/>
              {isOwner && (
                <button type="button" className="dtx-bell" aria-label="Settings">
                  <Settings size={17} />
                </button>
              )}
              <Link to={`/organization/${params.id}/teams`} className="dtx-create">
                <Plus size={16} strokeWidth={2.4} /> NEW TEAM
              </Link>
            </div>
          </motion.div>

          <motion.p
            className="dtx-desc"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.75 }}
          >
            "{organization.description ||
              "A focused workspace for your teams, projects, and product delivery."}"
          </motion.p>
        </header>

        {/* ── section tabs ── */}
        <motion.nav
          className="dtx-tabs"
          aria-label="Organization workspace"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <button type="button" className="active">
            <sup>01</sup> OVERVIEW
          </button>
          <Link to={`/organization/${params.id}/teams`}><sup>02</sup> TEAMS <b>{teamCount}</b></Link>
          <Link to={`/organization/${params.id}/members`}><sup>03</sup> MEMBERS <b>{memberCount}</b></Link>
          {isOwner && <Link to={`/organization/${params.id}/invites`} className="dtx-tab-invites">
            <sup>04</sup> SENT INVITES <ArrowUpRight size={13} strokeWidth={2.4} />
          </Link>}
        </motion.nav>

        {/* ── stat numbers ── */}
        <motion.section
          className="dtx-numbers"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.65 } },
          }}
        >
          <motion.article variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Link to={`/organization/${params.id}/members`}><strong>{memberCount}</strong>
            <span>CREW MEMBERS</span></Link>
          </motion.article>
          <motion.article variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <strong>{teamCount}</strong>
            <span>TEAMS</span>
          </motion.article>
          <motion.article variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <strong>{stats.totalProjects}</strong>
            <span>PROJECTS</span>
          </motion.article>
          <motion.article variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <strong>{openTaskCount}</strong>
            <span>OPEN TASKS</span>
          </motion.article>
        </motion.section>

        {/* ── (01) delivery pulse ── */}
        <motion.section
          className="dtx-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="dtx-block-head">
            <span>(01)</span>
            <span>DELIVERY PULSE</span>
          </div>

          <div className="dtx-pulse">
            <div
              className="dtx-completion"
              style={{ "--completion": `${completionPercentage}%` }}
            >
              <strong>{completionPercentage}<i>%</i></strong>
              <span>SHIPPED</span>
              <div className="dtx-completion-bar" aria-hidden="true">
                <span />
              </div>
            </div>

            <div className="dtx-pulse-side">
              {projectPreview.length === 0 && (
                <p className="dtx-pulse-note">
                  <em>No project data yet.</em> Velocity and deadlines will pulse here.
                </p>
              )}
              {projectPreview.length > 0 && (
                <p className="dtx-pulse-note">
                  <em>{projectPreview.length} recent projects</em> in motion — deadlines tracked below.
                </p>
              )}

              {projectPreview.length > 0 && (
                <div className="dtx-projects">
                  {projectPreview.map((project) => (
                    <div className="dtx-project-row" key={project._id}>
                      <strong>{project.title}</strong>
                      <span>{project.status}</span>
                      <time dateTime={project.deadline}>
                        DUE {projectDateFormatter.format(new Date(project.deadline))}
                      </time>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dtx-breakdown">
            <div>
              <span>TODO</span>
              <strong>{taskStats.todo}</strong>
            </div>
            <div>
              <span>IN PROGRESS</span>
              <strong>{taskStats.inProgress}</strong>
            </div>
            <div>
              <span>REVIEW</span>
              <strong>{taskStats.review}</strong>
            </div>
            <div className="hot">
              <span>DONE</span>
              <strong>{taskStats.done}</strong>
            </div>
          </div>
        </motion.section>

        {/* ── (02) activity ── */}
        <motion.section
          className="dtx-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="dtx-block-head">
            <span>(02)</span>
            <span>THE PULSE — RECENT ACTIVITY</span>
          </div>

          {activityPreview.length === 0 && (
            <div className="dtx-empty">
              <p>
                <em>Silence, for now.</em> Every move your crew makes will echo here.
              </p>
            </div>
          )}
          {activityPreview.length > 0 && (
            <div className="dtx-timeline">
              {activityPreview.map((activity) => (
                <div key={activity._id} className="dtx-tl-item">
                  <strong>{activity.actor?.name ?? "Unknown user"}</strong>
                  <p>
                    {activity.message ??
                      activity.action ??
                      "Something happened"}
                  </p>
                  <span>
                    CTX — {activity.project?.title ?? activity.entityType}
                  </span>
                  <time dateTime={activity.createdAt}>
                    {activityDateFormatter.format(new Date(activity.createdAt))}
                  </time>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── (03) teams ── */}
        <motion.section
          className="dtx-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="dtx-block-head">
            <span>(03)</span>
            <span>YOUR TEAMS</span>
          </div>

          {teamPreview.length === 0 && (
            <div className="dtx-empty dtx-empty-team">
              <p>
                <em>No squads yet.</em> Group your crew around shared delivery goals.
              </p>
              <button type="button" className="dtx-create">
                <Plus size={16} strokeWidth={2.4} /> FIRST TEAM
              </button>
            </div>
          )}
          {teamPreview.length > 0 && (
            <div className="dtx-teams">
              {teamPreview.map((team) => (
                <Link to={`/organization/${params.id}/teams/${team._id}`} key={team._id}>
                  <div  className="dtx-team-row">
                  <strong>{team.name}</strong>
                  <span>{team.members?.length ?? 0} CREW</span>
                  <i><ArrowUpRight size={22} strokeWidth={2.2} /></i>
                </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* ── (04) quick actions ── */}
        <motion.section
          className="dtx-block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="dtx-block-head">
            <span>(04)</span>
            <span>JUMP BACK IN</span>
          </div>

          <div className="dtx-actions">
            {isOwner && (
              <button type="button" className="dtx-action-row" onClick={()=>(setShowInviteForm(prev => !prev))}>
                <span className="dtx-action-num">A</span>
                <div>
                  <strong>INVITE MEMBER</strong>
                  <small>grow your universe</small>
                </div>
                <i><ArrowUpRight size={24} strokeWidth={2.2} /></i>
              </button>
            )}
            <Link to={`/organization/${params.id}/teams`} className="dtx-action-row">
              <span className="dtx-action-num">B</span>
              <div>
                <strong>BROWSE TEAMS</strong>
                <small>projects & tasks live inside teams</small>
              </div>
              <i><ArrowUpRight size={24} strokeWidth={2.2} /></i>
            </Link>
            <Link to={`/organization/${params.id}/members`} className="dtx-action-row">
              <span className="dtx-action-num">C</span>
              <div>
                <strong>VIEW MEMBERS</strong>
                <small>see everyone in the crew</small>
              </div>
              <i><ArrowUpRight size={24} strokeWidth={2.2} /></i>
            </Link>
          </div>
        </motion.section>

        {/* bottom rail */}
        <div className="dtx-foot">
          <span><i className="dtx-blip" /> DECK LIVE</span>
          <span>ACCESS VERIFIED — MEMBER SHIELDED</span>
          <span>© 2026</span>
        </div>

        {showInviteForm && <div className="dtx-invite-overlay">
          <div className="dtx-invite-modal">
            <button type="button" className="dtx-invite-x" onClick={()=>(setShowInviteForm(false))}>
              <X size={17} strokeWidth={2.4} />
            </button>
            <span className="dtx-invite-kicker">// SUMMON CREW</span>
            <h2 className="dtx-invite-title">Invite a <em>member.</em></h2>
            <p className="dtx-invite-sub">A secure, time-boxed invite lands in their inbox — they accept, and the crew grows.</p>
            <form onSubmit={handleFormSubmit} className="dtx-invite-form">
              <label className="dtx-invite-label">(01) — EMAIL_ID</label>
              <input type="email" placeholder="you@crew.dev" onChange={(e)=>setEmail(e.target.value)} value={email}/>
              {inviteError && <p className="dtx-invite-error">⚠ {inviteError}</p>}
              <button type="submit" className="dtx-invite-send">
                <span>SEND INVITE</span>
                <ArrowUpRight size={18} strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default OrganizationDetail;
