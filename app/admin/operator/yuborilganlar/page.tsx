import { requireRole } from '@/lib/auth'
import { OperatorYuborilganlarClient } from '@/app/operator/yuborilganlar/client'

export default async function AdminOperatorYuborilganlarPage() {
  await requireRole('ADMIN')
  return <OperatorYuborilganlarClient />
}
