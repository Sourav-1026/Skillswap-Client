import React from "react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function BrowseFreelancersPage() {
  let freelancers = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?role=freelancer`,
      { cache: "no-store" },
    );
    if (res.ok) {
      freelancers = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch freelancers:", error);
  }

  return (
    <main className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2C1A0E] mb-8">
          Browse Freelancers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <div
              key={freelancer._id}
              className="border border-[rgba(44,26,14,0.1)] rounded-2xl p-6 bg-white hover:shadow-lg transition-all flex flex-col items-center text-center"
            >
              {freelancer.image ? (
                <Image
                  src={freelancer.image}
                  alt={freelancer.name}
                  width={100}
                  height={100}
                  unoptimized
                  className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-[#C8845A]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mb-4 bg-[#F5E6D3] flex items-center justify-center text-3xl font-bold text-[#C8845A]">
                  {freelancer.name?.charAt(0) || "F"}
                </div>
              )}
              <h3 className="text-xl font-bold text-[#2C1A0E]">
                {freelancer.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {Array.isArray(freelancer.skills)
                  ? freelancer.skills.length > 0
                    ? freelancer.skills.join(", ")
                    : "No specific skills listed"
                  : freelancer.skills
                    ? freelancer.skills
                    : "No specific skills listed"}
              </p>

              <Link
                href={`/freelancers/${freelancer.email}`}
                className="block w-full bg-white border border-[#C8845A] text-[#C8845A] py-2.5 rounded-lg font-medium hover:bg-[#F5E6D3] transition-colors mt-auto"
              >
                View Profile
              </Link>
            </div>
          ))}
          {freelancers.length === 0 && (
            <div className="col-span-3 text-center text-gray-500 py-12">
              No freelancers found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
