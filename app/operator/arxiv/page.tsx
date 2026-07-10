import { requireRole } from '@/lib/auth'
import { AdminArxivClient } from '@/app/admin/arxiv/client'

export default async function OperatorArxivPage() {
  await requireRole('OPERATOR')
  return <AdminArxivClient />
}
