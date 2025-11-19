# Vercel Environment Variables Setup

## Quick Setup

1. **Get your Supabase Service Role Key:**
   - Go to your Supabase project: https://supabase.com/dashboard/project/vhjazlfchdhveeosfmfl
   - Go to Settings → API
   - Copy the `service_role` secret key (⚠️ Keep this secret!)

2. **Add to Vercel:**
   - Go to your Vercel project settings
   - Navigate to Settings → Environment Variables
   - Add each variable below

## Required Environment Variables

### Method 1: Manual Entry in Vercel Dashboard

Add these one by one in Vercel:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vhjazlfchdhveeosfmfl.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoamF6bGZjaGRodmVlb3NmbWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTcyNDMsImV4cCI6MjA3OTEzMzI0M30.mQHB0eqp_8Mvyk3KpVRLJ-aDp77Syw4f7nU5GrsDPko` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `[Your Service Role Key from Supabase]` | Production, Preview, Development |
| `ADMIN_EMAIL` | `admin@bennett.edu.in` | Production, Preview, Development |
| `ADMIN_PASSWORD` | `AdminSecure@2024` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://projectshowcasefullstack.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-preview-url.vercel.app` | Preview |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Development |

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://vhjazlfchdhveeosfmfl.supabase.co
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key
# Select: Production, Preview, Development

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your service role key from Supabase
# Select: Production, Preview, Development

vercel env add ADMIN_EMAIL
# Paste: admin@bennett.edu.in
# Select: Production, Preview, Development

vercel env add ADMIN_PASSWORD
# Paste: AdminSecure@2024
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_APP_URL
# For Production: https://projectshowcasefullstack.vercel.app
# For Preview: Use preview URL
# For Development: http://localhost:3000
```

## ⚠️ CRITICAL: Get Service Role Key

**Where to find it:**
1. Go to: https://supabase.com/dashboard/project/vhjazlfchdhveeosfmfl/settings/api
2. Scroll to "Project API keys"
3. Find the `service_role` key (marked as secret)
4. Click "Reveal" and copy the key
5. **DO NOT** share this key publicly - it bypasses Row Level Security!

## After Adding Variables

1. **Redeploy your project:**
   ```bash
   vercel --prod
   ```
   
   Or trigger a new deployment by:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

2. **Update Supabase Auth URLs:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Redirect URLs":
     - `https://projectshowcasefullstack.vercel.app/**`
     - `https://*.vercel.app/**` (for preview deployments)

3. **Disable Email Confirmations:**
   - Go to Supabase Dashboard → Authentication → Settings
   - **UNCHECK** "Enable email confirmations"
   - Save changes

## Verify Setup

After deployment, check:
- [ ] Can access the homepage
- [ ] No middleware errors
- [ ] Can sign up with @bennett.edu.in email
- [ ] Can log in
- [ ] Can upload projects
- [ ] Admin dashboard works with credentials

## Troubleshooting

**Still getting MIDDLEWARE_INVOCATION_FAILED?**
- Make sure `NEXT_PUBLIC_SUPABASE_URL` is set
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Redeploy after adding variables
- Check Vercel deployment logs for specific errors

**Environment variables not working?**
- Make sure they're added to the correct environment (Production, Preview, Development)
- Redeploy after adding variables
- Check for typos in variable names (they're case-sensitive!)

## Quick Copy-Paste for Vercel Dashboard

```
NEXT_PUBLIC_SUPABASE_URL=https://vhjazlfchdhveeosfmfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoamF6bGZjaGRodmVlb3NmbWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTcyNDMsImV4cCI6MjA3OTEzMzI0M30.mQHB0eqp_8Mvyk3KpVRLJ-aDp77Syw4f7nU5GrsDPko
SUPABASE_SERVICE_ROLE_KEY=[GET_FROM_SUPABASE_DASHBOARD]
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=AdminSecure@2024
NEXT_PUBLIC_APP_URL=https://projectshowcasefullstack.vercel.app
```

⚠️ **Remember to replace `[GET_FROM_SUPABASE_DASHBOARD]` with your actual service role key!**
