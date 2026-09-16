import "./TeamDetail.css";
import { useParams,Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTeamMember, addMember,removeMember,changeRole } from "../../api/teamApi";
import { motion } from "framer-motion";
import { Asterisk, Plus, X, Trash2, ArrowUpRight } from "lucide-react";
import Chat from "../../components/layout/TeamChat/team";

const TeamDetail = () => {
  const param = useParams();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const getTeamMembers = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await getTeamMember(param.teamId);
        setMembers(data.members);
      } catch (error) {
        setError(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getTeamMembers();
  }, []);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (!email.trim()) {
        setError("Write Email of Member You Want To Add");
        return;
      }

      const data = await addMember(param.teamId, email, role);
      setMembers(data.members);
      setEmail("");
      setRole("");
      setShowAddForm(false);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  const handleRemove = async (userId)=>{
    try{
        setError("")

        const remove = await removeMember(param.teamId,userId)

        setMembers(prev => prev.filter((m)=>(m.user._id !==userId)))
    }
    catch(error){
        setError(error.response?.data?.message)
    }
  }

  const handleRoleChange = async(userId,newRole)=>{
    try{
        setError("")

        const data = await changeRole(param.teamId,userId,newRole)
        setMembers(data.members)

    }
    catch(error){
        setError(error.response?.data?.message)
    }
  }

  return (
    <div className="tdx-page">
      <div className="tdx-frame">

        {/* mini rail */}
        <div className="tdx-minirail">
          <span>DEVSYNC<sup>®</sup></span>
          <span>TEAM ROSTER</span>
          <span>[ {members.length.toString().padStart(2,"0")} ]</span>
        </div>

        {/* hero */}
        <header className="tdx-hero">
          <p className="tdx-kicker">who moves this squad</p>
          <h1 className="tdx-title">
            ROSTER
            <i className="tdx-star" aria-hidden="true"><Asterisk size={"100%"} strokeWidth={2.2}/></i>
          </h1>
          <div className="tdx-heroline">
            <span className="tdx-count">{members.length} {members.length === 1 ? "member" : "members"}</span>
            <button className="tdx-new" onClick={() => setShowAddForm((prev) => !prev)}>
              {showAddForm ? <><X size={15}/> CLOSE</> : <><Plus size={15}/> ADD MEMBER</>}
            </button>
            <Link to={`/organization/${param.id}/teams/${param.teamId}/projects`} className="tdx-projectslink">PROJECTS <ArrowUpRight size={15}/></Link>
          </div>
        </header>

        {error && (
          <div className="tdx-state tdx-state-error">
            <span className="tdx-state-tag">⚠ SIGNAL ERROR</span>
            <h2>{error}</h2>
          </div>
        )}
        {loading && (
          <div className="tdx-state tdx-state-loading">
            <span className="tdx-state-tag">❯ SYNCING</span>
            <h2>Loading the roster…</h2>
            <div className="tdx-track" aria-hidden="true"><span/></div>
          </div>
        )}

        {!error && !loading && members.length === 0 && (
          <div className="tdx-state tdx-state-empty">
            <span className="tdx-state-tag">[ VOID ]</span>
            <h2>No members yet.</h2>
            <p>Add teammates by email to build out this squad.</p>
          </div>
        )}

        {!error && !loading && members.length > 0 && (
          <div className="tdx-list">
            {members.map((member) => (
              <div className="tdx-row" key={member._id}>
                <span className="tdx-avatar">{member.user.name.slice(0,2).toUpperCase()}</span>
                <span className="tdx-who">
                  <span className="tdx-name">{member.user.name}</span>
                  <span className="tdx-email">{member.user.email}</span>
                </span>
                <span className={`tdx-rolebadge ${member.role === "admin" ? "is-admin" : ""}`}>{member.role}</span>
                <select className="tdx-roleselect" value={member.role} onChange={(e)=>(handleRoleChange(member.user._id,e.target.value))}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="tdx-remove" onClick={()=>{handleRemove(member.user._id)}}><Trash2 size={15}/> <span>Remove</span></button>
              </div>
            ))}
          </div>
        )}

        {/* team chat */}
        <section className="tdx-chatsection">
          <div className="tdx-chatlabel">
            <span className="tdx-chatlabel-tag">❯ CHANNEL</span>
            <span className="tdx-chatlabel-line" aria-hidden="true"></span>
          </div>
          <Chat />
        </section>

      </div>

      {showAddForm && (
        <div className="tdx-modal">
          <motion.div
            className="tdx-modal-card"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="tdx-modal-head">
              <span>ADD MEMBER</span>
              <button type="button" className="tdx-modal-x" onClick={() => setShowAddForm((prev) => !prev)}><X size={16}/></button>
            </div>
            <form onSubmit={handleAddMember} className="tdx-form">
              <label className="tdx-field">
                <span>MEMBER EMAIL</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="tdx-field">
                <span>ROLE</span>
                <select className="tdx-formselect" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <button type="submit" className="tdx-submit">ADD MEMBER <ArrowUpRight size={16}/></button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeamDetail;
