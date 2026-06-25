import React from "react";
import Link from "next/link";
import Image from "next/image";

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
    // py-20 px-12 md:px-6
    <section className=" max-w-7xl mx-auto  rounded-3xl my-10 ">
      <h2 className="text-3xl font-bold text-center mb-12 text-accent">
        Top Freelancers
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {freelancers.map((freelancer) => (
          <div
            key={freelancer._id}
            className="border border-border rounded-2xl py-2 px-20 md:p-6 bg-surface text-center hover:-translate-y-1 transition-transform duration-300 flex flex-col"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-background border border-border rounded-full overflow-hidden flex items-center justify-center text-primary text-2xl font-bold uppercase">
              {freelancer.image ? (
                <Image
                  src={freelancer.image}
                  alt={freelancer.name}
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                freelancer.name[0]
              )}
            </div>
            <h3 className="text-xl font-bold text-primary mb-1">
              {freelancer.name}
            </h3>
            <p className="text-sm text-secondary mb-4 flex justify-center gap-1">
              ⭐ 4.9 <span className="text-muted">(Finished jobs)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {(Array.isArray(freelancer.skills)
                ? freelancer.skills
                : (freelancer.skills || "General").split(",")
              ).map((skill, i) => (
                <span
                  key={i}
                  className="bg-background border border-border text-secondary px-2 py-1 rounded text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
            <Link
              href={`/freelancers/${freelancer.email}`}
              className="block w-full border border-accent text-accent py-2 rounded-lg font-medium hover:bg-accent hover:text-accent-text transition-colors text-center mt-auto"
            >
              View Profile
            </Link>
          </div>
        ))}
        {freelancers.length === 0 && (
          <div className="col-span-3 text-center text-secondary">
            No freelancers found.
          </div>
        )}
      </div>
    </section>
  );
}
