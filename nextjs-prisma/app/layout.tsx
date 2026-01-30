// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
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
  title: "Course Founder",
  description: "A comprehensive university course management system for student enrollment, course tracking, and academic records.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Course Founder",
    description: "A comprehensive university course management system for student enrollment, course tracking, and academic records.",
    images: [
      {
        url: "/preview.jpg",
        width: 1200,
        height: 630,
        alt: "Course Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Course Founder",
    description: "A comprehensive university course management system for student enrollment, course tracking, and academic records.",
    images: ["/preview.jpg"],
  },
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
    <header className="fixed w-full top-0 z-50 backdrop-blur-xl bg-linear-to-r from-[#0f172a]/98 via-[#1e293b]/98 to-[#0f172a]/98 border-b border-blue-600/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Header Row */}
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-xl bg-white/95 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 p-1.5">
              <Image src="/logo.png" alt="Course Founder" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Course Founder</h1>
              <p className="text-xs text-blue-300/70 -mt-0.5">ZY University</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className="px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-blue-800/40 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </Link>

            {isLoggedIn && user?.role === 'STAFF' && (
              <Link
                href="/staff_dashboard"
                className="px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-blue-800/40 rounded-lg transition-all duration-200 font-medium"
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn && user?.role !== 'STAFF' && (
              <Link
                href="/enroll_course"
                className="px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-blue-800/40 rounded-lg transition-all duration-200 font-medium"
              >
                Courses
              </Link>
            )}

            {isLoggedIn && (
              <Link
                href="/profile"
                className="px-5 py-2.5 text-sm text-white/80 hover:text-white hover:bg-blue-800/40 rounded-lg transition-all duration-200 font-medium"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="hidden lg:block text-sm text-blue-200/70 max-w-37.5 truncate">
                  {user?.email}
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm bg-red-600/20 hover:bg-red-600 text-white rounded-lg transition-all duration-200 border border-red-500/30 hover:border-red-500 font-medium"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 text-sm bg-white text-blue-950 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg shadow-white/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// ==================== Footer ====================
function Footer() {
  return (
    <footer className="relative mt-auto bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-blue-100 border-t border-blue-600/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-3">Course Founder</h3>
            <p className="text-sm text-blue-200/70 leading-relaxed mb-4">
              A comprehensive university course management system for student enrollment,
              course tracking, and academic records at ZY University.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-200/70">
              <span>📍</span>
              <span>Kuala Lumpur, Malaysia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-blue-200/70 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/enroll_course" className="text-blue-200/70 hover:text-white transition-colors">Browse Courses</Link>
              </li>
              <li>
                <Link href="/register" className="text-blue-200/70 hover:text-white transition-colors">Register</Link>
              </li>
              <li>
                <Link href="/login" className="text-blue-200/70 hover:text-white transition-colors">Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-blue-200/70">
              <li>📞 +60 3-1234 5678</li>
              <li>✉️ info@zyuniversity.edu</li>
              <li>🌐 Kuala Lumpur, MY</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-blue-400/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-blue-200/60">
            &copy; {new Date().getFullYear()} ZY University. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-blue-200/60">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
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
