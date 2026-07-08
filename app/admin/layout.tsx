import { Sidebar } from '@/components/Sidebar'
import { requireRole } from '@/lib/auth'

const navItems = [
  {
    href: '/admin/zakazlar',
    label: 'Zakazlar',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 4 0M9 5h6"/>
      </svg>
    ),
  },
  {
    href: '/admin/qarz',
    label: 'Qarz',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    href: '/admin/analitika',
    label: 'Analitika',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: '/admin/arxiv',
    label: 'Arxiv',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    ),
  },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole('ADMIN')

  return (
    <div className="app-shell">
      <Sidebar role="ADMIN" userName="admin" navItems={navItems} />
      <main className="main-content">
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}
