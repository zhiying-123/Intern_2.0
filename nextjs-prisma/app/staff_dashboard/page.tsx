// Staff Dashboard Home Page
import Link from "next/link";
import { cookies } from "next/headers";
import { mainRoutes } from "./s_routes";

async function getStaffInfo() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user")?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    return { user };
}

export default async function StaffDashboardPage() {
    const { user } = await getStaffInfo();

    return (
        <div className="py-12 px-4">
            <div className="w-full max-w-7xl mx-auto">
                {/* Horizontal Layout - 3 Cards in a Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {mainRoutes.map((route) => {
                        const colorClasses = {
                            blue: {
                                bg: 'bg-blue-50/80 hover:bg-blue-100/80',
                                border: 'border-blue-200/60',
                                text: 'text-blue-700',
                                accent: 'bg-blue-500/10'
                            },
                            green: {
                                bg: 'bg-green-50/80 hover:bg-green-100/80',
                                border: 'border-green-200/60',
                                text: 'text-green-700',
                                accent: 'bg-green-500/10'
                            },
                            purple: {
                                bg: 'bg-purple-50/80 hover:bg-purple-100/80',
                                border: 'border-purple-200/60',
                                text: 'text-purple-700',
                                accent: 'bg-purple-500/10'
                            },
                            amber: {
                                bg: 'bg-amber-50/80 hover:bg-amber-100/80',
                                border: 'border-amber-200/60',
                                text: 'text-amber-700',
                                accent: 'bg-amber-500/10'
                            }
                        };
                        const colors = colorClasses[route.color as keyof typeof colorClasses];

                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                className="group"
                            >
                                <div className={`${colors.bg} border ${colors.border} rounded-2xl p-8 transition-all duration-300 hover:shadow-md backdrop-blur-sm h-full flex flex-col items-center justify-center text-center gap-4 group-hover:scale-105 transform`}>
                                    <div className={`${colors.accent} w-32 h-32 rounded-full flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <span className="text-6xl">{route.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                                            {route.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {route.description}
                                        </p>
                                    </div>

                                    {/* Cute Loading Animation on Hover */}
                                    <div className="mt-3 flex gap-1.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
