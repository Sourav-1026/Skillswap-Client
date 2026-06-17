"use client";

import React, { useState } from "react";
import {
  Form,
  TextField,
  Label,
  Input,
  Description,
  FieldError,
  RadioGroup,
  Radio,
  Button,
  Avatar,
} from "@heroui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaBriefcase,
  FaLaptopCode,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = Object.fromEntries(new FormData(e.currentTarget));

    const { data, error } = await authClient.signUp.email({
      name: "John Doe", // required
      email: "john.doe@example.com", // required
      password: "password1234", // required
      image: "https://example.com/image.png",
      accountType: "freelancer", // or "client"
      callbackURL: "https://example.com/callback",
    });
    // payload => { imageUrl, name, email, password, accountType }
    console.log("Sign up payload:", payload);

    // TODO: wire up to your real sign-up endpoint
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
            Join the studio
          </span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-text-primary max-w-sm">
            Good work deserves a good home.
          </h1>
          <p className="mt-4 text-text-secondary max-w-xs">
            One account, two ways in — hire skilled freelancers, or find your
            next project.
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
              Join the studio
            </span>
            <h2 className="mt-2 lg:mt-0 font-serif text-3xl lg:text-2xl text-text-primary">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Takes less than a minute.
            </p>
          </div>

          <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Avatar preview + image URL */}
            <div className="flex items-center gap-4">
              <Avatar className="size-14 shrink-0 border border-border bg-surface">
                {imageUrl ? (
                  <Avatar.Image src={imageUrl} alt="Profile preview" />
                ) : null}
                <Avatar.Fallback>
                  <FaUser className="text-text-muted" />
                </Avatar.Fallback>
              </Avatar>

              <TextField name="imageUrl" type="url" className="flex-1">
                <Label className="text-sm font-medium text-text-primary">
                  Profile image URL
                </Label>
                <div className="relative mt-1">
                  <FaImage className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                  <Input
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none transition-colors"
                  />
                </div>
                <Description className="mt-1 text-xs text-text-muted">
                  Optional — paste a link to your photo
                </Description>
              </TextField>
            </div>

            {/* Name */}
            <TextField
              isRequired
              name="name"
              validate={(value) =>
                value.length < 2 ? "Enter your name" : null
              }
            >
              <Label className="text-sm font-medium text-text-primary">
                Full name
              </Label>
              <div className="relative mt-1">
                <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <Input
                  placeholder="Jordan Avery"
                  className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-accent focus-visible:outline-none data-[invalid=true]:border-red-400 transition-colors"
                />
              </div>
              <FieldError className="mt-1 text-xs text-red-400" />
            </TextField>

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
            {/* validate={(value) =>
                value.length < 8 ? "At least 8 characters" : null
              } */}

            <TextField isRequired name="password">
              <Label className="text-sm font-medium text-text-primary">
                Password
              </Label>
              <div className="relative mt-1">
                <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            {/* Role selection */}
            <RadioGroup name="accountType" defaultValue="client">
              <Label className="text-sm font-medium text-text-primary">
                I want to sign up as
              </Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Radio
                  value="client"
                  className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 cursor-pointer transition-colors hover:border-border data-[selected=true]:border-accent data-[selected=true]:bg-surface-raised"
                >
                  <div className="flex w-full items-center justify-between">
                    <FaBriefcase className="text-accent" />
                    <Radio.Control className="flex size-4 items-center justify-center rounded-full border border-border">
                      <Radio.Indicator className="size-2 rounded-full bg-accent" />
                    </Radio.Control>
                  </div>
                  <Radio.Content>
                    <Label className="text-sm font-medium text-text-primary">
                      Client
                    </Label>
                    <Description className="text-xs text-text-secondary">
                      Post jobs and hire talent
                    </Description>
                  </Radio.Content>
                </Radio>

                <Radio
                  value="freelancer"
                  className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 cursor-pointer transition-colors hover:border-border data-[selected=true]:border-accent data-[selected=true]:bg-surface-raised"
                >
                  <div className="flex w-full items-center justify-between">
                    <FaLaptopCode className="text-accent" />
                    <Radio.Control className="flex size-4 items-center justify-center rounded-full border border-border">
                      <Radio.Indicator className="size-2 rounded-full bg-accent" />
                    </Radio.Control>
                  </div>
                  <Radio.Content>
                    <Label className="text-sm font-medium text-text-primary">
                      Freelancer
                    </Label>
                    <Description className="text-xs text-text-secondary">
                      Find work, get paid
                    </Description>
                  </Radio.Content>
                </Radio>
              </div>
            </RadioGroup>

            <Button
              type="submit"
              variant="primary"
              isDisabled={isSubmitting}
              className="mt-2 w-full justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-text hover:bg-accent-hover disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <a href="/sign-in" className="text-accent hover:text-accent-hover">
              Sign in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
