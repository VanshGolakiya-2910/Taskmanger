import { useState } from "react";
import { login } from "../../api/auth.api";
import { useAuth } from "../hooks/useAuth"; // Ensure this path is correct
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      await refresh();
      navigate("/projects");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>

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

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          No account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
