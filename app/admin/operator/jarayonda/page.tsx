import { requireRole } from '@/lib/auth'
import { OperatorJarayondaClient } from '@/app/operator/jarayonda/client'

export default async function AdminOperatorJarayondaPage() {
  await requireRole('ADMIN')
  return <OperatorJarayondaClient role="ADMIN" />
}
