import { requireRole } from '@/lib/auth'
import { AdminQarzClient } from './client'

export default async function QarzPage() {
  await requireRole('ADMIN')
  return <AdminQarzClient />
}
