import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

// Page-level guards. API routes check sessions themselves (lib/auth.ts).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const admin = await verifySession(request.cookies.get(SESSION_COOKIE.admin)?.value, 'admin')
    if (!admin) return redirectTo(request, '/admin/login')
  }

  if (pathname.startsWith('/upload')) {
    const user = await verifySession(request.cookies.get(SESSION_COOKIE.user)?.value, 'user')
    if (!user) return redirectTo(request, '/login')
  }

  return NextResponse.next()
}

function redirectTo(request: NextRequest, path: string) {
  const url = request.nextUrl.clone()
  url.pathname = path
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin/:path*', '/upload/:path*'],
}
