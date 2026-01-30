//frontend
"use client";

import { useState } from "react";
import { updateProfile } from "./updateProfile";

export default function UpdateProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic client-side validation
    if (!email || !email.includes("@")) {
      setError("Email must be a valid address containing '@'.");
      return;
    }

    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      setError("To change password, provide both old and new password.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      const hasLetter = /[A-Za-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (!hasLetter || !hasNumber) {
        setError("New password must include both letters and numbers.");
        return;
      }
    }

    try {
      await updateProfile({
        name,
        email,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setOldPassword("");
      setNewPassword("");
      setSuccess("Profile updated successfully");
    } catch (err: any) {
      setError(err.message || "Update failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-36 pb-24 px-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
      >
        {/* Header */}
        <h1 className="text-2xl font-semibold text-slate-800">
          Update Profile
        </h1>

        <p className="text-sm text-slate-400 mt-1 mb-8">
          User ID: {user.u_id}
        </p>

        {/* Profile Info */}
        <div className="space-y-5 mb-10">
          <h2 className="text-base font-medium text-slate-700">
            Profile Information
          </h2>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Name
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full mt-2 px-4 py-2.5 rounded-lg
                border border-slate-300
                focus:outline-none focus:ring-1 focus:ring-slate-400
              "
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Email
            </p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full mt-2 px-4 py-2.5 rounded-lg
                border border-slate-300
                focus:outline-none focus:ring-1 focus:ring-slate-400
              "
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-5 pt-6 border-t border-slate-200 mb-10">
          <h2 className="text-base font-medium text-slate-700">
            Change Password <span className="text-xs text-slate-400">(optional)</span>
          </h2>

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-lg
              border border-slate-300
              focus:outline-none focus:ring-1 focus:ring-slate-400
            "
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="
              w-full px-4 py-2.5 rounded-lg
              border border-slate-300
              focus:outline-none focus:ring-1 focus:ring-slate-400
            "
          />
        </div>

        {/* Messages */}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        {/* Action */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="
              px-6 py-2.5 rounded-lg
              border border-slate-400
              text-slate-700 font-medium
              hover:bg-slate-100 transition
            "
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
