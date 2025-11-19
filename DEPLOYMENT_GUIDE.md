# Project Showcase Portal - Deployment Guide

## 🚀 Quick Deployment Guide

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase account (free)

---

## Step 1: Supabase Setup (Backend)

### 1.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Fill in:
   - Project name: `project-showcase`
   - Database password: (save this!)
   - Region: Choose nearest
5. Wait for project to be created (~2 minutes)

### 1.2 Get API Keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep secret!)

### 1.3 Create Database Tables
1. Go to **SQL Editor**
2. Copy and paste the SQL from `SUPABASE_SETUP.md` (sections 1-6)
3. Run each section separately
4. Verify tables are created in **Database** → **Tables**

### 1.4 Setup Storage
1. Go to **Storage**
2. Click "Create bucket"
3. Name: `project-images`
4. **Make it Public** ✓
5. Click "Create"
6. Go to bucket → Policies → Add the storage policies from `SUPABASE_SETUP.md`

### 1.5 Configure Email Auth
1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Settings**:
   - **DISABLE email confirmations** (important!)
   - Site URL: `http://localhost:3000` (change later)
   - This allows immediate signup without email verification
   - Domain validation (@bennett.edu.in) happens at app level

---

## Step 2: Vercel Deployment (Frontend)

### 2.1 Push to GitHub
```bash
git add .
git commit -m "Initial commit with backend"
git push origin main
```

### 2.2 Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Wait for deployment (~2 minutes)

