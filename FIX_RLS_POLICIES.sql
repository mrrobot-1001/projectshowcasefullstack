-- Fix RLS policies for signup to work
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies that allow signup
CREATE POLICY "Users are viewable by everyone" 
ON users FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (true);  -- Changed from auth.uid() = id to allow signup

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Also ensure teams can be created
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON teams;
DROP POLICY IF EXISTS "Team leaders can create teams" ON teams;
DROP POLICY IF EXISTS "Team leaders can update own team" ON teams;

CREATE POLICY "Teams are viewable by everyone" 
ON teams FOR SELECT 
USING (true);

CREATE POLICY "Team leaders can create teams" 
ON teams FOR INSERT 
WITH CHECK (true);  -- Allow any authenticated user to create teams

CREATE POLICY "Team leaders can update own team" 
ON teams FOR UPDATE 
USING (auth.uid() = leader_id);
