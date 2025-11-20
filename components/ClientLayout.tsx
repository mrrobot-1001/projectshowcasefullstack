'use client'

import { UserProvider } from '@/contexts/UserContext'
import { ReactNode } from 'react'

export function ClientLayout({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>
}
