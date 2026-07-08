import { requireRole } from '@/lib/auth'
import { AdminZakazlarClient } from './client'

export default async function ZakazlarPage() {
  await requireRole('ADMIN')
  return <AdminZakazlarClient />
}
