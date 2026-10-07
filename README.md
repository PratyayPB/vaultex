# Vaultex

**A cloud-based file management application with fine-grained email-based access control and storage analytics.**

[Live Demo](https://vaultex-phi.vercel.app/) · [Report an Issue](https://github.com/PratyayPB/vaultex/issues)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots / Demo](#screenshots--demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Database](#database)
- [Authentication & Authorization](#authentication--authorization)
- [Technical Decisions](#technical-decisions)
- [Known Limitations](#known-limitations)
- [License](#license)
- [Author](#author)

---

## Overview

### What is the project?

Vaultex is a cloud-based file management platform similar to Google Drive, built to allow users to upload, manage, and securely share their files. It offers a personalized dashboard to track storage usage visually and includes dedicated sections for images, videos, documents, and other file types.

### Problem Statement

Managing and sharing files securely with specific individuals often requires complex setups or subscriptions. There is a need for a lightweight, accessible solution that strictly enforces privacy through direct email-based access control.

### Solution

Vaultex solves this by integrating Appwrite's robust backend services to provide OTP-based email authentication and file-level permissions. Users can effortlessly upload files and selectively grant access to specific email addresses, ensuring complete control over their digital assets.

### Project Goals

- Deliver a clean, highly responsive, and user-friendly interface.
- Ensure strict, fine-grained access control for file sharing.
- Provide real-time, visual storage analytics.

---

## Key Features

- **File Management** — Upload, view, rename, and delete images, videos, documents, and executables.
- **Secure Sharing** — File owners can grant access to specific authorized emails.
- **Personalized Dashboard** — Tracks total storage usage with visual analytics charts categorized by media type.
- **Smart File Organization** — Sort files by name, size, or date, with dedicated pages for different formats.
- **Authentication** — Secure, passwordless OTP-based email authentication.

---

## Screenshots / Demo

### Application Preview

![Login / OTP Page](https://ik.imagekit.io/ulycoljug/Portfolio-resources/vaultex/Screenshot%202026-02-18%20185038.png)
![Dashboard Overview](https://ik.imagekit.io/ulycoljug/Portfolio-resources/vaultex/Screenshot%202026-02-22%20165830.png)
![File Management](https://ik.imagekit.io/ulycoljug/Portfolio-resources/vaultex/Screenshot%202026-02-22%20165814.png)
![Secure Sharing](https://ik.imagekit.io/ulycoljug/Portfolio-resources/vaultex/Screenshot%202026-02-22%20165745.png)

### Demo

**Live Application:** [https://vaultex-phi.vercel.app/](https://vaultex-phi.vercel.app/)

---

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Recharts

### Backend (BaaS)

- Appwrite (Authentication, Database, Storage)

### Deployment

- Vercel

---

## Architecture

Vaultex follows a modern serverless architecture utilizing a Backend-as-a-Service (BaaS) model.

- **Client Layer:** Built with Next.js App Router for optimal Server-Side Rendering (SSR) and Client-Side Rendering (CSR). Tailwind CSS and shadcn/ui handle the UI design.
- **Backend Layer:** Appwrite manages all backend operations. It handles OTP authentication, stores file metadata in its NoSQL document database, and manages actual file binaries in its storage buckets.
- **Data Flow:** When a user uploads a file, the binary is sent to Appwrite Storage. Upon success, a metadata document (including file URL, size, owner, and shared users) is created in the Appwrite Database. Access control lists (ACLs) are updated dynamically when a user shares a file.

---

## Project Structure

```text
vaultex/
├── app/
│   ├── (auth)/        # Authentication routes (Sign in, Sign up, OTP)
│   └── (root)/        # Main application routes (Dashboard, Media pages)
├── components/
│   ├── ui/            # shadcn/ui reusable components
│   └── ...            # Custom components (AuthForm, Sidebar, FileUploader)
├── lib/
│   ├── actions/       # Server actions (file and user management)
│   └── appwrite/      # Appwrite configuration and client setup
├── types/             # Global TypeScript definitions
├── public/            # Static assets
├── .env.local
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js
- npm
- Git
- Appwrite project setup (Cloud or Self-hosted)

### Clone the Repository

```bash
git clone https://github.com/PratyayPB/vaultex.git
cd vaultex
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

### Prerequisites

- Node.js
- npm
- Git
- Appwrite project setup (Cloud or Self-hosted)

### Clone the Repository

```bash
git clone https://github.com/PratyayPB/vaultex.git
cd vaultex
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Application will run at: `http://localhost:3000`

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=
```

**Never commit real secrets, API keys, credentials, or private tokens to the repository.**

---

## Usage

1. **Authentication:** Enter your email address. You will receive an OTP. Enter the OTP to securely log in.
2. **Dashboard:** View your overall storage usage, categorized by file type.
3. **Upload & Manage:** Navigate to any category or use the main uploader to add files. You can rename or delete files through the file card's action menu.
4. **Share:** Click the share icon on any of your files and enter the authorized user's email address. Only those individuals will be able to access the file.

---

## Database

Vaultex uses Appwrite's database service to manage metadata.

### Core Entities

| Entity           | Purpose                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------ |
| Users Collection | Stores user profile data (`fullName`, `email`, `avatar`, `accountId`)                      |
| Files Collection | Stores metadata for uploaded files (`type`, `name`, `url`, `size`, `owner`, `users`, etc.) |

---

## Authentication & Authorization

### Authentication

- Passwordless OTP (One-Time Password) sent via email through Appwrite Auth.
- Secure session management managed directly by Appwrite SDK.

### Authorization

- File ownership is established upon upload.
- Document-level security: The file owner can modify the `users` array in the file document.
- Appwrite permissions dynamically restrict read/write access so unauthorized users cannot query or view the file.

---

## Technical Decisions

- **Next.js App Router:** Chosen to leverage advanced routing and server components, reducing the client-side JavaScript bundle and improving performance.
- **Appwrite BaaS:** Selected over setting up a custom backend to rapidly accelerate development while ensuring robust security and scalable storage capabilities out-of-the-box.
- **shadcn/ui & Tailwind CSS:** Provided a highly customizable, accessible, and unstyled foundation that allowed for rapid iteration of a clean, modern interface.
- **Recharts:** Used for building lightweight, responsive, and declarative charts for the dashboard analytics.

---

## Known Limitations

- **Max File Upload Limit:** Currently capped at **500MB** per file upload.

---

## License

This project is licensed under the **MIT License**.

---

## Author

**Pratyay Pratim Borah**

- GitHub: [@PratyayPB](https://github.com/PratyayPB)
- LinkedIn: [Pratyay Pratim Borah](https://www.linkedin.com/in/pratyaypratimborah/)
- Portfolio: [portfolio-pratyay.vercel.app](https://portfolio-pratyay.vercel.app/)
