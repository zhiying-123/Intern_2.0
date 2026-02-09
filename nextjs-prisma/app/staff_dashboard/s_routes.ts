// Staff Dashboard Routes Configuration
export interface RouteConfig {
    path: string;
    label: string;
    icon: string;
    description?: string;
    color?: string;
}

// Main Management Routes (Primary Navigation)
export const mainRoutes: RouteConfig[] = [
    {
        path: "/staff_dashboard/management/m_enroll",
        label: "Enrollment Management",
        icon: "📝",
        description: "Review and approve student enrollment applications",
        color: "blue"
    },
    {
        path: "/staff_dashboard/management/m_course",
        label: "Course Management",
        icon: "📚",
        description: "Create, edit, and manage courses and their subjects",
        color: "green"
    },
    {
        path: "/staff_dashboard/management/m_subject",
        label: "Subject Management",
        icon: "📖",
        description: "Create, edit, and delete subjects",
        color: "purple"
    },
    {
        path: "/staff_dashboard/management/m_event",
        label: "Event Management",
        icon: "🎉",
        description: "Manage company holidays and special events",
        color: "amber"
    }
];

// Sidebar Navigation Routes
export const sidebarRoutes: RouteConfig[] = [
    {
        path: "/staff_dashboard",
        label: "Dashboard",
        icon: "🏠",
        description: "Staff Dashboard Home"
    },
    {
        path: "/staff_dashboard/news",
        label: "News",
        icon: "📑",
        description: "View the latest news and updates"
    },
    {
        path: "/staff_dashboard/stocks",
        label: "Stocks",
        icon: "📊",
        description: "View the latest stocks and updates"
    },
    {
        path: "/staff_dashboard/stocks/portfolio",
        label: "My Portfolio",
        icon: "💼",
        description: "View your investment portfolio and holdings"
    },
    {
        path: "/staff_dashboard/holidays",
        label: "Calendar",
        icon: "🗓️",
        description: "View calendar, holidays, and your personal tasks"
    },
    {
        path: "/staff_dashboard/mytodo",
        label: "My To-Do List",
        icon: "✅",
        description: "Manage your personal tasks and to-dos"
    },
    {
        path: "/staff_dashboard/s_profile",
        label: "Staff Profile",
        icon: "👤",
        description: "View and edit your profile"
    }
];

export const routeConfig: Record<string, RouteConfig> = [...mainRoutes, ...sidebarRoutes].reduce((acc, route) => {
    acc[route.path] = route;
    return acc;
}, {} as Record<string, RouteConfig>);
