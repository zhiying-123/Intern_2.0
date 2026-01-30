// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { routes, routeConfig } from "./routes";
import { cookies } from "next/headers";
import { logout } from "./logout/logout";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Professional App",
  description: "A professional deep blue themed Next.js app",
};

// ==================== Auth State (Server) ====================
async function getAuthState() {
  const cookieStore = await cookies();

  const isLoggedIn = cookieStore.get("auth")?.value === "true";
  const userCookie = cookieStore.get("user")?.value;

  const user = userCookie ? JSON.parse(userCookie) : null;

  return { isLoggedIn, user };
}

// ==================== Header ====================
async function Header() {
  const { isLoggedIn, user } = await getAuthState();

  return (
    <header className="fixed w-full top-0 z-50 bg-blue-950 shadow-md text-white">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
          ZY University
        </h1>
        <span className="text-2xl">📚📜📑📖🗂️</span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-6 py-2 border-t border-blue-900 max-w-7xl mx-auto w-full">
        {/* Left nav */}
        <nav className="flex gap-4 items-center">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">Home</Link>

          {isLoggedIn && user?.role === 'STAFF' && (
            <Link href="/staff_dashboard" className="text-white hover:text-blue-300 transition-colors">Staff Dashboard</Link>
          )}

          {isLoggedIn && user?.role !== 'STAFF' && (
            <>
              <Link href="/enroll_course" className="text-white hover:text-blue-300 transition-colors">Enroll_Course</Link>
            </>
          )}
        </nav>

        {/* Right nav */}
        <nav className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-blue-300 hidden sm:block">{user?.email}</span>
              <Link href="/profile" className="hover:text-blue-300 transition-colors">Profile</Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

// ==================== Footer ====================
function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-blue-950 text-white py-4 text-center shadow-inner z-40">
      &copy; {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}

// ==================== Root Layout ====================
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getAuthState();
  const isStaff = user?.role === 'STAFF';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isStaff ? 'bg-white' : 'bg-blue-950 text-white'
          } min-h-screen flex flex-col`}
      >
        {!isStaff && <Header />}

        <main className="flex-1 w-full h-full">
          {children}
        </main>

        {!isStaff && <Footer />}
      </body>
    </html>
  );
}
