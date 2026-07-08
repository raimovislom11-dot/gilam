import { requireRole } from '@/lib/auth'
import { AdminAnalitikaClient } from './client'

export default async function AnalitikaPage() {
  await requireRole('ADMIN')
  return <AdminAnalitikaClient />
}
