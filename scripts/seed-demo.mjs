// Demo data for the public showcase: one team + project per category, demo
// student / team-leader / judge accounts, and real votes behind every like
// count. Safe to re-run: existing demo rows are left alone.
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const sql = postgres(process.env.DATABASE_URL, { max: 1 })
const hash = (pw) => bcrypt.hash(pw, 12)

const DEMO_PASSWORD = 'Demo@1234'
const JUDGE_PASSWORD = 'Judge@1234'

const PROJECTS = [
  { team: 'Pixel Pioneers', code: 'TEAM-DEMO2026', category: 'Software and Automation', title: 'CampusFlow',
    description: 'Automates room booking, attendance and event approvals for student clubs, with a Slack-style bot for reminders.',
    image: '/dashboard-analytics.jpg', tags: ['Next.js', 'PostgreSQL', 'Automation'], votes: 7 },
  { team: 'Neural Ninjas', code: 'TEAM-DEMOAIML', category: 'AI/ML', title: 'StudyBuddy AI',
    description: 'A course-aware chat assistant that turns lecture notes into flashcards and practice questions.',
    image: '/ai-chat-assistant-interface.jpg', tags: ['LLM', 'Python', 'RAG'], votes: 9 },
  { team: 'Block Breakers', code: 'TEAM-DEMOSEC1', category: 'Cybersecurity and Blockchain', title: 'CertChain',
    description: 'Tamper-proof academic certificates: issue on-chain, verify with a QR code in one tap.',
    image: '/cloud-platform.jpg', tags: ['Solidity', 'Web3', 'Security'], votes: 5 },
  { team: 'Circuit Crew', code: 'TEAM-DEMOSEAS', category: 'SEAS', title: 'SmartDorm',
    description: 'Low-cost IoT sensors that cut hostel power use by switching off idle fans and lights.',
    image: '/smart-home-iot-system.jpg', tags: ['IoT', 'ESP32', 'Energy'], votes: 6 },
  { team: 'Club Connect', code: 'TEAM-DEMOCLUB', category: 'Clubs and Chapter', title: 'ClubHub',
    description: 'One place for every club: events, sign-ups, galleries and announcements.',
    image: '/design-system-ui-components.jpg', tags: ['React', 'Community'], votes: 4 },
  { team: 'Open Minds', code: 'TEAM-DEMOOPEN', category: 'Open Innovation', title: 'FitQuest',
    description: 'Gamified fitness challenges between hostels with weekly leaderboards.',
    image: '/fitness-mobile-app-interface.png', tags: ['Mobile', 'Flutter', 'Health'], votes: 8 },
]

try {
  const [existing] = await sql`SELECT 1 FROM teams WHERE unique_team_code = 'TEAM-DEMO2026'`
  if (existing) {
    console.log('Demo data already present; nothing to do')
  } else {
    await sql.begin(async (tx) => {
      const demoHash = await hash(DEMO_PASSWORD)

      // Voters that back the like counts (random passwords, cannot be logged into)
      const voters = []
      for (let i = 1; i <= 10; i++) {
        const [v] = await tx`
          INSERT INTO users (email, password_hash, name)
          VALUES (${`demo.voter${i}@bennett.edu.in`}, ${await hash(randomBytes(24).toString('hex'))}, ${`Demo Voter ${i}`})
          RETURNING id
        `
        voters.push(v.id)
      }

      const [student] = await tx`
        INSERT INTO users (email, password_hash, name, phone_number)
        VALUES ('demo.student@bennett.edu.in', ${demoHash}, 'Demo Student', '9000000001')
        RETURNING id
      `

      for (const [index, p] of PROJECTS.entries()) {
        const isDemoLeader = index === 0
        const leaderEmail = isDemoLeader ? 'demo.leader@bennett.edu.in' : `lead.${p.code.slice(5).toLowerCase()}@bennett.edu.in`
        const leaderName = isDemoLeader ? 'Demo Team Leader' : `${p.team} Lead`
        const leaderHash = isDemoLeader ? demoHash : await hash(randomBytes(24).toString('hex'))

        const [leader] = await tx`
          INSERT INTO users (email, password_hash, name, phone_number, is_team_leader)
          VALUES (${leaderEmail}, ${leaderHash}, ${leaderName}, '9000000002', true)
          RETURNING id
        `
        const members = [
          { name: leaderName, email: leaderEmail },
          { name: `${p.team} Member`, email: `member.${p.code.slice(5).toLowerCase()}@bennett.edu.in` },
        ]
        const [team] = await tx`
          INSERT INTO teams (team_name, leader_id, leader_name, leader_email, members, unique_team_code)
          VALUES (${p.team}, ${leader.id}, ${leaderName}, ${leaderEmail}, ${tx.json(members)}, ${p.code})
          RETURNING id
        `
        await tx`UPDATE users SET team_id = ${team.id} WHERE id = ${leader.id}`

        const [project] = await tx`
          INSERT INTO projects (title, description, category, image_url, team_id, team_name, tags, likes_count)
          VALUES (${p.title}, ${p.description}, ${p.category}, ${p.image}, ${team.id}, ${p.team}, ${p.tags}, ${p.votes})
          RETURNING id
        `
        for (const voter of voters.slice(0, p.votes)) {
          await tx`INSERT INTO likes (user_id, project_id, category) VALUES (${voter}, ${project.id}, ${p.category})`
        }
      }

      await tx`
        INSERT INTO judges (name, email, password_hash)
        VALUES ('Demo Judge', 'demo.judge@bennett.edu.in', ${await hash(JUDGE_PASSWORD)})
      `
      console.log(`Seeded ${PROJECTS.length} teams/projects, demo student ${student ? 'ok' : '-'}, demo judge`)
    })
  }
} finally {
  await sql.end()
}
