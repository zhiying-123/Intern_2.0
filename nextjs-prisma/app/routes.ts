export interface routeConfig {
    path: string;
    name: string;
    isPublic: boolean;
}

export const routes: routeConfig[] = [
    {
        path: "/",
        name: "Home",
        isPublic: true,
    },
    {
        path: "/login",
        name: "Login",
        isPublic: true,
    },
    {
        path: "/register",
        name: "Register",
        isPublic: true,
    },
    {
        path: "/profile",
        name: "Profile",
        isPublic: false,
    },
    {
        path: "/profile/updateProfile",
        name: "Update Profile",
        isPublic: false,
    },
    {
        path: "/enroll_course",
        name: "Enroll Course",
        isPublic: false,
    },
    {
        path: "/my_course",
        name: "My Course",
        isPublic: false,
    },
    {
        path: "/analytics",
        name: "Analytics",
        isPublic: false,
    },
    {
        path: "/staff_dashboard",
        name: "Staff Dashboard",
        isPublic: false,
    },
];