import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FreelancerProfilePage({ params }) {
  const { email } = await params;
  let freelancer = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${email}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      freelancer = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch freelancer details:", error);
  }

  if (!freelancer || freelancer.role !== "freelancer") {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Freelancer not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/freelancers"
          className="text-[#C8845A] hover:underline mb-8 inline-block font-medium"
        >
          &larr; Back to Browse Freelancers
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 flex flex-col items-center md:w-1/3">
            {freelancer.image ? (
              <img
                src={freelancer.image}
                alt={freelancer.name}
                className="w-48 h-48 rounded-full mb-4 object-cover border-4 border-[#F5E6D3]"
              />
            ) : (
              <div className="w-48 h-48 rounded-full mb-4 bg-[#F5E6D3] flex items-center justify-center text-6xl font-bold text-[#C8845A]">
                {freelancer.name?.charAt(0) || "F"}
              </div>
            )}
            <div className="text-center w-full">
              <h1 className="text-3xl font-bold text-[#2C1A0E] break-words">
                {freelancer.name}
              </h1>
              <p className="text-gray-500 mt-1 break-words">
                {freelancer.email}
              </p>
              {freelancer.hourly_rate && (
                <p className="text-[#C8845A] font-bold mt-2 text-lg">
                  ${freelancer.hourly_rate} / hr
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#2C1A0E] mb-4">About Me</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-8">
              {freelancer.bio || "This freelancer has not provided a bio yet."}
            </p>

            <h3 className="text-xl font-bold text-[#2C1A0E] mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {freelancer.skills && freelancer.skills.length > 0 ? (
                freelancer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-[#F5E6D3] text-[#C8845A] px-4 py-1.5 rounded-full text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>

            <h3 className="text-xl font-bold text-[#2C1A0E] mb-4">
              Portfolio Links
            </h3>
            <div className="flex flex-col gap-2">
              {freelancer.portfolio_links &&
              freelancer.portfolio_links.length > 0 ? (
                freelancer.portfolio_links.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C8845A] hover:underline break-all"
                  >
                    {link}
                  </a>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  No portfolio links provided
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
