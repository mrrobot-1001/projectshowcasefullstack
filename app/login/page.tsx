'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect based on role
      if (data.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#fef6e4] via-[#fff9e5] to-[#ffe5f1]">
      {/* Neo-Brutalist Decorative Elements with Colors */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#ff6b9d] to-[#f50057] border-4 border-black transform rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#c7f464] to-[#a8d92e] border-4 border-black transform -rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] border-4 border-black transform rotate-45 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-[#ffd93d] border-4 border-black transform -rotate-12" />
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-[#a855f7] border-4 border-black transform rotate-6" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black mb-3 uppercase">Welcome Back</h1>
            <p className="font-bold text-gray-700">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#ff6b9d] border-3 border-black text-black text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase">Email</label>
              <Input
                type="email"
                placeholder="your.email@bennett.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs font-bold text-gray-600">
                Must be a Bennett University email
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-black uppercase">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit"
              className="w-full mt-6" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-3 border-black" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white font-black uppercase">or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-sm font-bold">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-[#3b82f6] font-black underline hover:text-black transition-colors"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