### 2.3 Add Environment Variables
1. In Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables (from Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

3. Click "Save"
4. Go to **Deployments** → Click ⋯ on latest → "Redeploy"

### 2.4 Update Supabase URLs
1. Copy your Vercel URL (e.g., `https://project-showcase-xyz.vercel.app`)
2. Go to Supabase → **Authentication** → **URL Configuration**
3. Update:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## Step 3: Testing

### Test Locally First
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and test:
- ✅ Signup with @bennett.edu.in email
- ✅ Login immediately (no email verification)
- ✅ Create team
- ✅ Upload project
- ✅ Like projects (max 2 per category)
- ✅ Admin login (admin@bennett.edu.in)

### Test Production
1. Visit your Vercel URL
2. Repeat all tests above
3. Check email confirmations work

---

## 📋 Features Implemented

### Authentication
- ✅ Email signup (only @bennett.edu.in)
- ✅ No email verification required (immediate access)
- ✅ Login/Logout
- ✅ Protected routes (upload, admin)
- ✅ Hardcoded admin credentials

### User Features
- ✅ User registration with name, phone
- ✅ Optional team creation during signup
- ✅ Unique team code generation
- ✅ Team member management

### Project Upload
- ✅ Protected upload page (login required)
- ✅ Upload with team code verification
- ✅ Image upload to Supabase Storage
- ✅ Support for GitHub & demo URLs
- ✅ Categories and tags

### Voting System
- ✅ Like/unlike projects
- ✅ Max 2 likes per category per user
- ✅ Real-time like count updates
- ✅ Leaderboard based on likes

### Admin Dashboard
- ✅ Admin-only access
- ✅ View all teams
- ✅ View all projects
- ✅ Statistics overview
- ✅ Manually manipulate leaderboard

### Project Pages
- ✅ Browse all projects
- ✅ Filter by category
- ✅ Search functionality
- ✅ Click to view project details
- ✅ Leaderboard view

---

## 🔐 Admin Access

**Admin Credentials** (set in environment variables):
- Email: `admin@bennett.edu.in`
- Password: Your `ADMIN_PASSWORD` from env

### Admin Capabilities:
1. View dashboard stats
2. See all teams and team codes
3. View all projects with IDs
4. Manually adjust project likes
5. Monitor system activity

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── projects/          # Project CRUD
│   │   ├── likes/             # Like/unlike
│   │   ├── leaderboard/       # Leaderboard + admin update
│   │   └── admin/             # Admin endpoints
│   ├── signup/                # Signup page
│   ├── login/                 # Login page
│   ├── upload/                # Upload project (protected)
│   ├── projects/              # Browse projects
│   ├── leaderboard/           # Leaderboard view
│   └── admin/                 # Admin dashboard (protected)
├── lib/
│   ├── supabase/              # Supabase clients
│   └── types.ts               # TypeScript types
├── components/
│   └── ui/                    # UI components
└── middleware.ts              # Auth middleware
```

---

## 🗄️ Database Schema

### Tables:
1. **users** - User profiles
2. **teams** - Team information with unique codes
3. **projects** - Project submissions
4. **likes** - User likes (with category tracking)

### Functions:
- `increment_likes(project_id)` - Safely increment
- `decrement_likes(project_id)` - Safely decrement

---

## 🔄 User Flows

### 1. New User Signup & Team Creation
```
1. Visit /signup
2. Fill name, email (@bennett.edu.in), phone, password
3. Check "Participate in showcase"
4. Enter team name and members
5. Submit → Account created immediately
6. Login and get unique team code (e.g., TEAM-A1B2C3D4)
```

### 2. Project Upload
```
1. Login → Redirected to /projects
2. Click Upload / Visit /upload
3. Fill project details
4. Enter team code
5. Upload image
6. Submit → Project visible on /projects
```

### 3. Voting
```
1. Browse projects on /projects
2. Click heart icon to like
3. Can like max 2 projects per category
4. Leaderboard updates automatically
```

### 4. Admin Management
```
1. Login with admin credentials
2. Access /admin
3. View stats, teams, projects
4. Copy project ID from Projects tab
5. Go to Leaderboard tab
6. Paste ID and set new likes count
7. Submit → Leaderboard updated
```

---

## ⚙️ Environment Variables

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=SecurePass123!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel)
Same as above, but change:
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: Can't login
- ✅ Check email is @bennett.edu.in
- ✅ Verify password is correct
- ✅ Ensure email confirmations are DISABLED in Supabase
- ✅ Check Supabase Auth logs

### Issue: Can't upload project
- ✅ Ensure logged in
- ✅ Verify team code is correct
- ✅ Check storage bucket is public
- ✅ Image size < 6MB

### Issue: Likes not working
- ✅ Check database functions exist
- ✅ Verify RLS policies
- ✅ Check you haven't liked 2 already in category

### Issue: Admin can't update leaderboard
- ✅ Verify admin credentials in env
- ✅ Use correct project ID
- ✅ Check API logs in Vercel

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Projects
- `GET /api/projects` - List projects (with filters)
- `POST /api/projects` - Upload project
- `GET /api/projects/[id]` - Get project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Likes
- `POST /api/likes` - Like/unlike project
- `GET /api/likes?project_id=x` - Check if liked

### Leaderboard
- `GET /api/leaderboard?category=x` - Get leaderboard
- `POST /api/leaderboard` - Admin: update likes

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/teams` - Get all teams
- `GET /api/admin/projects` - Get all projects

---

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Email domain validation (@bennett.edu.in)
- ✅ Protected routes with middleware
- ✅ Service role key never exposed to client
- ✅ Admin credentials in env (not hardcoded)
- ✅ HTTPS enforced in production
- ✅ Input validation and sanitization

---

## 📱 Mobile Responsive

All pages are fully responsive:
- ✅ Mobile-first design
- ✅ Touch-friendly UI
- ✅ Optimized for all screen sizes

---

## 🚀 Performance

- ✅ Next.js App Router (RSC)
- ✅ Image optimization
- ✅ Database indexes
- ✅ Efficient queries
- ✅ Client-side caching

---

## 📞 Support

For detailed Supabase setup, see `SUPABASE_SETUP.md`

---

## ✅ Pre-Launch Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] Supabase tables created
- [ ] Storage bucket created and public
- [ ] Auth redirect URLs updated
- [ ] Email confirmations DISABLED in Supabase
- [ ] Test signup flow (should work immediately)
- [ ] Test upload flow
- [ ] Test voting (2 per category)
- [ ] Test admin dashboard
- [ ] Change admin password from default

---

## 🎉 You're All Set!

Your Project Showcase Portal is now live at:
**https://your-app.vercel.app**

Users can:
1. Sign up with Bennett email
2. Create teams
3. Upload projects
4. Vote for favorites
5. View leaderboard

You can:
1. Monitor everything via admin dashboard
2. Adjust leaderboard manually if needed
3. View all teams and projects

Happy showcasing! 🚀
