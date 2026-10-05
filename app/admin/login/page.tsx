'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already signed in as admin: go straight to the panel
  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' }).then(res => {
      if (res.ok) router.replace('/admin')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.replace('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#1e1e1e] via-[#000000] to-[#1e1e1e]">
      <div className="w-full max-w-md">
        <div className="bg-white border-4 border-black p-6 sm:p-10 shadow-[12px_12px_0px_0px_#ff6b9d]">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-[#ff6b9d] to-[#f50057] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Shield size={40} className="text-white" strokeWidth={3} />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-center uppercase mb-1">Admin Login</h1>
          <p className="text-center font-bold text-gray-600 mb-8">Project Showcase control panel</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-black mb-2 uppercase">Email</label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="block text-sm font-black mb-2 uppercase">Password</label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            {error && (
              <div role="alert" className="border-3 border-black bg-[#ffe5e5] p-3 font-bold text-[#b00020]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-[#1e1e1e] text-white font-black uppercase border-3 border-black shadow-[4px_4px_0px_0px_#ff6b9d] hover:shadow-[2px_2px_0px_0px_#ff6b9d] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-bold">
            <Link href="/" className="underline underline-offset-4 hover:text-[#f50057]">Back to the showcase</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
