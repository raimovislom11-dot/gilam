import { requireRole } from '@/lib/auth'
import { AdminQarzClient } from '@/app/admin/qarz/client'

export default async function OperatorQarzPage() {
  await requireRole('OPERATOR')
  return <AdminQarzClient />
}
