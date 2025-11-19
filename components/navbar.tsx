'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20">
      <div className="px-4 py-3 md:py-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">SC</span>
              </div>
              <span className="hidden sm:inline">Student Cabinet</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
                Projects
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/upload">Upload</Link>
              </Button>
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
              <Link href="/projects" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Projects
              </Link>
              <Link href="/leaderboard" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Leaderboard
              </Link>
              <Link href="/team" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors">
                Teams
              </Link>
              <div className="flex gap-2 pt-4 border-t border-border/20">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="flex-1">
                  <Link href="/upload">Upload</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
