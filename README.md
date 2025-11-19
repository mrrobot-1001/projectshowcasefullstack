# Project Showcase Portal - Full Stack

A complete project showcase portal for Bennett University with full backend integration using Next.js and Supabase.

## 🚀 Quick Start

**Get started in 3 steps:**

1. **Setup Supabase** - Follow `QUICKSTART.md` (10 minutes)
2. **Configure Environment** - Update `.env.local` with your keys (1 minute)
3. **Run Locally** - `npm install && npm run dev` (2 minutes)

📖 **Read [QUICKSTART.md](./QUICKSTART.md) to get started!**

## ⚠️ IMPORTANT: Email Configuration

This project uses **immediate signup without email verification**.

**You MUST disable email confirmations in Supabase:**
- Go to Supabase Dashboard → Authentication → Settings
- **UNCHECK** "Enable email confirmations"
- Save changes

See [EMAIL_SETUP_INFO.md](./EMAIL_SETUP_INFO.md) for details.

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 3 steps (START HERE!)
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed database setup
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built
- **[EMAIL_SETUP_INFO.md](./EMAIL_SETUP_INFO.md)** - Email configuration details

## ✨ Features

- ✅ User signup with @bennett.edu.in validation (no email verification)
- ✅ Team creation with unique codes
- ✅ Project upload with image storage
- ✅ Voting system (max 2 likes per category)
- ✅ Auto-updating leaderboard
- ✅ Admin dashboard with stats
- ✅ Manual leaderboard manipulation
- ✅ Project detail pages
- ✅ Protected routes
- ✅ Full authentication flow

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 🔐 Admin Access

**Default Credentials:**
- Email: `admin@bennett.edu.in`
- Password: Set in `.env.local`

**Capabilities:**
- View all statistics
- See all teams and team codes
- View all projects with IDs
- Manually adjust leaderboard

## 📋 User Features

1. **Sign up** with Bennett email (instant access)
2. **Create team** and get unique code (TEAM-XXXXXXXX)
3. **Upload projects** with images
4. **Vote** for favorites (max 2 per category)
5. **View** detailed project pages
6. **Track** leaderboard rankings

## 🌐 Deployment

Deploy to Vercel in ~15 minutes:

```bash
# Push to GitHub
git add .
git commit -m "Deploy project showcase"
git push origin main

# Import to Vercel and add environment variables
# See DEPLOYMENT_GUIDE.md for details
```

## 🔧 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📖 API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - Login (user/admin)
- `GET /api/projects` - List projects
- `POST /api/projects` - Upload project
- `POST /api/likes` - Like/unlike project
- `GET /api/leaderboard` - Get rankings
- `POST /api/leaderboard` - Admin: update likes
- `GET /api/admin/*` - Admin endpoints

## 🗄️ Database Schema

4 main tables:
- `users` - User profiles
- `teams` - Team management with codes
- `projects` - Project submissions
- `likes` - Voting system

See `SUPABASE_SETUP.md` for complete schema.

## 🎯 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── signup/           # Signup page
│   ├── login/            # Login page
│   ├── upload/           # Upload project (protected)
│   ├── projects/         # Browse & detail pages
│   ├── leaderboard/      # Rankings
│   └── admin/            # Admin dashboard (protected)
├── lib/
│   ├── supabase/         # Supabase clients
│   └── types.ts          # TypeScript types
└── components/           # UI components
```

## 🤝 Contributing

This is a complete full-stack implementation ready for deployment.

## 📄 License

MIT

---

**Ready to deploy?** Start with [QUICKSTART.md](./QUICKSTART.md) 🚀