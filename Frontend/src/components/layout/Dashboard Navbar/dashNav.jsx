import "./dashNav.css";
import { ChevronDown, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";

const DashNav = ({ user }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const displayName = user || "Abhinav";
    const profileName = displayName.slice(0, 2).toUpperCase();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };

    return (
        <div className="dashrail">
            <div className="dashrail-brand">
                DEVSYNC<sup>®</sup>
            </div>

            <span className="dashrail-mid">
                OPERATOR DECK — LIVE
            </span>

            <div className="dashrail-profile-wrap">
                <button
                    type="button"
                    className="dashrail-profile"
                    onClick={() => setMenuOpen((previous) => !previous)}
                    aria-expanded={menuOpen}
                >
                    <span className="dashrail-ava">
                        {profileName}
                    </span>

                    <h4>{displayName}</h4>

                    <ChevronDown
                        className={`dashrail-chevron ${
                            menuOpen ? "dashrail-chevron-open" : ""
                        }`}
                        size={16}
                    />
                </button>

                {menuOpen && (
                    <div className="dashrail-menu">
                        <button
                            type="button"
                            className="dashrail-logout"
                            onClick={handleLogout}
                        >
                            <LogOut size={15} strokeWidth={2.2} />
                            <span>LOG OUT</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashNav;