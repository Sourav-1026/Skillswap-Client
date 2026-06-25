"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const Footer = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathName = usePathname();
  if (pathName?.includes("/signin") || pathName?.includes("/signup")) {
    return null; // Don't render the Footer on signin or signup pages
  }

  return (
    <footer className="w-full border-t border-border bg-background px-6 pt-10 pb-6">
      {/* Top grid */}
      <div className="mx-auto grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.75 w-1.75 rounded-full bg-accent" />
            <span className="text-[15px] font-medium tracking-tight text-text-primary">
              SkillSwap
            </span>
          </div>
          <p className="max-w-55 text-[13px] leading-relaxed text-text-secondary">
            Trade skills with others or find the right person to learn from.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-text-primary">
            Navigation
          </span>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                href="/"
                className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tasks"
                className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Browse Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/freelancers"
                className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
              >
                Browse Freelancers
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    href={`/dashboard/${user?.role}`}
                    className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-[13px] text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-text-primary">
            Contact
          </span>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:hello@skillswap.com"
              className="text-[13px] text-text-secondary hover:text-accent transition-colors"
            >
              hello@skillswap.com
            </a>
            <span className="text-[13px] text-text-secondary">
              Dhaka, Bangladesh
            </span>
          </div>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-semibold text-text-primary">
            Follow Us
          </span>
          <div className="flex items-center gap-3">
            {/* X (Twitter) */}
            <a
              href="#"
              aria-label="X (Twitter)"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9v-2.88h2.6V9.84c0-2.57 1.53-3.99 3.87-3.99 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62v1.95h2.86l-.46 2.88h-2.4v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="#"
              aria-label="GitHub"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-border-muted" />

      {/* Copyright */}
      <p className="text-center text-[12px] text-text-muted">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
