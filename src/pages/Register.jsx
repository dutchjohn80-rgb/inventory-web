import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Register({ onSwitchToLogin }) {
  const { login } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(null);
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          throw new Error(data.message || "Registration failed");
        }

        login(data.token);
        // No reload needed with context
      })
      .catch((err) => setError(err.message || "Registration failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:shadow-black/20 dark:ring-slate-800">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Join the inventory system
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full rounded-2xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            onClick={onSwitchToLogin}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;