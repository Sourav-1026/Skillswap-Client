"use client";

import React, { useState } from "react";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(e.currentTarget));

    const { data, error } = await authClient.signIn.email({
      /**
       * The user email
       */
      email: payload.email,
      /**
       * The user password
       */
      password: payload.password,
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/",
    });

    if (data) {
      console.log("Sign in successful:", data);
      toast.success("Sign in successful!.");
    } else {
      console.error("Sign in error:", error);
      toast.error("Sign in failed. Please try again.");
    }
    // payload => { email, password }
    console.log("Sign in payload:", payload);

    // TODO: wire up to your real sign-in endpoint
    setTimeout(() => setIsSubmitting(false), 1200);
  };

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Left brand panel */}
      <aside className="hidden lg:flex lg:w-[44%] relative overflow-hidden flex-col justify-between p-12 bg-brand-950">
        <svg
          className="pointer-events-none absolute -right-28 -bottom-28 w-[520px] h-[520px]"
          viewBox="0 0 520 520"
          fill="none"
          aria-hidden="true"
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <circle
              key={i}
              cx="260"
              cy="260"
              r={40 + i * 32}
              stroke="var(--color-brand-500)"
              strokeOpacity={0.16 + i * 0.02}
              strokeWidth="1"
            />
          ))}
        </svg>

        <div className="relative z-10">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-text-muted">
            Welcome back
          </span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-text-primary max-w-sm">
            Your next project is waiting.
          </h1>
          <p className="mt-4 text-text-secondary max-w-xs">
            Sign in to manage your work, connect with talent, or pick up where
            you left off.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-text-muted">
          <span className="h-px w-10 bg-border" />
          Trusted by independent talent and the teams that hire them
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="lg:hidden text-xs font-medium tracking-[0.2em] uppercase text-text-muted">
              Welcome back
            </span>
            <h2 className="mt-2 lg:mt-0 font-serif text-3xl lg:text-2xl text-text-primary">
              Sign in to your account
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Good to see you again.
            </p>
          </div>

          <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email */}
            <TextField isRequired name="email" type="email">
              <Label className="text-sm font-medium text-text-primary">
                Email
              </Label>
              <div className="relative mt-1">
                <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <Input
                  placeholder="you@studio.com"
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none data-[invalid=true]:border-red-400 transition-colors"
                />
              </div>
              <FieldError className="mt-1 text-xs text-red-400" />
            </TextField>

            {/* Password */}
            <TextField isRequired name="password">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-text-primary">
                  Password
                </Label>
                <a
                  href="/forgot-password"
                  className="text-xs text-accent hover:text-accent-hover"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-1">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-9 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none data-[invalid=true]:border-red-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={14} />
                  ) : (
                    <FaEye size={14} />
                  )}
                </button>
              </div>
              <FieldError className="mt-1 text-xs text-red-400" />
            </TextField>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="mt-2 w-full justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-text hover:bg-accent-hover disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
              {!isSubmitting && <FaArrowRight size={12} />}
            </Button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-muted">or continue with</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              onPress={() => console.log("Google sign-in")}
              className="w-full justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-text-primary hover:bg-surface-raised"
            >
              <FaGoogle className="text-accent" size={14} />
              Continue with Google
            </Button>
          </Form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-accent hover:text-accent-hover">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
