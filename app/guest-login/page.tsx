'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserCircle } from 'lucide-react'

export default function GuestLoginPage() {
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
      const response = await fetch('/api/auth/judge-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store judge info in localStorage
      localStorage.setItem('judgeAuth', JSON.stringify({
        id: data.judge.id,
        name: data.judge.name,
        email: data.judge.email,
        loginTime: new Date().toISOString()
      }))

      // Redirect to judge dashboard
      router.push('/judge')
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#fef6e4] via-[#fff9e5] to-[#ffe5f1]">
      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#a855f7] to-[#7c3aed] border-4 border-black transform rotate-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#ffd93d] to-[#ffc107] border-4 border-black transform -rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-[#ff6b9d] to-[#f50057] border-4 border-black transform rotate-45 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
          {/* Back Button */}
          <div className="mb-6 flex justify-center">
            <Link href="/login">
              <Button
                type="button"
                variant="outline"
                className="font-black uppercase"
              >
                ← Back to Login
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#a855f7] border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <UserCircle size={48} strokeWidth={3} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-black mb-3 uppercase">Judge Login</h1>
            <p className="font-bold text-gray-700">
              Enter your judge credentials to access the scoring panel
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
            <div className="space-y-2">
              <label className="text-sm font-black uppercase">Judge Email</label>
              <Input
                type="email"
                placeholder="Enter your judge email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase">Password</label>
              <Input
                type="password"
                placeholder="Enter your judge password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full mt-6 bg-[#a855f7] hover:bg-[#7c3aed]" 
              size="lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In as Judge'}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 p-4 bg-[#fef6e4] border-3 border-black">
            <p className="text-xs font-bold text-center">
              🎯 Judge credentials are provided by the admin team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
