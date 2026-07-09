import { requireRole } from '@/lib/auth'
import { IshchiClient } from './client'

export default async function IshchiPage() {
  const user = await requireRole('ISHCHI')
  return <IshchiClient role={user.role} />
}
