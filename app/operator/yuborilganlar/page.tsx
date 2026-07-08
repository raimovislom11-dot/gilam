import { requireRole } from '@/lib/auth'
import { OperatorYuborilganlarClient } from './client'

export default async function YuborilganlarPage() {
  await requireRole('OPERATOR')
  return <OperatorYuborilganlarClient />
}
