# 📚 SkillSwap — Freelance Micro-Task Platform

**SkillSwap** is a full-stack freelance marketplace where **clients** post small tasks like designing a logo, writing an article, or fixing a bug — and **freelancers** browse, apply, and get hired to complete them. Think of it as a streamlined, one-time-job version of Fiverr or Freelancer.com.

---

## 🌐 Live Demo

https://study-nook-pied.vercel.app

---

## 🚀 Features

### 🔐 Authentication (Email & Google OAuth)

Users sign up and log in via email/password or Google OAuth. Google sign-ups are automatically assigned the **Client** role. Freelancers must register via the email form and manually select the Freelancer option. Powered by **Better Auth**.

### 👥 Role-Based Dashboards

Three distinct roles — **Client**, **Freelancer**, and **Admin** — each with their own protected dashboard, sidebar navigation, and role-specific pages. Wrong-role access redirects automatically.

### 📋 Task Management (Client)

Clients post tasks with a title, category, description, budget, and deadline. Tasks can be edited while still open and deleted if no proposal has been accepted yet. Live status labels: **Open**, **In Progress**, **Completed**.

### 📨 Proposal System (Freelancer)

Freelancers browse open tasks and submit proposals with a bid price, estimated days, and a cover note. Each freelancer can submit only one proposal per task. A full proposals table shows submission status: **Pending / Accepted / Rejected**.

### 💳 Stripe Payment Integration

When a client accepts a proposal, they are redirected to a Stripe Checkout page. Payment must succeed before work begins. On success, the task status updates to **In Progress** and a payment record is saved.

### 📦 Deliverable Submission (Freelancer)

Freelancers track active projects and submit a deliverable URL (GitHub, Google Docs, etc.) via a modal dialog when work is complete. The task status updates to **Completed**.

### ⭐ Reviews & Ratings

Clients can leave a star rating and written review for a freelancer after a task is completed.

### 🛡️ Admin Dashboard

Admins manage all users (block/unblock accounts), oversee every task, and view a full Stripe transaction history. Admin accounts are seeded directly into the database — no registration form.

### 🔍 Search, Filter & Pagination

The Browse Tasks page supports live title search, category filtering (Design, Writing, Development, Marketing, Other), and server-side pagination — 9 tasks per page, with Previous/Next controls that stay correct when filters change.

### 📱 Fully Responsive

Clean, mobile-first UI across all pages — navbar, dashboards, cards, and forms adapt to mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                |
| ------------ | --------------------------------------------------------- |
| **Frontend** | Next.js (App Router), Tailwind CSS, Framer Motion, HeroUI |
| **Backend**  | Node.js / Express                                         |
| **Auth**     | Better Auth (Email + Google OAuth)                        |
| **Database** | MongoDB                                                   |
| **Payments** | Stripe Checkout                                           |

---

## 🗄️ Database Collections

| Collection  | Key Fields                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------ |
| `users`     | name, email, image, role, skills, bio, isBlocked, createdAt                                      |
| `tasks`     | title, category, description, budget, deadline, client_email, status, deliverable_url, createdAt |
| `proposals` | task_id, freelancer_email, proposed_budget, estimated_days, cover_note, status, submitted_at     |
| `payments`  | client_email, freelancer_email, task_id, amount, transaction_id, payment_status, paid_at         |
| `reviews`   | task_id, reviewer_email, reviewee_email, rating, comment, created_at                             |

---

## 📦 Key NPM Packages

**Frontend**

- `next` — App Router framework
- `better-auth` — Authentication client
- `framer-motion` — Page and section animations
- `@heroui/react` — UI component library
- `react-toastify` — Toast notifications

**Backend**

- `express` — HTTP server
- `mongodb` — Database driver
- `stripe` — Payment processing
- `cors` — Cross-origin requests
- `dotenv` — Environment variable management
- `jsonwebtoken` — JWT auth middleware

---

## 🔑 Test Credentials

| Role       | Email                     | Password                  |
| ---------- | ------------------------- | ------------------------- |
| Admin      | admin1@taskhive.com       | admin1@taskhive.com       |
| Freelancer | freelanceruser3@gmail.com | freelanceruser3@gmail.com |
