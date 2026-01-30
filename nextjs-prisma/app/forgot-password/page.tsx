"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState<"send" | "reset">("send");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    async function sendCode() {
        setError("");
        setMessage("");
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message || "Failed to send code");
            } else {
                setMessage(data.message || "Verification code sent. Check server logs in dev or your email.");
                if (data.previewUrl) setPreviewUrl(data.previewUrl);
                setStep("reset");
            }
        } catch (e) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }

    const router = useRouter();

    async function resendCode() {
        // reuse sendCode functionality but keep user on reset step
        setError("");
        setMessage("");
        if (!email || !email.includes("@")) {
            setError("Please enter a valid email");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/send-reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message || "Failed to resend code");
            } else {
                setMessage(data.message || "Verification code resent. Check server logs in dev or your email.");
                if (data.previewUrl) setPreviewUrl(data.previewUrl);
                setStep("reset");
            }
        } catch (e) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }

    async function resetPassword() {
        setError("");
        setMessage("");

        if (!code) {
            setError("Please enter the verification code");
            return;
        }
        if (!newPassword || !confirmPassword) {
            setError("Please enter and confirm your new password");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        const hasLetter = /[A-Za-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long and include letters and numbers");
            return;
        }
        if (!hasLetter || !hasNumber) {
            setError("Password must be at least 8 characters long and include letters and numbers");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, newPassword, confirmPassword }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message || "Reset failed");
            } else {
                setMessage("Password reset successful. Redirecting to login...");
                setStep("send");
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
                // redirect to login page
                router.push('/login');
            }
        } catch (e) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 pt-36 px-6 pb-24">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <h1 className="text-2xl font-semibold text-slate-800 mb-2">Forgot Password</h1>
                    <p className="text-sm text-slate-500 mb-6">Enter your email to receive a verification code.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300" />
                        </div>

                        {step === "reset" && (
                            <>
                                <div>
                                    <label className="text-xs text-slate-500">Verification Code</label>
                                    <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300" />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500">New Password</label>
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300" />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500">Confirm Password</label>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-2 px-4 py-2 rounded-lg border border-slate-300" />
                                </div>
                            </>
                        )}

                        {error && <div className="text-sm text-red-600">{error}</div>}
                        {message && <div className="text-sm text-green-600">{message}</div>}
                        {previewUrl && (
                            <div className="mt-2">
                                <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline">Open email preview</a>
                            </div>
                        )}

                        {step === "send" ? (
                            <button onClick={sendCode} disabled={loading} className="w-full py-2.5 rounded-lg bg-slate-800 text-white">{loading ? 'Sending...' : 'Send Verification Code'}</button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={resetPassword} disabled={loading} className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white">{loading ? 'Processing...' : 'Reset Password'}</button>
                                <button onClick={resendCode} disabled={loading} className="py-2.5 px-4 rounded-lg bg-white border text-slate-700">Resend Code</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
