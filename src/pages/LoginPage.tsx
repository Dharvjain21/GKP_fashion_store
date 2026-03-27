import { useState } from "react";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small delay to feel responsive
    await new Promise((r) => setTimeout(r, 600));

    const isAdmin = login(username.trim(), password.trim());
    setLoading(false);

    if (isAdmin) {
      onNavigate("admin");
    } else {
      // If credentials are wrong → redirect to home (customer side)
      onNavigate("home");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-100 to-amber-50 flex items-center justify-center px-4">
      {/* Back Button */}
      <button
        onClick={() => onNavigate("home")}
        className="absolute top-4 left-4 flex items-center gap-1.5 text-sm text-gray-600 hover:text-pink-600 transition"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8 animate-fadeSlide">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/gkp-logo.png"
              alt="GKP Logo"
              className="h-16 w-16 object-contain mx-auto rounded-2xl border-2 border-pink-200 shadow-sm mb-3"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to GKP Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition bg-gray-50"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-rose-500 text-center bg-rose-50 border border-rose-200 rounded-lg py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Hint */}
          <p className="text-[11px] text-gray-400 text-center mt-4">
            Wrong credentials? You'll be redirected to the store.
          </p>
        </div>
      </div>
    </div>
  );
}
