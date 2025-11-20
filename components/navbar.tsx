'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { user, loading, setUser } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const navigate = (path: string) => {
    startTransition(() => {
      router.push(path)
    })
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      navigate('/')
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
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-black text-lg hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            >
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={120}
                height={60}
                className="h-12 md:h-14 w-auto object-contain"
                priority
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => navigate('/')} className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                HOME
              </button>
              <button onClick={() => navigate('/leaderboard')} className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                LEADERBOARD
              </button>
              <button onClick={() => navigate('/team')} className="px-4 py-2 text-sm font-bold border-3 border-black bg-white hover:bg-[#c7f464] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                TEAMS
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-9 bg-gray-200 border-3 border-black animate-pulse" />
              ) : user ? (
                <>
                  <button
                    onClick={() => navigate('/upload')}
                    className="px-5 py-2 text-sm font-black border-3 border-black bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    UPLOAD
                  </button>
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
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            navigate('/profile')
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-bold border-b-3 border-black hover:bg-[#fef6e4] transition-colors"
                        >
                          MY PROFILE
                        </button>
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
                  <button
                    onClick={() => navigate('/login')}
                    className="px-5 py-2 text-sm font-bold border-3 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-5 py-2 text-sm font-black border-3 border-black bg-[#ff6b9d] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X size={24} strokeWidth={3} className="animate-[spin_0.3s_ease-in-out]" />
              ) : (
                <Menu size={24} strokeWidth={3} />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t-4 border-black space-y-2 pb-4 animate-[slideDown_0.3s_ease-out]">
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/')
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-[fadeInUp_0.3s_ease-out_0.05s_both]"
              >
                HOME
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/leaderboard')
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-[fadeInUp_0.3s_ease-out_0.1s_both]"
              >
                LEADERBOARD
              </button>
              <button
                onClick={() => {
                  setIsOpen(false)
                  navigate('/team')
                }}
                className="block w-full text-left px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-[fadeInUp_0.3s_ease-out_0.15s_both]"
              >
                TEAMS
              </button>
              {loading ? (
                <div className="w-full h-20 bg-gray-200 border-3 border-black animate-pulse mt-4" />
              ) : user ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/profile')
                    }}
                    className="block w-full text-left px-3 py-2 text-sm font-bold border-2 border-black bg-white hover:bg-[#c7f464] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-[fadeInUp_0.3s_ease-out_0.2s_both]"
                  >
                    PROFILE
                  </button>
                  <div className="flex gap-2 pt-4 border-t-3 border-black animate-[fadeInUp_0.3s_ease-out_0.25s_both]">
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        navigate('/upload')
                      }}
                      className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-[#3b82f6] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    >
                      UPLOAD
                    </button>
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      className="flex-1 px-3 py-2 text-sm font-bold border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    >
                      LOGOUT
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 pt-4 border-t-3 border-black animate-[fadeInUp_0.3s_ease-out_0.2s_both]">
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/login')
                    }}
                    className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      navigate('/signup')
                    }}
                    className="flex-1 text-center px-3 py-2 text-sm font-bold border-3 border-black bg-[#ff6b9d] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                  >
                    SIGN UP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
