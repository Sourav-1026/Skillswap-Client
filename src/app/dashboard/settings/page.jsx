"use client";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Spinner } from "@heroui/react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setProfile(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const skills = formData.get("skills");
    const portfolio = formData.get("portfolio_links");

    const updates = {
      name: formData.get("name"),
      bio: formData.get("bio"),
      image: formData.get("image"),
      ...(skills !== null && {
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
      ...(portfolio !== null && {
        portfolio_links: portfolio
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${session.user.email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(updates),
        },
      );
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-[#F9F6F0] py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/dashboard/${session.user.role}`}
          className="text-[#C8845A] hover:underline mb-8 inline-block font-medium"
        >
          &larr; Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[rgba(44,26,14,0.1)] shadow-sm">
          <h1 className="text-3xl font-bold text-[#2C1A0E] mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-500 mb-8">
            Update your public profile information.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={profile?.name}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="image"
                defaultValue={profile?.image}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                Bio / About Me
              </label>
              <textarea
                name="bio"
                defaultValue={profile?.bio}
                rows={4}
                placeholder="Tell clients about yourself..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors resize-y"
              ></textarea>
            </div>

            {session.user.role === "freelancer" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    defaultValue={profile?.skills?.join(", ")}
                    placeholder="e.g. React, Node.js, UI/UX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2C1A0E] mb-2">
                    Portfolio Links (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="portfolio_links"
                    defaultValue={profile?.portfolio_links?.join(", ")}
                    placeholder="e.g. https://github.com/my-profile, https://my-site.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-[#C8845A] focus:outline-none focus:ring-1 focus:ring-[#C8845A] transition-colors"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full bg-[#C8845A] text-white py-3 rounded-lg font-bold hover:bg-[#b0724b] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
