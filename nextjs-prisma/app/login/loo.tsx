//frontend
"use client";

import { useState } from "react";
import { loginRequest } from "./login";

export default function LoginUI() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await loginRequest(identifier, password);
      setLoading(false);

      if (!result.success) {
        setError(result.message ?? "Login failed");
        return;
      }

      // Check if user is staff and redirect accordingly
      if (result.user?.role === 'STAFF') {
        window.location.href = "/staff_dashboard";
      } else {
        window.location.href = "/";
      }
    } catch {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: 'url("/H1/bg2.jpg")' }}
    >
      <div
        className="
          w-full max-w-md
          bg-white/80
          backdrop-blur-md
          border border-white/30
          shadow-2xl
          rounded-lg
        "
      >
        <div className="h-1 rounded-t-lg bg-linear-to-r from-[#0a1128] via-[#001f54] to-[#0a1128]" />

        <div className="p-10">
          <h1 className="text-3xl font-semibold text-[#0a1128] mb-2">
            System Login
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            ZY University Secure Portal
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="
                  w-full px-4 py-3
                  bg-white/90
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#001f54]
                "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-4 py-3
                  bg-white/90
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-[#001f54]
                "
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="
                w-full mt-2 py-3
                bg-[#001f54]
                text-white font-medium
                hover:bg-[#0a1128]
                transition
                disabled:opacity-60
              "
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <div className="mt-2 text-center flex justify-center gap-6">
              <a href="/register" className="text-sm text-slate-600 hover:underline">Register</a>
              <a href="/forgot-password" className="text-sm text-slate-600 hover:underline">Forgot password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
