'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Code2 } from 'lucide-react'
import { useState } from 'react'

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('create')
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 pb-16 md:pb-20">
        {/* Header */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Team Management</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create a team or join an existing one to collaborate on projects
          </p>
        </section>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8 border-b border-border/20">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Create Team
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'join'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Join Team
          </button>
        </div>

        {/* Content */}
        <div className="max-w-2xl">
          {activeTab === 'create' ? (
            <div className="soft-shadow bg-card rounded-3xl p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Create a New Team</h2>
                <p className="text-muted-foreground">
                  Start collaborating with your team on a new project
                </p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Name</label>
                  <Input
                    placeholder="e.g., AI Innovators"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="h-12 rounded-xl text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Description</label>
                  <textarea
                    placeholder="What will your team work on?"
                    className="w-full px-4 py-3 rounded-xl border border-border/20 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring text-base"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Size</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-border/20 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>2-3 members</option>
                      <option>4-5 members</option>
                      <option>6+ members</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Track</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-border/20 bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>AI/ML</option>
                      <option>Web Development</option>
                      <option>Mobile App</option>
                      <option>Game Dev</option>
                      <option>Design</option>
                      <option>IoT</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                  Create Team
                </Button>
              </form>
            </div>
          ) : (
            <div className="soft-shadow bg-card rounded-3xl p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Join a Team</h2>
                <p className="text-muted-foreground">
                  Enter the team code to join an existing team
                </p>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team Code</label>
                  <Input
                    placeholder="e.g., ABC123DEF456"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="h-12 rounded-xl text-base font-mono tracking-widest"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask your team leader for the team code
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Before joining:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Make sure you have the correct team code</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>You can only be part of one team per project</span>
                    </li>
                    <li className="flex gap-2">
                      <span>✓</span>
                      <span>Team leaders can invite or remove members</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full h-12 rounded-xl text-base" size="lg">
                  Join Team
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
