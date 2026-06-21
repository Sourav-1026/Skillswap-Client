import React from "react";
import Link from "next/link";

export default async function TopFreelancers() {
  let freelancers = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?role=freelancer`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      freelancers = data.slice(0, 3); // Get top 3
    }
  } catch (error) {
    console.error("Failed to fetch top freelancers:", error);
  }

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto bg-[#F9F6F0] rounded-3xl my-10">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#2C1A0E]">
        Top Freelancers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {freelancers.map((freelancer) => (
          <div
            key={freelancer._id}
            className="border border-[rgba(44,26,14,0.1)] rounded-2xl p-6 bg-white text-center hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-[#2C1A0E] text-2xl font-bold uppercase">
              {freelancer.image ? (
                <img
                  src={freelancer.image}
                  alt={freelancer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                freelancer.name[0]
              )}
            </div>
            <h3 className="text-xl font-bold text-[#2C1A0E] mb-1">
              {freelancer.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4 flex justify-center gap-1">
              ⭐ 4.9 <span className="text-gray-400">(Finished jobs)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {(Array.isArray(freelancer.skills)
                ? freelancer.skills
                : (freelancer.skills || "General").split(",")
              ).map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
            <Link
              href={`/freelancers/${freelancer.email}`}
              className="block w-full border border-[#C8845A] text-[#C8845A] py-2 rounded-lg font-medium hover:bg-[#C8845A] hover:text-[#2C1A0E] transition-colors text-center"
            >
              View Profile
            </Link>
          </div>
        ))}
        {freelancers.length === 0 && (
          <div className="col-span-3 text-center text-gray-500">
            No freelancers found.
          </div>
        )}
      </div>
    </section>
  );
}
