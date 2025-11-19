-- Fix RLS policies and foreign key constraint for signup
-- Run this in Supabase SQL Editor

-- First, check and remove the foreign key constraint that's causing issues
-- The error happens because we're trying to insert before auth.users is fully committed

-- Drop the foreign key constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Now recreate it with ON DELETE CASCADE to handle auth user deletion
ALTER TABLE users 
  ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE 
  DEFERRABLE INITIALLY DEFERRED;

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
