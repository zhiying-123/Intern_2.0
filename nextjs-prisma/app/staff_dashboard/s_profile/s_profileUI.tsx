"use client";

import { useState } from "react";
import { updateStaffProfile, changePassword } from "./s_profile";

interface User {
    u_id: number;
    name: string;
    email: string;
    role: string;
}

export default function StaffProfileUI({ user: initialUser }: { user: User }) {
    const [user, setUser] = useState(initialUser);
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile form data
    const [profileData, setProfileData] = useState({
        name: user.name,
        email: user.email,
    });

    // Password form data
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        hasLetter: false,
        hasNumber: false,
        match: false,
    });

    const validatePassword = (password: string, confirm: string) => {
        setPasswordErrors({
            length: password.length >= 8,
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            match: password === confirm && password.length > 0,
        });
    };

    const handleProfileUpdate = async () => {
        if (!profileData.name.trim()) {
            alert("❌ Name is required");
            return;
        }

        if (!profileData.email.includes("@")) {
            alert("❌ Email must contain @");
            return;
        }

        setLoading(true);
        const result = await updateStaffProfile(profileData.name, profileData.email);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            // Update local state instead of reloading
            setUser({
                ...user,
                name: profileData.name.trim(),
                email: profileData.email.trim()
            });
            setEditMode(false);
        } else {
            alert("❌ " + result.message);
        }
    };

    const handlePasswordChange = async () => {
        if (!passwordData.oldPassword) {
            alert("❌ Please enter your current password");
            return;
        }

        if (!passwordErrors.length || !passwordErrors.hasLetter || !passwordErrors.hasNumber) {
            alert("❌ New password does not meet requirements");
            return;
        }

        if (!passwordErrors.match) {
            alert("❌ Passwords do not match");
            return;
        }

        setLoading(true);
        const result = await changePassword(passwordData.oldPassword, passwordData.newPassword);
        setLoading(false);

        if (result.success) {
            alert("✅ " + result.message);
            setPasswordMode(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } else {
            alert("❌ " + result.message);
        }
    };

    const cancelEdit = () => {
        setProfileData({ name: user.name, email: user.email });
        setEditMode(false);
    };

    const cancelPassword = () => {
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({ length: false, hasLetter: false, hasNumber: false, match: false });
        setPasswordMode(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-linear-to-br from-yellow-50 via-white to-yellow-50 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-yellow-100 to-yellow-200 rounded-full p-6 shadow-md">
                        <span className="text-4xl">👤</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-yellow-600 mt-1">Manage your account settings</p>
                    </div>
                </div>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-yellow-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    {!editMode && !passwordMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-linear-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150 text-yellow-700 px-5 py-2 rounded-xl font-semibold transition-all shadow-sm"
                        >
                            ✏️ Edit Profile
                        </button>
                    )}
                </div>

                {editMode ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                placeholder="your.email@example.com"
                            />
                            {profileData.email && !profileData.email.includes("@") && (
                                <p className="text-xs text-red-500 mt-1">Email must contain @</p>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={cancelEdit}
                                disabled={loading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                className="flex-1 bg-linear-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150 text-yellow-700 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-sm"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-linear-to-r from-yellow-25 to-yellow-50 rounded-xl p-4">
                            <p className="text-sm text-yellow-600 font-medium mb-1">Name</p>
                            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                        </div>

                        <div className="bg-linear-to-r from-yellow-25 to-yellow-50 rounded-xl p-4">
                            <p className="text-sm text-yellow-600 font-medium mb-1">Email</p>
                            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                        </div>

                        <div className="bg-linear-to-r from-yellow-25 to-yellow-50 rounded-xl p-4">
                            <p className="text-sm text-yellow-600 font-medium mb-1">Role</p>
                            <p className="text-lg font-semibold text-gray-900">{user.role}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Password Management Card */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-yellow-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Password & Security</h2>
                    {!editMode && !passwordMode && (
                        <button
                            onClick={() => setPasswordMode(true)}
                            className="bg-linear-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150 text-yellow-700 px-5 py-2 rounded-xl font-semibold transition-all shadow-sm"
                        >
                            🔒 Change Password
                        </button>
                    )}
                </div>

                {passwordMode ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password *</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, newPassword: e.target.value });
                                    validatePassword(e.target.value, passwordData.confirmPassword);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password *</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => {
                                    setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                                    validatePassword(passwordData.newPassword, e.target.value);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {/* Password Requirements */}
                        {passwordData.newPassword && (
                            <div className="bg-yellow-25 rounded-xl p-4 space-y-2">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</p>
                                <div className="space-y-1">
                                    <div className={`flex items-center gap-2 text-sm ${passwordErrors.length ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span>{passwordErrors.length ? '✓' : '○'}</span>
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm ${passwordErrors.hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span>{passwordErrors.hasLetter ? '✓' : '○'}</span>
                                        <span>Contains letters</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm ${passwordErrors.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span>{passwordErrors.hasNumber ? '✓' : '○'}</span>
                                        <span>Contains numbers</span>
                                    </div>
                                    <div className={`flex items-center gap-2 text-sm ${passwordErrors.match ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span>{passwordErrors.match ? '✓' : '○'}</span>
                                        <span>Passwords match</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={cancelPassword}
                                disabled={loading}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={loading}
                                className="flex-1 bg-linear-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-150 text-yellow-700 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-sm"
                            >
                                {loading ? "Changing..." : "Change Password"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-linear-to-r from-yellow-25 to-yellow-50 rounded-xl p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🔐</span>
                            <div>
                                <p className="text-sm text-yellow-700 font-medium">Password</p>
                                <p className="text-gray-600">••••••••</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
