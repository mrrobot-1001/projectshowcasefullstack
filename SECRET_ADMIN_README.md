# 🔐 Secret Admin Panel - /xxx

## Access Information

### URL
`http://localhost:3000/xxx`

### Password
`AdminSecure@2024`

## Features

### 📊 Dashboard Tabs

1. **Stats** - Overview of platform metrics
   - Total Teams
   - Total Projects
   - Total Users
   - Total Likes

2. **Teams Management** ✏️
   - View all teams
   - Edit team details (name, leader, code, members)
   - Delete teams (cascades to delete all team projects)
   
3. **Users Management** ✏️
   - View all registered users
   - Edit user details (name, email, enrollment number)
   - Toggle team leader status
   - Delete users (cascades to delete user's likes)
   
4. **Projects Management** ✏️
   - View all projects
   - Edit project details (title, description, category, URLs)
   - Delete projects
   - View project stats (likes, team)

5. **🎯 Likes Control** (Secret Hidden Tab) 🔒
   - **Activation**: Triple-click the invisible button next to "PROJECTS" tab
   - Manually manipulate project likes counts
   - Override leaderboard rankings instantly
   - Quick select from projects reference list
   - Set exact vote counts for any project

## CRUD Operations

### Teams
- **Create**: Not available (teams are created during signup)
- **Read**: ✅ View all teams with details
- **Update**: ✅ Edit team name, leader, code, members
- **Delete**: ✅ Delete team and all associated projects

### Users
- **Create**: Not available (users are created during signup)
- **Read**: ✅ View all users with details
- **Update**: ✅ Edit name, email, enrollment, team leader status
- **Delete**: ✅ Delete user and cascade delete their data

### Projects
- **Create**: Not available (projects are created via upload page)
- **Read**: ✅ View all projects with full details
- **Update**: ✅ Edit title, description, category, GitHub URL, demo URL
- **Delete**: ✅ Delete project

### Likes (Secret Feature) 🔒
- **Manipulate**: ✅ Set exact likes count for any project
- **Override**: ✅ Instantly change leaderboard rankings
- **Reset**: ✅ Set likes to 0 to reset project votes
- **Boost**: ✅ Set likes to 1000+ to top the leaderboard

## API Endpoints Used

### Teams
- `GET /api/admin/teams` - Fetch all teams
- `PATCH /api/admin/teams/[id]` - Update team
- `DELETE /api/admin/teams/[id]` - Delete team

### Users
- `GET /api/admin/users` - Fetch all users
- `PATCH /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user

### Projects
- `GET /api/admin/projects` - Fetch all projects
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Stats
- `GET /api/admin/stats` - Fetch platform statistics

## Security Notes

⚠️ **Important Security Considerations:**

1. The password is stored in `.env.local` and hardcoded
2. Authentication uses `localStorage` (not secure for production)
3. No CSRF protection
4. No rate limiting
5. No audit logging

**For Production:**
- Implement proper authentication with JWT/sessions
- Use server-side session management
- Add role-based access control (RBAC)
- Implement audit logging for all admin actions
- Add rate limiting
- Use HTTPS only
- Add 2FA for admin access
- Implement IP whitelisting

## Color Scheme

The secret admin panel uses a dark theme with colorful accents:
- **Header**: Black gradient with pink, lime, blue accents
- **Stats Cards**: Gradient backgrounds (pink, blue, lime, yellow)
- **Action Buttons**: Neo-brutalist design with hard shadows
- **Edit Mode**: Inline editing with clear save/cancel actions

## Usage Example

### Standard Admin Operations

1. Navigate to `http://localhost:3000/xxx`
2. Enter password: `AdminSecure@2024`
3. Click **UNLOCK**
4. Select a tab (Stats/Teams/Users/Projects)
5. Click **EDIT** button on any item
6. Modify the fields
7. Click **SAVE** to apply changes or **CANCEL** to discard
8. Click **DELETE** to remove an item (with confirmation)

### 🎯 Secret Likes Manipulation

1. After logging in to `/xxx`
2. **Triple-click** the invisible area next to the "PROJECTS" tab
3. The **"LIKES CONTROL"** tab will appear (gradient yellow-pink button)
4. Click on the **LIKES CONTROL** tab
5. Enter a Project ID (or click "SELECT" from the reference list below)
6. Enter the new likes count you want
7. Click **MANIPULATE LIKES COUNT**
8. Changes are instant and affect the live leaderboard!

**Pro Tips:**
- The invisible button is barely visible (opacity 0) but hover shows a faint outline
- You need exactly 3 clicks to activate the secret tab
- Once activated, the tab stays visible until you refresh
- Use the Projects Reference section to quickly find and select projects

## Differences from /admin

| Feature | /admin | /xxx |
|---------|--------|------|
| URL | `/admin` | `/xxx` |
| Access | Email + Password | Single Password |
| Users Tab | ❌ No | ✅ Yes |
| Edit Teams | ✅ Yes | ✅ Yes |
| Edit Projects | ✅ Yes | ✅ Yes |
| Edit Users | ❌ No | ✅ Yes |
| Delete Users | ❌ No | ✅ Yes |
| Likes Manipulation | ❌ No | ✅ Yes (Secret) |
| Secret Features | ❌ No | ✅ Hidden Button |
| Theme | Dark header | Black gradient |
| Purpose | Public admin | Secret full control |

## Secret Features

### 🔒 Hidden Likes Control Tab

**How to Activate:**
1. Look for the invisible area between "PROJECTS" and the edge
2. Triple-click on it (you might see a 🎯 emoji on hover)
3. The secret "LIKES CONTROL" tab appears with gradient styling
4. Stays visible until page refresh

**What It Does:**
- Set exact likes count for any project
- Override natural voting system
- Instantly change leaderboard rankings
- Quick project selection from reference list
- Real-time leaderboard updates

**Use Cases:**
- Testing leaderboard functionality
- Demo purposes (boost specific projects)
- Reset spam votes
- Emergency corrections
- Admin demonstrations

**Warning:** This bypasses all voting logic and directly sets database values!

---

**Note**: Keep this route secret! It provides full administrative control over the entire platform.
