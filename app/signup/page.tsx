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
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-background to-muted/20">
      {/* Decorative blur elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl" />
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="soft-shadow bg-card rounded-3xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join the Bennett Project Showcase
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    placeholder="+91 98765 43210"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bennett Email *</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="your.name@bennett.edu.in"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Must be a Bennett University email address
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Project Showcase Participation */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="participating"
                  checked={formData.participating}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, participating: checked as boolean }))
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="participating"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Participate in Project Showcase
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Check this if you want to submit a project for the showcase
                  </p>
                </div>
              </div>

              {/* Team Form (shown when participating) */}
              {formData.participating && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                  <h3 className="text-lg font-semibold">Team Information</h3>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Team Name *</label>
                    <Input
                      type="text"
                      name="teamName"
                      placeholder="Enter team name"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      required={formData.participating}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Team Members</label>
                    <p className="text-xs text-muted-foreground">
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
                          className="h-11 rounded-xl"
                        />
                        <Input
                          type="email"
                          placeholder="member@bennett.edu.in"
                          value={member.email}
                          onChange={(e) =>
                            handleMemberChange(index, 'email', e.target.value)
                          }
                          className="h-11 rounded-xl"
                        />
                        {formData.members.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeMember(index)}
                            className="px-3"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
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
              className="w-full h-12 rounded-xl text-base"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
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
