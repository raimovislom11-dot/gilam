import { requireRole } from '@/lib/auth'
import { OperatorTayyorlarClient } from './client'

export default async function TayyorlarPage() {
  await requireRole('OPERATOR')
  return <OperatorTayyorlarClient />
}
