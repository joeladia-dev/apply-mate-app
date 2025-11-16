🚀 ApplyMate – Job Tracking App

😎 Created By : Joel G. Adia

A modern job-tracking tool built with React, TypeScript, Vite, Supabase, shadcn/ui, and React Query.

ApplyMate helps job hunters stay organized by tracking applications, progress, companies, notes, and deadlines — wrapped in a clean and responsive UI powered by shadcn/ui, Radix, and TailwindCSS.

📦 Tech Stack

Frontend

⚛️ React (18)

🧩 TypeScript

⚡ Vite

🎨 TailwindCSS + shadcn/ui

🎛 Radix UI components

⛓ React Router

📅 date-fns

📊 Recharts

🌙 next-themes (dark mode)

State & Data

🔥 React Query (TanStack Query)

🧰 Zod for validation

🔐 Supabase (Auth + Database)

🔑 Crypto-JS (client-side encryption)

Developer Tools

🧹 ESLint + TypeScript ESLint

🛠 Tailwind Merge

🧪 TypeScript support

⚙️ SWC for fast builds

🚀 Getting Started
1. Clone the Repo
git clone https://github.com/your-username/applymate.git
cd applymate

2. Install Dependencies
npm install

3. Set Up Environment Variables

Create a .env.local (or .env) file:

VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key


(Optional: other keys like encryption secrets, feature flags, etc.)

▶️ Running the App
Start Development Server
npm run dev

Build for Production
npm run build

Preview Production Build
npm run preview

🧩 Key Features (Current or Planned)
✅ Implemented

🔐 User login (Supabase Auth)

👤 Profile & Avatar (Google / Email-based fallback)

📄 Add job applications / Edit Job Applications / Delete Job Applications

📌 Track status (Applied, Interviewing, Offer, Rejected/Decline)

📝 Notes per job

📅 Date tracking (applied date, follow-up date, deadlines)