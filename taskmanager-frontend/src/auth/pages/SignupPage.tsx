import { useState } from "react";
import { register } from "../../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"manager" | "project_manager" | "member">(
    "member"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register({ email, password, role });
      navigate("/login");
    } catch {
      setError("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Sign Up</h1>

        {error && (
          <div className="text-sm text-red-400">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-700 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as typeof role)
          }
          className="w-full p-2 rounded bg-gray-700 outline-none"
        >
          <option value="member">Member</option>
          <option value="project_manager">Project Manager</option>
          <option value="manager">Manager</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
        >
          Create Account
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
