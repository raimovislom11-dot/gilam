import { requireRole } from '@/lib/auth'
import { IshchiClient } from './client'

export default async function IshchiPage() {
  await requireRole('ISHCHI')
  return <IshchiClient />
}
