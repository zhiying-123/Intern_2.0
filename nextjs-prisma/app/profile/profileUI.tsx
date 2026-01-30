"use client";

import { useRouter } from "next/navigation";

type User = {
    u_id: number;
    name: string;
    email: string;
    role: string;
};

export default function ProfileUI({ user }: { user: User }) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-100 pt-36 pb-24 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

                {/* Profile Info */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-xl font-semibold text-slate-700">
                            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">{user.name}</h1>
                            <p className="text-sm text-slate-400 mt-1">User ID: {user.u_id} • {user.role}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                    </div>

                    <hr className="my-6 border-slate-100" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
                            <p className="text-sm text-slate-800 mt-1">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
                            <p className="text-sm text-slate-800 mt-1">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Role</p>
                            <p className="text-sm text-slate-800 mt-1">{user.role}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
                            <p className="text-sm text-slate-800 mt-1">{user.u_id}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-3 h-fit">
                    <button
                        onClick={() => router.push("/profile/updateProfile")}
                        className="w-full py-2.5 rounded-lg border border-blue-600 text-blue-700 font-medium hover:bg-blue-50 transition"
                    >
                        Update Profile
                    </button>

                    <button
                        onClick={() => router.push("/my_course")}
                        className="w-full py-2.5 rounded-lg border border-indigo-600 text-indigo-700 font-medium hover:bg-indigo-50 transition"
                    >
                        My Courses
                    </button>

                    <button
                        onClick={() => router.push("/enrollment_records")}
                        className="w-full py-2.5 rounded-lg border border-amber-600 text-amber-700 font-medium hover:bg-amber-50 transition"
                    >
                        Enrollment Records
                    </button>

                    <button
                        onClick={() => router.push("/profile/deleteAK")}
                        className="w-full py-2.5 rounded-lg border border-red-600 text-red-700 font-medium hover:bg-red-50 transition"
                    >
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    );
}
