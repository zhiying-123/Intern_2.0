import Image from "next/image";
import { cookies } from "next/headers";
import { getPopularCourses, PopularCourse } from "./lib/stats";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user");
  const popular: PopularCourse[] = await getPopularCourses(3);

  return (
    <div className="w-full bg-white text-gray-900">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/H1/bg1.jpg)" }}
      >
        <div className="absolute inset-0 bg-slate-900/40"></div>

        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Learn. Apply. Grow.
          </h1>

          <p className="text-slate-200 text-base md:text-lg max-w-xl mx-auto">
            Find courses that fit your career goals and apply easily through our
            streamlined enrollment system.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="/enroll_course"
              className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:opacity-95 transition"
            >
              Browse Courses
            </a>

            {!isLoggedIn && (
              <a
                href="/login"
                className="px-6 py-3 border border-white/30 text-white rounded-full font-medium hover:bg-white/5 transition"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ================= SYSTEM INTRO ================= */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          ZY University — Learn with Purpose
        </h2>
        <p className="text-gray-600 leading-8">
          A hands-on learning platform where real-world projects meet guided
          mentorship. Browse curated courses designed for career impact,
          apply with a single click, and track your journey from enrollment to
          achievement.
        </p>
      </section>

      {/* ================= POPULAR COURSES ================= */}
      <section className="py-12 px-6 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Popular Courses</h3>
              <p className="text-sm text-gray-500">Top applied courses by approved enrollments</p>
            </div>
            <a href="/enroll_course" className="text-sm text-indigo-600 hover:underline">See all</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popular.map((p: PopularCourse, idx: number) => (
              p.course && (
                <div key={p.course.c_id} className={`rounded-xl p-4 shadow-sm transition transform hover:-translate-y-1 ${idx === 0 ? 'ring-2 ring-indigo-100 bg-white' : 'bg-white'}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="shrink-0">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {p.course.c_name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-slate-900">{p.course.c_name}</div>
                          <div className="text-xs text-gray-500">{p.course.c_category}</div>
                        </div>
                        <div className="text-sm text-indigo-700 font-bold text-right">{p.count} approved</div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{p.course.c_description}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                    <div>{p.course.c_duration} credit hours</div>
                    <div className="font-semibold">RM {p.course.c_price}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP SECTION ================= */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Founders</h2>
          <p className="text-gray-500">Meet the founders who started ZY University</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative bg-indigo-50 rounded-2xl p-6 shadow-md flex items-center gap-6">
            <Image src="/H1/staff1.jpeg" alt="Cookies" width={140} height={140} className="rounded-full shadow-lg" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold text-slate-900">Cookies</h3>
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Founder</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Co-founder — leads admissions and partnerships.</p>
            </div>
          </div>

          <div className="relative bg-purple-50 rounded-2xl p-6 shadow-md flex items-center gap-6">
            <Image src="/H1/staff2.jpeg" alt="Milk" width={140} height={140} className="rounded-full shadow-lg" />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-semibold text-slate-900">Milk</h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Founder</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Co-founder — coordinates curriculum and student support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ADDRESS + MAP ================= */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          Our Location
        </h2>
        <p className="text-gray-600 mb-8">Kuala Lumpur, Malaysia</p>

        <div className="w-full h-100 rounded-xl overflow-hidden shadow-md">
          <iframe
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps?q=Kuala%20Lumpur&output=embed"
          />
        </div>
      </section>
    </div>
  );
}
