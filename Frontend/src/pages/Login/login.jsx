import "./login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Asterisk, Eye, EyeOff } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { motion } from "framer-motion";

const lineReveal = {
    hidden: { y: "115%" },
    visible: (i) => ({
        y: "0%",
        transition: {
            duration: 0.95,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2 + i * 0.13,
        },
    }),
};

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin, createProfile, loading } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousValue) => ({
            ...previousValue,
            [name]: value,
        }));
    };

    const togglePass = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            await googleLogin();
        } catch (error) {
            console.error("GOOGLE LOGIN ERROR:", error);
            setError("Google login failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (!formData.email.trim() || !formData.password) {
                setError("Please Fill All Field");
                return;
            }
            await login({
                email: formData.email,
                password: formData.password,
            });

            await createProfile({
                name: formData.email.split("@")[0],
                email: formData.email,
            });

            navigate("/organization");
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            console.error("LOGIN ERROR MESSAGE:", error?.message);
            console.error("LOGIN ERROR NAME:", error?.name);

            setError("Login Unsuccessful");
        }
    };

    return (
        <div className="lgx-page">
            <div className="lgx-frame">
                {/* top rail */}
                <motion.div
                    className="lgx-rail"
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Link to="/" className="lgx-brand">
                        DEVSYNC<sup>®</sup>
                    </Link>
                    <span className="lgx-rail-mid">ACCESS CONSOLE — MEMBERS ONLY</span>
                    <Link to="/register" className="lgx-rail-link">
                        NEED ACCESS? [ REGISTER ]
                    </Link>
                </motion.div>

                {/* giant headline */}
                <h1 className="lgx-title" aria-label="Welcome back, builder.">
                    <span className="lgx-mask">
                        <motion.span
                            className="lgx-line"
                            custom={0}
                            variants={lineReveal}
                            initial="hidden"
                            animate="visible"
                        >
                            WELCOME
                        </motion.span>
                    </span>
                    <span className="lgx-mask">
                        <motion.span
                            className="lgx-line"
                            custom={1}
                            variants={lineReveal}
                            initial="hidden"
                            animate="visible"
                        >
                            BACK
                            <motion.i
                                className="lgx-star"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                            >
                                <Asterisk size={"100%"} strokeWidth={2.4} />
                            </motion.i>
                            <em>builder.</em>
                        </motion.span>
                    </span>
                </h1>

                {/* body: side copy + form */}
                <div className="lgx-body">
                    <motion.aside
                        className="lgx-side"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="lgx-side-quote">
                            "Your workspaces kept
                            <br />
                            the lights on."
                        </p>
                        <div className="lgx-side-stream">
                            <p style={{ animationDelay: "1s" }}>
                                ❯ session request received…
                            </p>
                            <p style={{ animationDelay: "1.7s" }} className="ok">
                                ✓ Cognito session armed
                            </p>
                            <p style={{ animationDelay: "2.4s" }} className="ok">
                                ✓ routes shielded
                            </p>
                            <p style={{ animationDelay: "3.1s" }}>
                                ❯ awaiting your key <span className="lgx-caret" />
                            </p>
                        </div>
                    </motion.aside>

                    <motion.form
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 34 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.45,
                            duration: 0.85,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <label className="lgx-field">
                            <span className="lgx-label">(01) — EMAIL_ID</span>
                            <input
                                type="email"
                                onChange={handleChange}
                                placeholder="you@crew.dev"
                                name="email"
                                value={formData.email}
                            />
                        </label>

                        <label className="lgx-field">
                            <span className="lgx-label">(02) — PASSKEY</span>
                            <div className="lgx-passwrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    onChange={handleChange}
                                    placeholder="••••••••••"
                                    name="password"
                                    value={formData.password}
                                />
                                {showPassword ? (
                                    <Eye className="lgx-eye" onClick={togglePass} />
                                ) : (
                                    <EyeOff className="lgx-eye" onClick={togglePass} />
                                )}
                            </div>
                        </label>

                        {error && <p className="lgx-error">⚠ {error}</p>}

                        <button className="lgx-submit" disabled={loading} type="submit">
                            <span>{loading ? "AUTHENTICATING…" : "AUTHENTICATE"}</span>
                            <ArrowUpRight size={22} strokeWidth={2.2} />
                        </button>

                        <button
                            className="lgx-google"
                            disabled={loading}
                            type="button"
                            onClick={handleGoogleLogin}
                        >
                            <span>CONTINUE WITH GOOGLE</span>
                        </button>

                        <p className="lgx-swap">
                            NO ACCOUNT? <Link to="/register">FORGE ONE ↗</Link>
                        </p>
                    </motion.form>
                </div>

                {/* bottom rail */}
                <motion.div
                    className="lgx-foot"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <span>
                        <i className="lgx-blip" /> CONSOLE LIVE
                    </span>
                    <span>COGNITO ⟶ ACCESS TOKEN ⟶ RESTORE</span>
                    <span>© 2026</span>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
