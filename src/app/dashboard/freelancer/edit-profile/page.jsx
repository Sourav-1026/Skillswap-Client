"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Spinner } from "@heroui/react";

export default function FreelancerEditProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    image: "",
    skills: "",
    bio: "",
    hourly_rate: "",
  });

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/signin");
      } else if (session.user.role !== "freelancer") {
        router.push(`/dashboard/${session.user.role}`);
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
        setProfile({
          name: data.name || "",
          image: data.image || "",
          skills: data.skills ? data.skills.join(", ") : "",
          bio: data.bio || "",
          hourly_rate: data.hourly_rate || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      name: profile.name,
      image: profile.image,
      bio: profile.bio,
      hourly_rate: profile.hourly_rate,
      skills: profile.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updatedData),
        },
      );
      if (res.ok) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard/freelancer");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending || loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="text-accent" size="lg" />
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link
        href="/dashboard/freelancer"
        className="text-[#C8845A] hover:underline mb-8 inline-block font-medium"
      >
        &larr; Back to Dashboard
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
        <h1 className="text-3xl font-bold text-[#2C1A0E] mb-2">
          Edit Public Profile
        </h1>
        <p className="text-gray-500 mb-8">
          Update how you appear to clients on SkillSwap.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
              Display Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
              Profile Photo Link (URL)
            </label>
            <input
              type="url"
              value={profile.image}
              onChange={(e) =>
                setProfile({ ...profile, image: e.target.value })
              }
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
              Skills (Comma separated)
            </label>
            <input
              type="text"
              value={profile.skills}
              onChange={(e) =>
                setProfile({ ...profile, skills: e.target.value })
              }
              placeholder="React, Node.js, Graphic Design"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell clients about your experience and expertise..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
              Hourly Rate (USD)
            </label>
            <input
              type="number"
              min="0"
              value={profile.hourly_rate}
              onChange={(e) =>
                setProfile({ ...profile, hourly_rate: e.target.value })
              }
              placeholder="25"
              className="w-full md:w-1/3 rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-[#C8845A] text-white py-3 rounded-lg font-bold hover:bg-[#b0724b] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
