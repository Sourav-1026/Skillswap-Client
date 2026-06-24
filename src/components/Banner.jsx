"use client";

import React from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handlePostATask = () => {
    if (user?.role !== "client") {
      router.push("/signin");
    } else {
      router.push("/dashboard/client/tasks/new");
    }
  };

  const handleBrowseTask = () => {
    if (user?.role !== "freelancer") {
      router.push("/signin");
    } else {
      router.push("/tasks");
    }
  };

  return (
    <div className="relative min-h-screen bg-[url(/world-map.svg)] bg-cover bg-center flex items-center justify-center overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90  to-black/95" />

      {/* Glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-accent/25 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 left-1/4 w-75 h-75 bg-accent/15 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-accent">
          Get your tasks done by skilled freelancers
        </h1>
        <p className="mt-4 text-lg text-text-secondary text-center max-w-xl mx-auto">
          Every great project starts with the right person. We help you find
          them in minutes, not weeks.
        </p>
        <div className="flex gap-4 mt-8 justify-center">
          <Button
            onClick={handlePostATask}
            className="bg-linear-to-r from-accent  to-accent/90 rounded-full px-8 py-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] shadow-accent/40 hover:shadow-accent/60 hover:-translate-y-0.5 transition-all duration-300"
          >
            Post a Task
          </Button>
          <Button
            onClick={handleBrowseTask}
            className="bg-white/5 border border-white/20 backdrop-blur-md rounded-full px-8 py-6 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            Browse Tasks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
