import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'

const protectedRoutes: Record<string, string> = {
  '/admin': 'ADMIN',
  '/operator': 'OPERATOR',
  '/ishchi': 'ISHCHI',
}

const dashboards: Record<string, string> = {
  ADMIN: '/admin/zakazlar',
  OPERATOR: '/operator/yangi-zakaz',
  ISHCHI: '/ishchi',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Find which role this route requires
  const requiredRole = Object.entries(protectedRoutes).find(([prefix]) =>
    pathname.startsWith(prefix)
  )?.[1]

  if (!requiredRole) return NextResponse.next()

  const token = request.cookies.get('session')?.value
  const session = await decrypt(token)

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (session.role !== requiredRole) {
    const correctDashboard = dashboards[session.role] || '/login'
    const redirectUrl = new URL(correctDashboard, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/operator/:path*', '/ishchi/:path*'],
}
