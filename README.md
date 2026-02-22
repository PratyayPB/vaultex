# Vaultex

A cloud-based file management application similar to Google Drive.  
Vaultex allows users to upload, manage, and securely share files with fine-grained email-based access control.

🌐 **Live Deployment**: https://vaultex-phi.vercel.app/

---

## 🚀 Features

### 📁 File Management
- Upload and host files (images, videos, documents, executables, and other popular formats)
- Update file details
- Delete files
- View files directly within the app
- Display file owner on each file card

### 🔐 Secure Sharing
- Email-based access control
- File owner can add specific emails to grant access
- Only authorized users with approved emails can access shared files

### 📊 Personalized Dashboard
- Total storage usage tracking
- Visual storage analytics (Images, Videos, Documents, Others)
- Charts powered by Recharts
- Recently uploaded / recently updated files overview

### 🧠 Smart File Organization
- Sort files by:
  - Alphabetical order
  - File name
  - File size
  - Date created
- Dedicated pages for:
  - Images
  - Videos
  - Documents
  - Other file types

### ✉️ Authentication
- OTP-based email authentication
- Secure login using Appwrite Auth

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- TypeScript
- React
- Tailwind CSS
- shadcn/ui
- Recharts (for storage analytics)

### Backend (BaaS)
- Appwrite
  - Authentication
  - Database
  - Storage
  - Access Control

### Deployment
- Vercel

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/PratyayPB/vaultex.git
cd vaultex
```

### 2. Install dependencies
```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_ID=
```

⚠️ Do not commit your environment variables.

---

## ▶️ Running the Project

```bash
npm run dev
```

App will run at:
```
http://localhost:3000
```

---

## 🧠 How It Works

### 1️⃣ Authentication
- User enters email
- OTP is sent via Appwrite
- User verifies OTP to authenticate

### 2️⃣ File Upload
- File is uploaded to Appwrite Storage
- Metadata is stored in Appwrite Database
- Owner information is attached to file document

### 3️⃣ Sharing System
- File owner adds authorized emails
- Access control rules are updated in Appwrite
- Only specified users can access shared files

### 4️⃣ Dashboard Analytics
- Fetch all user files
- Categorize by media type
- Calculate storage usage
- Display dynamic charts using Recharts

---

## 📊 Key Highlights

- Fine-grained access control using Appwrite permissions
- Real-time storage analytics
- Clean and responsive UI
- Modular component structure
- Strong TypeScript usage
- Scalable architecture (BaaS-driven backend)


---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Pratyay**  
Computer Science Engineering Student  
GitHub: https://github.com/PratyayPB
