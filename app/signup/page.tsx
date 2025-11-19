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

    // Validation
    if (!formData.email.endsWith('@bennett.edu.in')) {
      setError('Only @bennett.edu.in email addresses are allowed')
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
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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
          {success && (
            <div className="mb-6 p-4 bg-[#c7f464] border-3 border-black text-black text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ✅ {success}
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
                  placeholder="your.name@bennett.edu.in"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs font-bold text-gray-600">
                  Must be a Bennett University email address
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

            {/* Project Showcase Participation */}
            <div className="space-y-4 pt-6 border-t-3 border-black">
              <div className="flex items-start space-x-3 p-4 bg-[#fef6e4] border-3 border-black">
                <Checkbox
                  id="participating"
                  checked={formData.participating}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, participating: checked as boolean }))
                  }
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="participating"
                    className="text-sm font-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 uppercase"
                  >
                    Participate in Project Showcase
                  </label>
                  <p className="text-sm font-bold text-gray-700">
                    Check this if you want to submit a project for the showcase
                  </p>
                </div>
              </div>

              {/* Team Form (shown when participating) */}
              {formData.participating && (
                <div className="space-y-4 p-5 bg-white border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xl font-black uppercase border-b-3 border-black pb-2">Team Information</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-black uppercase">Team Name *</label>
                    <Input
                      type="text"
                      name="teamName"
                      placeholder="Enter team name"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      required={formData.participating}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase">Team Members</label>
                    <p className="text-xs font-bold text-gray-600">
                      You are the team leader. Add your team members below.
                    </p>

                    {formData.members.map((member, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Member name"
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, 'name', e.target.value)
                          }
                        />
                        <Input
                          type="email"
                          placeholder="member@bennett.edu.in"
                          value={member.email}
                          onChange={(e) =>
                            handleMemberChange(index, 'email', e.target.value)
                          }
                        />
                        {formData.members.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeMember(index)}
                            className="px-3 shrink-0"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addMember}
                      className="w-full"
                    >
                      + Add Member
                    </Button>
                  </div>
                </div>
              )}
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
