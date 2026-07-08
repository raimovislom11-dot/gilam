import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const dashboards: Record<string, string> = {
    ADMIN: '/admin/zakazlar',
    OPERATOR: '/operator/yangi-zakaz',
    ISHCHI: '/ishchi',
  }

  redirect(dashboards[session.role] || '/login')
}
