import "./Team.css"
import { useState,useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { getTeam,createTeam } from "../../api/teamApi"
import { motion } from "framer-motion"
import { Asterisk, Plus, X, ArrowUpRight, Users, FolderGit2 } from "lucide-react"

const teamDateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" })

const Team = ()=>{

    const [teams,setTeams] = useState([])
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)
    const params = useParams()
    const [showTeamForm,setShowTeamForm] = useState(false)
    const [name,setName] = useState("")

    useEffect(()=>{
        const getTeams = async()=>{
            try{
                setError("")
            setLoading(true)

            const data = await getTeam(params.id)
            setTeams(data.team)
            }
            catch(error){
                setError(error.response?.data?.message)
            }
            finally{
                setLoading(false)
            }
        }
        getTeams()
    },[])

    const handleTeamForm = async(e)=>{
        e.preventDefault()
        try{
            setError("")
            if(!name.trim()){
                setError("You have TO submit Team Name")
                return
            }

            const data = await createTeam(params.id,name)

            setTeams(prev => [data.team,...prev])

            setName("")
            setShowTeamForm(false)
        }
        catch(error){
            setError(error.response?.data?.message)
        }
    }


    return(
        <div className="tmx-page">
          <div className="tmx-frame">

            {/* mini rail */}
            <div className="tmx-minirail">
              <span>DEVSYNC<sup>®</sup></span>
              <span>TEAMS INDEX</span>
              <span>[ {teams.length.toString().padStart(2,"0")} ]</span>
            </div>

            {/* hero */}
            <header className="tmx-hero">
              <p className="tmx-kicker">the roster of squads</p>
              <h1 className="tmx-title">
                TEAMS
                <i className="tmx-star" aria-hidden="true"><Asterisk size={"100%"} strokeWidth={2.2}/></i>
              </h1>
              <div className="tmx-heroline">
                <span className="tmx-count">{teams.length} active {teams.length === 1 ? "squad" : "squads"}</span>
                <button className="tmx-new" onClick={()=>(setShowTeamForm(prev => !prev))}>
                  {showTeamForm ? <><X size={15}/> CLOSE</> : <><Plus size={15}/> NEW TEAM</>}
                </button>
              </div>
            </header>

            {error && <div className="tmx-state tmx-state-error">
                <span className="tmx-state-tag">⚠ SIGNAL ERROR</span>
                <h2>{error}</h2>
            </div>}

            {loading && <div className="tmx-state tmx-state-loading">
                <span className="tmx-state-tag">❯ SYNCING</span>
                <h2>Loading the roster…</h2>
                <div className="tmx-track" aria-hidden="true"><span/></div>
            </div>}

            {!error && !loading && teams.length ===0 && <div className="tmx-state tmx-state-empty">
                <span className="tmx-state-tag">[ VOID ]</span>
                <h2>No squads yet.</h2>
                <p>Spin up the first team to start splitting the work.</p>
            </div>}

            {!error && !loading && teams.length >0 && <div className="tmx-list">
                {teams.map((team,i)=>(
                    <Link to={`/organization/${params.id}/teams/${team._id}`} key={team._id} className="tmx-row">
                        <span className="tmx-idx">{String(i+1).padStart(2,"0")}</span>
                        <span className="tmx-badge">{team.name.slice(0,2).toUpperCase()}</span>
                        <span className="tmx-name">{team.name}</span>
                        <span className="tmx-metas">
                          <span className="tmx-meta"><Users size={13}/> {team.members.length}</span>
                          <span className="tmx-meta"><FolderGit2 size={13}/> {team.projects.length}</span>
                          <span className="tmx-date">{team.createdAt ? teamDateFormatter.format(new Date(team.createdAt)) : "—"}</span>
                        </span>
                        <span className="tmx-go" aria-hidden="true"><ArrowUpRight size={18}/></span>
                    </Link>
                ))}
            </div>}

          </div>

          {showTeamForm && <div className="tmx-modal">
            <motion.div
              className="tmx-modal-card"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="tmx-modal-head">
                  <span>NEW TEAM</span>
                  <button type="button" className="tmx-modal-x" onClick={()=>(setShowTeamForm(prev => !prev))}><X size={16}/></button>
                </div>
                <form onSubmit={handleTeamForm} className="tmx-form">
                    <label className="tmx-field">
                      <span>TEAM NAME</span>
                      <input type="text" placeholder="e.g. Core Platform" value={name} onChange={(e)=>(setName(e.target.value))}/>
                    </label>
                    <button type="Submit" className="tmx-submit">CREATE TEAM <ArrowUpRight size={16}/></button>
                </form>
            </motion.div>
          </div>}
        </div>

    )
}


export default Team
