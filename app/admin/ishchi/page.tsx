import { requireRole } from '@/lib/auth'
import { IshchiClient } from '@/app/ishchi/client'

export default async function AdminIshchiPage() {
  const user = await requireRole('ADMIN')
  return <IshchiClient role={user.role} />
}
