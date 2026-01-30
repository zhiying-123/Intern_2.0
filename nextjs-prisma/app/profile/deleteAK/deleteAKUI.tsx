//frontend
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "./deleteAK";

type User = {
    u_id: number;
    name: string;
};

export default function DeleteAKUI({ user }: { user: User }) {
    const router = useRouter();
    const [inputName, setInputName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setError("");

        // first：name match
        if (inputName !== user.name) {
            setError("Name does not match. Please type your full name.");
            return;
        }

        // second：confirm dialog
        const confirmed = window.confirm(
            "This action is permanent.\nAll your enrolled courses will be deleted.\n\nAre you sure?"
        );

        if (!confirmed) return;

        try {
            setLoading(true);
            await deleteAccount();
            router.replace("/login");
        } catch (err) {
            setError("Failed to delete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-red-200 shadow-sm">

                <h1 className="text-2xl font-semibold text-red-600">
                    Delete Account
                </h1>

                <p className="text-sm text-slate-600 mt-3">
                    This action cannot be undone.
                    All your enrolled course records will be permanently removed.
                </p>

                <div className="mt-6">
                    <label className="block text-sm text-slate-600 mb-1">
                        Type your full name to confirm
                    </label>
                    <input
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        placeholder={user.name}
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600 mt-3">{error}</p>
                )}

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 border rounded-lg py-2 text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete Account"}
                    </button>
                </div>

            </div>
        </div>
    );
}
