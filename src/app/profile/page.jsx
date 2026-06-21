"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEdit, FiUser, FiMail, FiDollarSign, FiTag } from "react-icons/fi";

export default function UnifiedProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else {
        fetchProfile(session.user.email);
      }
    }
  }, [session, isPending, router]);

  const fetchProfile = async (email) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${email}`,
      );
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading)
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        Loading profile...
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex items-center justify-center">
        Profile not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#2C1A0E]">My Profile</h1>
          {session.user.role === "freelancer" && (
            <Link
              href="/dashboard/freelancer/edit-profile"
              className="flex items-center gap-2 bg-[#C8845A] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#b0724b] transition-colors"
            >
              <FiEdit /> Edit Profile
            </Link>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[rgba(44,26,14,0.1)] flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-[#F9F6F0] shadow-md">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#C8845A] text-white text-4xl font-bold">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-[#2C1A0E]">
              {profile.name}
            </h2>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C8845A] mt-1 mb-4">
              {profile.role}
            </p>

            <div className="w-full flex flex-col gap-3 text-left bg-[#F9F6F0] p-4 rounded-xl">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <FiMail className="text-[#C8845A]" />
                <span className="truncate">{profile.email}</span>
              </div>
              {profile.role === "freelancer" && profile.hourly_rate && (
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <FiDollarSign className="text-[#C8845A]" />
                  <span>${profile.hourly_rate} / hr</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#2C1A0E] flex items-center gap-2 mb-3">
                <FiUser className="text-[#C8845A]" /> About Me
              </h3>
              <p className="text-gray-600 leading-relaxed bg-[#F9F6F0] p-5 rounded-xl border border-gray-100">
                {profile.bio || "No bio provided yet."}
              </p>
            </div>

            {profile.role === "freelancer" && (
              <div>
                <h3 className="text-lg font-bold text-[#2C1A0E] flex items-center gap-2 mb-3">
                  <FiTag className="text-[#C8845A]" /> Skills
                </h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-[#2C1A0E] text-[#F9F6F0] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
