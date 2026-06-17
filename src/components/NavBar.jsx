"use client";

import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = (
    <>
      <li>
        <Link href={"/"}>Home</Link>
      </li>
      <li>
        <Link href={"/"}>Browse Tasks</Link>
      </li>
      <li>
        <Link href={"/"}>Browse Freelancers</Link>
      </li>
    </>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[rgba(255,220,180,0.12)] bg-[#2C1A0E] backdrop-blur-lg">
      <header className="mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-[rgba(245,230,211,0.7)] hover:text-[#F5E6D3] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#C8845A]" />
            <p className="font-medium text-[#F5E6D3] tracking-tight">
              SkillSwap
            </p>
          </div>
        </div>

        <ul className="hidden items-center gap-8 md:flex [&_a]:text-sm [&_a]:text-[rgba(245,230,211,0.65)] [&_a]:transition-colors hover:[&_a]:text-[#F5E6D3] [&_a]:no-underline">
          {links}
        </ul>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="#"
            className="rounded-md border border-[rgba(245,230,211,0.18)] px-4 py-1.5 text-sm text-[rgba(245,230,211,0.7)] transition-all hover:bg-[rgba(245,230,211,0.06)] hover:text-[#F5E6D3] no-underline"
          >
            Login
          </Link>
          <button className="rounded-md bg-[#C8845A] px-4 py-1.5 text-sm font-medium text-[#2C1A0E] transition-colors hover:bg-[#D9956A]">
            Sign Up
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-[rgba(255,220,180,0.1)] md:hidden">
          <ul className="flex flex-col gap-0.5 px-5 py-3 [&_a]:block [&_a]:py-2.5 [&_a]:text-sm [&_a]:text-[rgba(245,230,211,0.65)] [&_a]:no-underline hover:[&_a]:text-[#F5E6D3]">
            {links}
            <li className="mt-3 flex flex-col gap-2 border-t border-[rgba(255,220,180,0.1)] pt-3">
              <Link
                href="#"
                className="block rounded-md border border-[rgba(245,230,211,0.18)] py-2.5 text-center text-sm text-[rgba(245,230,211,0.7)] transition-all hover:bg-[rgba(245,230,211,0.06)] hover:text-[#F5E6D3]"
              >
                Login
              </Link>
              <button className="w-full rounded-md bg-[#C8845A] py-2.5 text-sm font-medium text-[#2C1A0E] transition-colors hover:bg-[#D9956A]">
                Sign Up
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
