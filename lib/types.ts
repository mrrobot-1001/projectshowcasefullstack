export interface User {
  id: string
  email: string
  name: string
  phone_number: string
  is_team_leader: boolean
  team_id?: string
  created_at: string
}

export interface Team {
  id: string
  team_name: string
  leader_id: string
  leader_name: string
  leader_email: string
  members: TeamMember[]
  unique_team_code: string
  created_at: string
}

export interface TeamMember {
  name: string
  email: string
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  team_id: string
  team_name: string
  tags: string[]
  github_url?: string
  demo_url?: string
  likes_count: number
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  user_id: string
  project_id: string
  category: string
  created_at: string
}

export interface LeaderboardEntry {
  project_id: string
  title: string
  team_name: string
  category: string
  likes_count: number
  rank: number
}

export type Category = 
  | 'Web Development'
  | 'Mobile App'
  | 'AI/ML'
  | 'IoT'
  | 'Game Development'
  | 'Data Science'
  | 'Other'
