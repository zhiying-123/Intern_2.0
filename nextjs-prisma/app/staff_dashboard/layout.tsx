// Staff Dashboard Layout
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sidebarRoutes } from "./s_routes";
import { logout } from "../logout/logout";

// ==================== Back Button Client Component ====================
function BackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
            title="Go back to previous page"
        >
            <span>←</span>
            <span>Back</span>
        </button>
    );
}

// ==================== Auth Check ====================
async function getStaffAuth() {
    const cookieStore = await cookies();
    const isLoggedIn = cookieStore.get("auth")?.value === "true";
    const userCookie = cookieStore.get("user")?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;

    // Redirect if not staff
    if (!isLoggedIn || user?.role !== 'STAFF') {
        redirect('/login');
    }

    return { user };
}

// ==================== Sidebar Navigation ====================
async function Sidebar() {
    const { user } = await getStaffAuth();

    return (
        <aside className="w-64 bg-linear-to-b from-amber-50/50 to-yellow-50/30 border-r border-amber-200/60 flex flex-col">
            {/* User Info - Minimalist */}
            <div className="p-8 border-b border-amber-200/60 bg-white/60 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                        {user.name?.[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">{user.name || 'Staff Member'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Staff</p>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-2">
                    {sidebarRoutes.map((route, index) => {
                        const colors = [
                            'hover:bg-blue-100 hover:text-blue-700 hover:shadow-sm',
                            'hover:bg-purple-100 hover:text-purple-700 hover:shadow-sm'
                        ];
                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                className={`flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl transition-all duration-200 group bg-white/40 backdrop-blur-sm ${colors[index % colors.length]}`}
                            >
                                <span className="text-xl">{route.icon}</span>
                                <span className="text-sm font-medium">{route.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-amber-200/60 bg-white/40 backdrop-blur-sm">
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 bg-white/60"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}

// ==================== Top Bar ====================
function TopBar() {
    return (
        <div className="h-16 bg-linear-to-r from-white via-amber-50/30 to-white border-b border-amber-200/40 flex items-center px-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">ZY University</h1>
                    <p className="text-xs text-gray-500">Staff Management</p>
                </div>
            </div>
            <div className="ml-auto">
                <div className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
    );
}

// ==================== Staff Dashboard Layout ====================
export default async function StaffDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verify staff authentication
    await getStaffAuth();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-linear-to-br from-amber-50/40 via-yellow-50/20 to-blue-50/30">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <TopBar />

                {/* Content */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
