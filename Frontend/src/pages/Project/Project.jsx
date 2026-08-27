import "./Project.css";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject, createProject, updateProject,deleteProject} from "../../api/projectApi";
import { motion } from "framer-motion";
import {
  Asterisk,
  Plus,
  X,
  ArrowUpRight,
  ListTodo,
  CalendarClock,
  Trash2,
} from "lucide-react";

const projectDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "active",
  });
  const params = useParams();

  useEffect(() => {
    const allProjects = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await getProject(params.teamId);
        setProjects(data.projects);
      } catch (error) {
        setError(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    allProjects();
  }, []);

  const handleProjectChange = (e) => {
    const { name, value } = e.target;

    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectForm = async (e) => {
    try {
      e.preventDefault();
      if (
        !projectFormData.title.trim() ||
        !projectFormData.description.trim() ||
        !projectFormData.deadline ||
        !projectFormData.status
      ) {
        return setError("Please Fill All the Fields");
      }

      const data = await createProject(
        params.teamId,
        projectFormData.title,
        projectFormData.description,
        projectFormData.status,
        projectFormData.deadline,
      );
      setProjects((prev) => [data.project, ...prev]);
      setProjectFormData({
        title: "",
        description: "",
        deadline: "",
        status: "active",
      });
      setShowProjectForm(false);
    } catch (error) {
      setError(error.response?.data?.message);
    }
  };

  const handleUpdate =async (projectId, newStatus) => {
    try {
      setError("");
      const data =await updateProject(projectId,{status:newStatus})
      setProjects(prev => prev.map(p=>p._id === projectId? data.project : p ))

    } catch (error) {
        setError(error.response?.data?.message)
    }
  };

  const handleDelete = async (projectId)=>{
    try{
        setError("")

        const data = await deleteProject(projectId)
        setProjects(prev => prev.filter(p=> p._id !==projectId))

    }
    catch(error){
        setError(error.response?.data?.message)
    }
  }

  return (
    <div className="prx-page">
      <div className="prx-frame">
        {/* mini rail */}
        <div className="prx-minirail">
          <span>
            DEVSYNC<sup>®</sup>
          </span>
          <span>PROJECTS INDEX</span>
          <span>[ {projects.length.toString().padStart(2, "0")} ]</span>
        </div>

        {/* hero */}
        <header className="prx-hero">
          <p className="prx-kicker">what this squad is shipping</p>
          <h1 className="prx-title">
            PROJECTS
            <i className="prx-star" aria-hidden="true">
              <Asterisk size={"100%"} strokeWidth={2.2} />
            </i>
          </h1>
          <div className="prx-heroline">
            <span className="prx-count">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </span>
            <button
              className="prx-new"
              onClick={() => {
                setShowProjectForm(true);
              }}
            >
              <Plus size={15} /> NEW PROJECT
            </button>
          </div>
        </header>

        {error && (
          <div className="prx-state prx-state-error">
            <span className="prx-state-tag">⚠ SIGNAL ERROR</span>
            <h2>{error}</h2>
          </div>
        )}

        {loading && (
          <div className="prx-state prx-state-loading">
            <span className="prx-state-tag">❯ SYNCING</span>
            <h2>Loading projects…</h2>
            <div className="prx-track" aria-hidden="true">
              <span />
            </div>
          </div>
        )}

        {!error && !loading && projects.length === 0 && (
          <div className="prx-state prx-state-empty">
            <span className="prx-state-tag">[ VOID ]</span>
            <h2>No projects yet.</h2>
            <p>Kick off the first project for this squad.</p>
          </div>
        )}

        {!error && !loading && projects.length > 0 && (
          <div className="prx-list">
            {projects.map((project, i) => (
              <div className="prx-row" key={project._id}>
                <Link to={`/organization/${params.id}/teams/${params.teamId}/projects/${project._id}`}>
                  <span className="prx-idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="prx-badge">
                  {project.title.slice(0, 2).toUpperCase()}
                </span>
                <span className="prx-body">
                  <span className="prx-name">{project.title}</span>
                  <span className="prx-desc">{project.description}</span>
                </span>
                <span className="prx-metas">
                  <select
                    className={`prx-statusselect is-${project.status}`}
                    value={project.status}
                    onChange={(e) =>
                      handleUpdate(project._id, e.target.value)
                    }
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span className="prx-meta">
                    <ListTodo size={13} /> {project.tasks.length}
                  </span>
                  <span className="prx-date">
                    <CalendarClock size={13} />{" "}
                    {project.deadline
                      ? projectDateFormatter.format(new Date(project.deadline))
                      : "—"}
                  </span>
                  <button
                    className="prx-delete"
                    onClick={() => handleDelete(project._id)}
                    aria-label="Delete project"
                  >
                    <Trash2 size={15} />
                  </button>
                </span>
                <span className="prx-go" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {showProjectForm && (
        <div className="prx-modal">
          <motion.div
            className="prx-modal-card"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="prx-modal-head">
              <span>NEW PROJECT</span>
              <button
                type="button"
                className="prx-modal-x"
                onClick={() => setShowProjectForm(false)}
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleProjectForm} className="prx-form">
              <label className="prx-field">
                <span>TITLE</span>
                <input
                  type="text"
                  placeholder="e.g. Payments Revamp"
                  name="title"
                  value={projectFormData.title}
                  onChange={handleProjectChange}
                />
              </label>
              <label className="prx-field">
                <span>DESCRIPTION</span>
                <input
                  type="text"
                  placeholder="one line about it"
                  name="description"
                  value={projectFormData.description}
                  onChange={handleProjectChange}
                />
              </label>
              <div className="prx-field-row">
                <label className="prx-field">
                  <span>DEADLINE</span>
                  <input
                    type="date"
                    name="deadline"
                    value={projectFormData.deadline}
                    onChange={handleProjectChange}
                  />
                </label>
                <label className="prx-field">
                  <span>STATUS</span>
                  <select
                    name="status"
                    value={projectFormData.status}
                    onChange={handleProjectChange}
                    className="prx-select"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>
              <button type="Submit" className="prx-submit">
                CREATE PROJECT <ArrowUpRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Project;
