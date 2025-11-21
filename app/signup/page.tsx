'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    participating: false,
    teamName: '',
    members: [{ name: '', email: '' }],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [teamCode, setTeamCode] = useState('') // Store the team code after signup

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMemberChange = (index: number, field: 'name' | 'email', value: string) => {
    const newMembers = [...formData.members]
    newMembers[index][field] = value
    setFormData(prev => ({ ...prev, members: newMembers }))
  }

  const addMember = () => {
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, { name: '', email: '' }],
    }))
  }

  const removeMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation for Bennett email
    const emailLower = formData.email.toLowerCase().trim()
    const isValidEmail = (
      emailLower.endsWith('@bennett.edu.in') || 
      emailLower.endsWith('@bennettu.onmicrosoft.com')
    ) && !emailLower.includes('#ext#')
    
    if (!isValidEmail) {
      setError('Only Bennett University email addresses (@bennett.edu.in or @bennettu.onmicrosoft.com) are allowed. External guest accounts are not permitted.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.participating && !formData.teamName) {
      setError('Team name is required when participating in showcase')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone_number: formData.phoneNumber,
        participating: formData.participating,
      }

      if (formData.participating) {
        payload.teamData = {
          teamName: formData.teamName,
          members: formData.members.filter(m => m.name && m.email),
        }
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      setSuccess(data.message || 'Signup successful!')
      
      // Store team code if it exists
      if (data.teamCode) {
        setTeamCode(data.teamCode)
      }
      
      // Don't auto-redirect if there's a team code to show
      if (!data.teamCode) {
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#fef6e4]">
      {/* Neo-Brutalist Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#ff6b9d] border-4 border-black transform rotate-12" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#c7f464] border-4 border-black transform -rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-[#3b82f6] border-4 border-black transform rotate-45" />
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black mb-3 uppercase">Create Account</h1>
            <p className="font-bold text-gray-700">
              Join the Bennett Project Showcase
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-[#ff6b9d] border-3 border-black text-black text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}
          {success && !teamCode && (
            <div className="mb-6 p-4 bg-[#c7f464] border-3 border-black text-black text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ✅ {success}
            </div>
          )}
          
          {/* Team Code Display - Show after successful team creation */}
          {teamCode && (
            <div className="mb-6 space-y-4">
              <div className="relative overflow-hidden bg-gradient-to-r from-[#c7f464] to-[#a8d92e] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff6b9d] border-4 border-black -mr-10 -mt-10 rotate-45"></div>
                <h3 className="text-2xl font-black mb-2 uppercase relative z-10">🎉 Team Created Successfully!</h3>
                <p className="font-bold mb-4 relative z-10">Save this team code - you'll need it to upload projects!</p>
                
                <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10">
                  <p className="text-xs font-black uppercase mb-2">Your Team Code:</p>
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-3xl font-black font-mono bg-[#fef6e4] px-4 py-2 border-2 border-black flex-1 text-center">
                      {teamCode}
                    </code>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(teamCode)
                        alert('Team code copied to clipboard!')
                      }}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      📋 COPY
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2 text-sm font-bold relative z-10">
                  <p>✅ Share this code with your team members</p>
                  <p>✅ Use this code when uploading projects</p>
                  <p>✅ Find it anytime in your profile page</p>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full"
                size="lg"
              >
                PROCEED TO LOGIN →
              </Button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase border-b-3 border-black pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Full Name *</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black uppercase">Bennett Email *</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your.name@bennett.edu.in or @bennettu.onmicrosoft.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs font-bold text-gray-600">
                  ℹ️ Only Bennett University email addresses (@bennett.edu.in or @bennettu.onmicrosoft.com) are allowed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Password *</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black uppercase">Confirm Password *</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-base"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm font-bold">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-[#3b82f6] font-black underline hover:text-black transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
