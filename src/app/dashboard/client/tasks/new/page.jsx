"use client";

import PostTaskForm from "@/components/dashboard/PostTaskForm";
import React from "react";

const ClientNewTaskPostPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-10">
      <PostTaskForm />
    </div>
  );
};

export default ClientNewTaskPostPage;
