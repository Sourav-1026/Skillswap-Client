import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "#2C1A0E" }}
    >
      {/* Ambient background rings */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          border: "1px solid rgba(200,132,90,0.08)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          border: "1px solid rgba(200,132,90,0.12)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Glowing orb behind 404 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,132,90,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <p
          className="font-black leading-none mb-2 select-none"
          style={{
            fontSize: "clamp(100px, 22vw, 180px)",
            color: "transparent",
            WebkitTextStroke: "2px rgba(200,132,90,0.35)",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </p>

        {/* Divider line with dot */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "rgba(255,220,180,0.12)" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#C8845A" }}
          />
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "rgba(255,220,180,0.12)" }}
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#F5E6D3" }}>
          Page not found
        </h1>

        {/* Subtext */}
        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: "rgba(245,230,211,0.55)" }}
        >
          The page you're looking for has been moved, deleted, or never existed.
          Check the URL or head back to explore tasks and freelancers.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "#C8845A",
              color: "#2C1A0E",
              minWidth: "160px",
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/tasks"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-[#3A2215] active:scale-95"
            style={{
              border: "1px solid rgba(255,220,180,0.18)",
              color: "#F5E6D3",
              minWidth: "160px",
            }}
          >
            Browse Tasks
          </Link>
        </div>
      </div>

      {/* Bottom label */}
      <p
        className="absolute bottom-8 text-xs tracking-widest uppercase"
        style={{ color: "rgba(245,230,211,0.2)" }}
      >
        SkillSwap
      </p>
    </div>
  );
};

export default NotFoundPage;
