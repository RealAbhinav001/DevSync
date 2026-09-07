import "./verifyEmail.css";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { ArrowUpRight } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { confirmRegistration, login, createProfile, loading } =
    useContext(AuthContext);

  const email = location.state?.email || "";

  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!confirmationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    try {
      await confirmRegistration({
        email,
        confirmationCode,
      });

      await login({
        email,
        password: location.state?.password,
      });

      await createProfile(location.state?.name);

      navigate("/organization");
    } catch (error) {
      console.error(error);
      setError(
        error?.message || "Verification failed. Please check your code.",
      );
    }
  };

  return (
    <div>
      <h1>VERIFY EMAIL</h1>

      <p>
        A verification code has been sent to:
        <br />
        <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          placeholder="Enter verification code"
        />

        {error && <p>{error}</p>}

        <button disabled={loading} type="submit">
          {loading ? "VERIFYING..." : "VERIFY"}
          <ArrowUpRight size={22} />
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
