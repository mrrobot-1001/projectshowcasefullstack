# Supabase Setup Guide for Project Showcase Portal

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the details:
   - **Project Name**: project-showcase-portal
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your target audience
   - **Pricing Plan**: Free tier is sufficient for starting
5. Click "Create new project"

## Step 2: Get Your API Keys

1. Once the project is created, go to **Project Settings** (gear icon)
2. Go to **API** section
3. Copy the following values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

4. Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=admin@bennett.edu.in
ADMIN_PASSWORD=YourSecureAdminPassword123!
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Set Up Database Tables

Go to the **SQL Editor** in your Supabase dashboard and run the following SQL commands:

### 1. Create Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_team_leader BOOLEAN DEFAULT FALSE,
  team_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create index
CREATE INDEX idx_users_email ON users(email);
```

### 2. Create Teams Table
```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  members JSONB DEFAULT '[]'::jsonb,
  unique_team_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Team leaders can update their team" ON teams
  FOR UPDATE USING (auth.uid() = leader_id);

-- Create index
CREATE INDEX idx_teams_code ON teams(unique_team_code);
CREATE INDEX idx_teams_leader ON teams(leader_id);
```

### 3. Create Projects Table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  github_url TEXT,
  demo_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Team members can create projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams WHERE id = projects.team_id
    )
  );

CREATE POLICY "Team leaders can update their projects" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = projects.team_id 
      AND teams.leader_id = auth.uid()
    )
  );

CREATE POLICY "Team leaders can delete their projects" ON projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = projects.team_id 
      AND teams.leader_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_projects_likes ON projects(likes_count DESC);
```

### 4. Create Likes Table
```sql
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all likes" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_project ON likes(project_id);
CREATE INDEX idx_likes_category ON likes(category);
```

### 5. Create Database Functions
```sql
-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects 
  SET likes_count = likes_count + 1,
      updated_at = NOW()
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement likes
CREATE OR REPLACE FUNCTION decrement_likes(project_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE projects 
  SET likes_count = GREATEST(likes_count - 1, 0),
      updated_at = NOW()
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6. Create Triggers
```sql
-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Set Up Storage for Project Images

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Bucket name: `project-images`
4. Make it **public** (toggle the public option)
5. Click "Create bucket"

### Set Storage Policies

Go to the bucket's policies and add:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their uploads
CREATE POLICY "Users can update own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images' 
  AND auth.role() = 'authenticated'
);
```

## Step 5: Configure Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Go to **Authentication** → **Settings**:
   - **Disable email confirmations** (uncheck "Enable email confirmations")
   - This allows users to sign up and login immediately without email verification
   - Set site URL to your domain (for production: `https://your-domain.vercel.app`)
   - Add redirect URLs for authentication

**Important:** Since we're only allowing @bennett.edu.in emails and disabling email confirmations, users can sign up and login immediately. Email validation happens at the application level (checking the domain).

## Step 6: Deploy to Vercel

### Prerequisites
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository

### Environment Variables in Vercel
Add the following environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

### Update Supabase Settings for Production
1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel domain to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

## Step 7: Test Your Setup

### Local Testing
```bash
npm run dev
```

Visit `http://localhost:3000` and test:
1. Sign up with a @bennett.edu.in email
2. Login immediately (no email verification needed)
3. Create a team
4. Upload a project
5. Like projects (max 2 per category)
6. Check leaderboard
7. Test admin login

### Production Testing
After deploying to Vercel:
1. Visit your production URL
2. Test all features (signup works immediately without email verification)
3. Check that uploads work correctly
4. Verify only @bennett.edu.in emails can sign up

## Common Issues and Solutions

### Issue: Authentication not working
- Check that environment variables are set correctly
- Verify Site URL in Supabase settings matches your domain
- Ensure email confirmations are DISABLED in Supabase Auth settings
- Clear browser cookies and try again

### Issue: Image uploads failing
- Verify the storage bucket is public
- Check storage policies are set correctly
- Ensure file size is under the limit (6MB for free tier)

### Issue: Row Level Security errors
- Verify all RLS policies are created correctly
- Check that users are authenticated before performing actions
- Review Supabase logs for specific errors

## Database Backup

It's recommended to set up automated backups:
1. Go to **Database** → **Backups** in Supabase
2. Enable automated backups (available in paid plans)
3. For free tier, manually export your database periodically

## Monitoring

1. Use Supabase Dashboard → **Logs** to monitor:
   - API requests
   - Database queries
   - Authentication events
   - Storage operations

2. Set up alerts for:
   - High error rates
   - Unusual activity
   - Storage limits

## Security Checklist

- ✅ All tables have Row Level Security enabled
- ✅ Service role key is kept secret (never in client code)
- ✅ Email validation for @bennett.edu.in domain
- ✅ Rate limiting on authentication endpoints
- ✅ Admin credentials stored in environment variables
- ✅ HTTPS enabled in production
- ✅ CORS configured correctly

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
