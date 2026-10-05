-- Project Showcase schema (PostgreSQL 16). Idempotent: applied on every deploy
-- by scripts/migrate.mjs. Column names match what the pages read.

CREATE TABLE IF NOT EXISTS users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             text NOT NULL UNIQUE,
  password_hash     text NOT NULL,
  name              text NOT NULL,
  phone_number      text,
  enrollment_number text,
  is_team_leader    boolean NOT NULL DEFAULT false,
  team_id           uuid,
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name        text NOT NULL,
  leader_id        uuid REFERENCES users(id) ON DELETE SET NULL,
  leader_name      text,
  leader_email     text,
  members          jsonb NOT NULL DEFAULT '[]'::jsonb,
  unique_team_code text NOT NULL UNIQUE,
  created_at       timestamptz NOT NULL DEFAULT now()
);

DO $$ BEGIN
  ALTER TABLE users ADD CONSTRAINT users_team_id_fkey
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS projects (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                text NOT NULL,
  description          text NOT NULL DEFAULT '',
  category             text NOT NULL,
  image_url            text NOT NULL DEFAULT '',
  team_id              uuid REFERENCES teams(id) ON DELETE CASCADE,
  team_name            text,
  tags                 text[] NOT NULL DEFAULT '{}',
  github_url           text,
  demo_url             text,
  likes_count          integer NOT NULL DEFAULT 0,
  original_likes_count integer,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projects_category_likes_idx ON projects (category, likes_count DESC);

CREATE TABLE IF NOT EXISTS likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, project_id)
);
CREATE INDEX IF NOT EXISTS likes_user_category_idx ON likes (user_id, category);

CREATE TABLE IF NOT EXISTS judges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_active     boolean NOT NULL DEFAULT true,
  last_login    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  judge_id      uuid NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
  judge_name    text NOT NULL,
  innovation    integer NOT NULL DEFAULT 0 CHECK (innovation BETWEEN 0 AND 10),
  pitching      integer NOT NULL DEFAULT 0 CHECK (pitching BETWEEN 0 AND 10),
  presentation  integer NOT NULL DEFAULT 0 CHECK (presentation BETWEEN 0 AND 10),
  creativity    integer NOT NULL DEFAULT 0 CHECK (creativity BETWEEN 0 AND 10),
  functionality integer NOT NULL DEFAULT 0 CHECK (functionality BETWEEN 0 AND 10),
  scalability   integer NOT NULL DEFAULT 0 CHECK (scalability BETWEEN 0 AND 10),
  total_score   integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, judge_id)
);

CREATE TABLE IF NOT EXISTS winners (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category     text NOT NULL,
  team_id      uuid REFERENCES teams(id) ON DELETE SET NULL,
  team_name    text NOT NULL,
  score        numeric,
  position     integer NOT NULL CHECK (position IN (1, 2, 3)),
  announced_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category, position)
);

-- Every admin change to vote counts is recorded here.
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id          bigserial PRIMARY KEY,
  admin_email text NOT NULL,
  action      text NOT NULL,
  target_type text NOT NULL,
  target_id   text,
  details     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
