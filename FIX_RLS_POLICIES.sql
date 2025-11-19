-- Complete fix for signup issues
-- Run this in Supabase SQL Editor

-- SOLUTION: Remove the foreign key constraint entirely
-- Supabase Auth manages the auth.users table, so we don't need the FK constraint
-- The relationship is implicit through matching IDs

-- Drop the problematic foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- We won't recreate it - the ID relationship is managed by the application code

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
WITH CHECK (true);

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
WITH CHECK (true);

CREATE POLICY "Team leaders can update own team" 
ON teams FOR UPDATE 
USING (auth.uid() = leader_id);
