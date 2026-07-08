import 'server-only'
import { redirect } from 'next/navigation'
import { getSession, type Role } from './session'

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  return { id: session.userId, role: session.role }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(role: Role) {
  const user = await requireAuth()
  if (user.role !== role) {
    // Redirect to their own dashboard
    const dashboards: Record<Role, string> = {
      ADMIN: '/admin/zakazlar',
      OPERATOR: '/operator/yangi-zakaz',
      ISHCHI: '/ishchi',
    }
    redirect(dashboards[user.role])
  }
  return user
}
