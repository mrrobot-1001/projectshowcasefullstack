# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Setup Supabase (10 minutes)

1. **Create Account**: Go to [supabase.com](https://supabase.com) → Sign Up
2. **New Project**: Create project named "project-showcase"
3. **Get Keys**: Settings → API → Copy:
   - URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

4. **Run SQL**: Go to SQL Editor → Copy from `SUPABASE_SETUP.md` → Run sections 1-6

5. **Create Storage**: Storage → New bucket → Name: `project-images` → Make Public

6. **Configure Auth**: Authentication → Settings → **DISABLE email confirmations** (important!)

### Step 2: Configure Environment (1 minute)

Update `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url-here>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-here>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key-here>
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=YourSecurePassword123!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Locally (2 minutes)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Visit http://localhost:3000
```

## ✅ Test Checklist

- [ ] Visit `/signup` → Create account with @bennett.edu.in email
- [ ] Login immediately (no email verification needed)
- [ ] Create team → Note the team code (TEAM-XXXXXXXX)
- [ ] Visit `/upload`
- [ ] Upload a project with your team code
- [ ] Browse `/projects` → Find your project
- [ ] Click project → View details
- [ ] Like the project (heart icon)
- [ ] Visit `/leaderboard` → See your project ranked
- [ ] Login as admin (admin@bennett.edu.in)
- [ ] Visit `/admin` → View dashboard

## 🌐 Deploy to Production (5 minutes)

### Push to GitHub
```bash
git add .
git commit -m "Add backend and deployment"
git push origin main
```

### Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import your repo
3. Add Environment Variables (same as .env.local but change URL)
4. Deploy!

### Update Supabase URLs
1. Copy your Vercel URL
2. Supabase → Auth → URL Configuration
3. Add: `https://your-app.vercel.app`

## 🎯 Admin Login

**Credentials:**
- Email: `admin@bennett.edu.in`
- Password: (the one you set in env)

**Can do:**
- View all stats
- See all teams and team codes
- View all projects with IDs
- Manually adjust leaderboard

## 📚 Documentation

- **Full Setup**: Read `SUPABASE_SETUP.md`
- **Deployment**: Read `DEPLOYMENT_GUIDE.md`
- **Implementation**: Read `IMPLEMENTATION_SUMMARY.md`

## 🐛 Common Issues

**Issue:** Can't sign up
- Solution: Make sure email ends with @bennett.edu.in and email confirmations are DISABLED in Supabase

**Issue:** Can't upload project
- Solution: Make sure you're logged in and have correct team code

**Issue:** Image won't upload
- Solution: Check storage bucket exists and is public

**Issue:** Admin login not working
- Solution: Verify ADMIN_EMAIL and ADMIN_PASSWORD in .env.local

## 📞 Need Help?

Check the documentation files:
1. `SUPABASE_SETUP.md` - Database setup
2. `DEPLOYMENT_GUIDE.md` - Full deployment guide
3. `IMPLEMENTATION_SUMMARY.md` - What was built

## 🎉 You're Ready!

Everything is set up and ready to go. Just follow the 3 steps above and you'll have a fully functional project showcase portal!

**Time to fully deploy: ~15 minutes**

Enjoy! 🚀
