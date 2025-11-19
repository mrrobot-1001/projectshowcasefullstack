'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setUser(null)
      }
    } catch (error) {
      // User not logged in
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black">
      <div className="px-4 py-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-black text-lg hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                width={120} 
                height={60}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/" className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                HOME
              </Link>
              <Link href="/leaderboard" className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                LEADERBOARD
              </Link>
              <Link href="/team" className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                TEAMS
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-9 bg-gray-200 border-3 border-black animate-pulse" />
              ) : user ? (
                <>
                  <Link 
                    href="/upload"
                    className="px-5 py-2 text-sm font-black border-3 border-black bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    UPLOAD
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-4 py-2 border-3 border-black bg-white font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <User size={18} strokeWidth={3} />
                      <span>{user.name || user.email}</span>
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <Link
                          href="/profile"
                          className="block px-4 py-3 text-sm font-bold border-b-3 border-black hover:bg-[#fef6e4] transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          MY PROFILE
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            handleLogout()
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-[#ff6b9d] transition-colors flex items-center gap-2"
                        >
                          <LogOut size={16} strokeWidth={3} />
                          LOGOUT
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2 text-sm font-bold border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 text-sm font-black border-3 border-black bg-[#ff6b9d] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t-4 border-black space-y-2 pb-4">
              <Link href="/" className="block px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                HOME
              </Link>
              <Link href="/leaderboard" className="block px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                LEADERBOARD
              </Link>
              <Link href="/team" className="block px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                TEAMS
              </Link>
              {loading ? (
                <div className="w-full h-20 bg-gray-200 border-3 border-black animate-pulse mt-4" />
              ) : user ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    PROFILE
                  </Link>
                  <div className="flex gap-2 pt-4 border-t-3 border-black">
                    <Link
                      href="/upload"
                      className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-[#3b82f6] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      UPLOAD
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-3 py-2 text-sm font-bold border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                      LOGOUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 pt-4 border-t-3 border-black">
                  <Link
                    href="/login"
                    className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-[#ff6b9d] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
