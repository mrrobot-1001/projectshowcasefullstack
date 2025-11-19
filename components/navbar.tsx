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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="px-4 py-3 md:py-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
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
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
                Leaderboard
              </Link>
              <Link href="/team" className="text-sm font-medium hover:text-primary transition-colors">
                Teams
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-9 bg-muted animate-pulse rounded-lg" />
              ) : user ? (
                <>
                  <Button size="sm" asChild>
                    <Link href="/upload">Upload</Link>
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User size={18} />
                      <span className="text-sm font-medium">{user.name || user.email}</span>
                    </button>
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-lg py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          My Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false)
                            handleLogout()
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border/20 space-y-1 pb-4">
              <Link href="/" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Home
              </Link>
              <Link href="/leaderboard" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Leaderboard
              </Link>
              <Link href="/team" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Teams
              </Link>
              {loading ? (
                <div className="w-full h-20 bg-muted animate-pulse rounded-lg mt-4" />
              ) : user ? (
                <>
                  <Link href="/profile" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                    Profile
                  </Link>
                  <div className="flex gap-2 pt-4 border-t border-border/20">
                    <Button size="sm" asChild className="flex-1">
                      <Link href="/upload">Upload</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="flex-1">
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2 pt-4 border-t border-border/20">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
