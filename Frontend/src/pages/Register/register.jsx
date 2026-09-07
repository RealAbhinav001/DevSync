import "./register.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Asterisk, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
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

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, googleLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setconfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const togglefirstPassword = () => {
    setShowPassword(!showPassword);
  };

  const togglesecondPassword = () => {
    setconfirmPassword(!showConfirmPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please Fill all fields");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password should be greater the 6");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Password and Confirm Password Should be same");
        return;
      }

      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.nextStep?.signUpStep === "CONFIRM_SIGN_UP") {
        navigate("/verify-email", {
          state: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          },
        });

        return;
      }

      navigate("/organization");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration Failed Try Again",
      );
    }
  };

  const handleGoogleRegister = async () => {
    setError("");

    try {
      await googleLogin();
    } catch (error) {
      console.error("GOOGLE REGISTER ERROR:", error);

      setError(
        error.response?.data?.message ||
        error.message ||
        "Google registration failed. Try again.",
      );
    }
  };

  return (
    <div className="rgx-page">
      <div className="rgx-frame">
        {/* top rail */}
        <motion.div
          className="rgx-rail"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="rgx-brand">
            DEVSYNC<sup>®</sup>
          </Link>
          <span className="rgx-rail-mid">IDENTITY FORGE — NEW OPERATORS</span>
          <Link to="/login" className="rgx-rail-link">
            HAVE ACCESS? [ LOG IN ]
          </Link>
        </motion.div>

        {/* giant headline */}
        <h1 className="rgx-title" aria-label="Join the pulse.">
          <span className="rgx-mask">
            <motion.span
              className="rgx-line"
              custom={0}
              variants={lineReveal}
              initial="hidden"
              animate="visible"
            >
              JOIN THE
            </motion.span>
          </span>
          <span className="rgx-mask">
            <motion.span
              className="rgx-line"
              custom={1}
              variants={lineReveal}
              initial="hidden"
              animate="visible"
            >
              <em>pulse</em>
              <motion.i
                className="rgx-star"
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              >
                <Asterisk size={"100%"} strokeWidth={2.4} />
              </motion.i>
            </motion.span>
          </span>
        </h1>

        {/* body: side + form */}
        <div className="rgx-body">
          <motion.aside
            className="rgx-side"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="rgx-side-quote">
              "Sixty seconds from
              <br />
              zero to workspace."
            </p>
            <div className="rgx-steps">
              <p style={{ animationDelay: "1s" }} className="done">
                ✓ (01) FORGE IDENTITY
              </p>
              <p style={{ animationDelay: "1.7s" }} className="now">
                ● (02) BIRTH AN ORGANIZATION
              </p>
              <p style={{ animationDelay: "2.4s" }}>○ (03) SUMMON THE CREW</p>
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
            <label className="rgx-field">
              <span className="rgx-label">(01) — OPERATOR_NAME</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Abhinav Chaubey"
              />
            </label>

            <label className="rgx-field">
              <span className="rgx-label">(02) — EMAIL_ID</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@crew.dev"
              />
            </label>

            <div className="rgx-row">
              <label className="rgx-field">
                <span className="rgx-label">(03) — PASSKEY</span>
                <div className="rgx-passwrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="passfirst"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="min. 6 chars"
                  />
                  {showPassword ? (
                    <Eye onClick={togglefirstPassword} className="rgx-eye" />
                  ) : (
                    <EyeOff onClick={togglefirstPassword} className="rgx-eye" />
                  )}
                </div>
              </label>

              <label className="rgx-field">
                <span className="rgx-label">(04) — CONFIRM_KEY</span>
                <div className="rgx-passwrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="repeat it"
                  />
                  {showConfirmPassword ? (
                    <Eye onClick={togglesecondPassword} className="rgx-eye" />
                  ) : (
                    <EyeOff
                      onClick={togglesecondPassword}
                      className="rgx-eye"
                    />
                  )}
                </div>
              </label>
            </div>

            {error && <p className="rgx-error">⚠ {error}</p>}

            <button type="submit" disabled={loading} className="rgx-submit">
              <span>{loading ? "FORGING PROFILE…" : "INITIALIZE ACCOUNT"}</span>
              <ArrowUpRight size={22} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              disabled={loading}
              className="lgx-google"
              onClick={handleGoogleRegister}
            >
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            <p className="rgx-swap">
              ALREADY AN OPERATOR? <Link to="/login">ACCESS CONSOLE ↗</Link>
            </p>
          </motion.form>
        </div>

        {/* bottom rail */}
        <motion.div
          className="rgx-foot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span>
            <i className="rgx-blip" /> FORGE LIVE
          </span>
          <span>IDENTITY ⟶ ORG ⟶ CREW</span>
          <span>© 2026</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
