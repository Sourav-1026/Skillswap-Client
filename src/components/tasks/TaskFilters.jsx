"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );

  const categories = [
    "All",
    "Design",
    "Writing",
    "Development",
    "Marketing",
    "Other",
  ];

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set("search", search);
    else params.delete("search");

    if (category !== "All") params.set("category", category);
    else params.delete("category");

    params.set("page", "1"); // Reset to page 1 on filter
    router.push(`/tasks?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-[rgba(44,26,14,0.1)] shadow-sm">
      <input
        type="text"
        placeholder="Search task title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-hidden focus:border-[#C8845A] text-black"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-hidden focus:border-[#C8845A]"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        onClick={handleFilter}
        className="bg-[#C8845A] text-[#2C1A0E] px-8 py-2 rounded-md font-semibold hover:bg-[#b0724b] transition-colors"
      >
        Filter
      </button>
    </div>
  );
}
