import { requireRole } from '@/lib/auth'
import { OperatorJarayondaClient } from './client'

export default async function JarayondaPage() {
  await requireRole('OPERATOR')
  return <OperatorJarayondaClient />
}
