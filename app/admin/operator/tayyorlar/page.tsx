import { requireRole } from '@/lib/auth'
import { OperatorTayyorlarClient } from '@/app/operator/tayyorlar/client'

export default async function AdminOperatorTayyorlarPage() {
  await requireRole('ADMIN')
  return <OperatorTayyorlarClient />
}
