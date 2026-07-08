import { requireRole } from '@/lib/auth'
import { AdminArxivClient } from './client'

export default async function ArxivPage() {
  await requireRole('ADMIN')
  return <AdminArxivClient />
}
