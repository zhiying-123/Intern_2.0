import Image from "next/image";
import { cookies } from "next/headers";
import { getPopularCourses, PopularCourse } from "./lib/stats";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user");
  const popular: PopularCourse[] = await getPopularCourses(3);

  return (
    <div className="w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        {/* Grid pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-1 pointer-events-none">
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-400/8 rounded-full blur-3xl"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-2 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-2 bg-white/20 rounded-full top-1/3 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-1.5 h-1.5 bg-blue-300/30 rounded-full top-[40%] right-1/3 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
          <div className="absolute w-2.5 h-2.5 bg-indigo-300/20 rounded-full bottom-1/3 left-1/3 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
          <div className="absolute w-1 h-1 bg-white/30 rounded-full top-2/3 right-1/4 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-blue-100">Now Accepting Applications</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white relative z-30">
            Shape Your
            <span className="block bg-linear-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Future With Us
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of students who have transformed their careers through our
            industry-leading courses and expert mentorship programs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/enroll_course"
              className="group px-8 py-4 bg-white text-blue-950 rounded-xl font-semibold shadow-xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1"
            >
              Explore Courses
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>

            {!isLoggedIn && (
              <a
                href="/login"
                className="px-8 py-4 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Sign In
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="mt-20 mb-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
              <div className="text-sm text-blue-200/60 mt-1">Courses</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl md:text-4xl font-bold text-white">1.2K+</div>
              <div className="text-sm text-blue-200/60 mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">95%</div>
              <div className="text-sm text-blue-200/60 mt-1">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-24 px-6 bg-linear-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-semibold text-blue-600 mb-4 tracking-wider uppercase">About Us</div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Education That <br />
                <span className="text-blue-600">Matters</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                ZY University is a forward-thinking institution dedicated to providing
                practical, career-focused education. Our courses are designed by industry
                professionals to ensure you gain skills that employers actually want.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Career-Focused Curriculum</div>
                    <div className="text-sm text-slate-500">Industry-aligned course content</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <span className="text-xl">👨‍🏫</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Expert Instructors</div>
                    <div className="text-sm text-slate-500">Learn from professionals</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <span className="text-xl">📈</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Proven Results</div>
                    <div className="text-sm text-slate-500">High graduate employment rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-blue-900 mb-2">10+</div>
                    <div className="text-sm text-blue-700/70">Years Experience</div>
                  </div>
                  <div className="bg-linear-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-indigo-900 mb-2">50+</div>
                    <div className="text-sm text-indigo-700/70">Expert Faculty</div>
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-purple-900 mb-2">100%</div>
                    <div className="text-sm text-purple-700/70">Online Access</div>
                  </div>
                  <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-emerald-900 mb-2">24/7</div>
                    <div className="text-sm text-emerald-700/70">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR COURSES ================= */}
      <section className="py-24 px-6 bg-linear-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 mb-4 tracking-wider uppercase">Featured</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Popular Courses</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover our most enrolled courses, chosen by students for their quality and career impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popular.map((p: PopularCourse, idx: number) => (
              p.course && (
                <div
                  key={p.course.c_id}
                  className={`group relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 ${idx === 0 ? 'md:-mt-4 md:mb-4 ring-2 ring-blue-500/20 shadow-lg' : 'shadow-md'}`}
                >
                  {idx === 0 && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-linear-to-r from-amber-500 to-orange-500 rounded-full text-xs font-semibold text-white shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-blue-500/30">
                      {p.course.c_name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg truncate">{p.course.c_name}</h3>
                      <div className="text-sm text-blue-600">{p.course.c_category}</div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-6">{p.course.c_description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-sm text-slate-500">
                      <span className="text-blue-600 font-bold">{p.count}</span> enrolled
                    </div>
                    <div className="text-xl font-bold text-slate-900">RM {p.course.c_price}</div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="text-slate-500">{p.course.c_duration} credit hours</div>
                    <a href="/enroll_course" className="text-blue-600 hover:text-blue-700 font-semibold group-hover:underline">
                      Learn more →
                    </a>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/enroll_course"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              View All Courses
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOUNDERS SECTION ================= */}
      <section className="py-24 px-6 bg-linear-to-b from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 mb-4 tracking-wider uppercase">Leadership</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Meet Our Founders</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Visionary leaders committed to transforming education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group relative bg-white border border-slate-200 rounded-2xl p-8 text-center hover:shadow-xl hover:border-amber-200 transition-all duration-300">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-3 bg-linear-to-r from-amber-400/40 to-orange-400/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Image
                  src="/H1/staff1.jpeg"
                  alt="Cookies"
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-white shadow-xl"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-200 rounded-full text-amber-700 text-xs font-semibold mb-3">
                Co-Founder
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Cookies</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Leads admissions and strategic partnerships, bringing years of experience in education management.
              </p>
            </div>

            <div className="group relative bg-white border border-slate-200 rounded-2xl p-8 text-center hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
              <div className="relative inline-block mb-6">
                <div className="absolute -inset-3 bg-linear-to-r from-emerald-400/40 to-teal-400/40 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Image
                  src="/H1/staff2.jpeg"
                  alt="Milk"
                  width={120}
                  height={120}
                  className="relative rounded-full border-4 border-white shadow-xl"
                />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold mb-3">
                Co-Founder
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Milk</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Coordinates curriculum development and student support, ensuring quality education delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOCATION SECTION ================= */}
      <section className="py-24 px-6 bg-linear-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold text-blue-600 mb-4 tracking-wider uppercase">Visit Us</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Location</h2>
            <p className="text-slate-600">Kuala Lumpur, Malaysia</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl p-3 shadow-xl overflow-hidden">
              <iframe
                className="w-full h-96 rounded-xl"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps?q=Kuala%20Lumpur&output=embed"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">📍</div>
              <div className="text-sm text-slate-500 mb-1">Address</div>
              <div className="text-slate-900 font-semibold">Kuala Lumpur, MY</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">📞</div>
              <div className="text-sm text-slate-500 mb-1">Phone</div>
              <div className="text-slate-900 font-semibold">+60 3-1234 5678</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl mb-3">✉️</div>
              <div className="text-sm text-slate-500 mb-1">Email</div>
              <div className="text-slate-900 font-semibold">info@zyuniversity.edu</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url(/H1/bg1.jpg)" }}>
        {/* Lighter overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0f172a]/70 via-[#1e293b]/60 to-[#0f172a]/70"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto">
            Join our community of learners and take the first step towards a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-4 bg-white text-blue-950 rounded-xl font-semibold shadow-xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1"
            >
              Create Account
            </a>
            <a
              href="/enroll_course"
              className="px-8 py-4 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all duration-300"
            >
              Browse Courses
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
