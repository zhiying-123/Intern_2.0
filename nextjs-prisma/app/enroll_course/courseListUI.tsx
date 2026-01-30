"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Course {
  c_id: number;
  c_name: string;
  c_category: string;
  c_duration: number;
  c_price: number;
  c_description: string;
}

export default function EnrollCoursePage({ courses }: { courses: Course[] }) {
  const router = useRouter();

  // ===== Filter States =====
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [nameOrder, setNameOrder] = useState<"asc" | "desc">("asc");
  const [minDuration, setMinDuration] = useState<number | "">("");
  const [maxDuration, setMaxDuration] = useState<number | "">("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [priceSort, setPriceSort] = useState<"asc" | "desc">("asc");

  const categories = Array.from(new Set(courses.map(c => c.c_category)));
  const maxPrice = Math.max(...courses.map(c => c.c_price), 5000);

  const [filtered, setFiltered] = useState<Course[]>(courses);

  // ===== Filter Logic =====
  useEffect(() => {
    let result = [...courses];

    if (search) {
      result = result.filter(c =>
        c.c_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(c => c.c_category === category);
    }

    if (minDuration !== "") {
      result = result.filter(c => c.c_duration >= minDuration);
    }

    if (maxDuration !== "") {
      result = result.filter(c => c.c_duration <= maxDuration);
    }

    result = result.filter(
      c => c.c_price >= priceRange[0] && c.c_price <= priceRange[1]
    );

    result.sort((a, b) =>
      nameOrder === "asc"
        ? a.c_name.localeCompare(b.c_name)
        : b.c_name.localeCompare(a.c_name)
    );

    result.sort((a, b) =>
      priceSort === "asc"
        ? a.c_price - b.c_price
        : b.c_price - a.c_price
    );

    setFiltered(result);
  }, [
    search,
    category,
    minDuration,
    maxDuration,
    priceRange,
    priceSort,
    nameOrder,
    courses
  ]);

  return (
    <div className="flex pt-32 px-6 gap-8 bg-gray-100 min-h-screen">
      {/* ===== Filter ===== */}
      <aside className="w-72 bg-white rounded-2xl shadow-lg p-6 space-y-5 sticky top-32 h-fit">
        <h2 className="text-xl font-semibold">Filter</h2>

        <input
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border"
        >
          <option value="">All Category</option>
          {categories.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <div>
          <label className="text-sm font-medium">Sort Name</label>
          <select
            value={nameOrder}
            onChange={e => setNameOrder(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Duration (h)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minDuration}
              onChange={e =>
                setMinDuration(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-1/2 px-2 py-1 border rounded"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxDuration}
              onChange={e =>
                setMaxDuration(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-1/2 px-2 py-1 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Price Range</label>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={e => setPriceRange([0, Number(e.target.value)])}
            className="w-full"
          />
          <p className="text-xs text-gray-600">
            RM {priceRange[0]} – RM {priceRange[1]}
          </p>
        </div>

        <select
          value={priceSort}
          onChange={e => setPriceSort(e.target.value as any)}
          className="w-full px-3 py-2 rounded-lg border"
        >
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </aside>

      {/* ===== course card ===== */}
      <div className="flex-1 h-[calc(100vh-13rem)] overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div
              key={course.c_id}
              className="bg-white rounded-2xl p-5 shadow-lg flex flex-col justify-between h-75"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold">{course.c_name}</h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.c_description}
                </p>

                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {course.c_category}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                    {course.c_duration}h
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    RM {course.c_price}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() =>
                    router.push(`/enroll_course/subject/${course.c_id}`)
                  }
                  className="flex-1 py-1.5 text-sm rounded-lg border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10 transition"
                >
                  Details
                </button>

                <button
                  onClick={() =>
                    router.push(`/enroll_course/enroll/${course.c_id}`)
                  }
                  className="flex-1 py-1.5 text-sm rounded-lg bg-[#1E3A8A] text-white hover:bg-[#16275B] transition"
                >
                  Enroll
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
