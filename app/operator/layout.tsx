import { Sidebar } from '@/components/Sidebar'
import { requireRole } from '@/lib/auth'

const navItems = [
  {
    href: '/operator/yangi-zakaz',
    label: 'Yangi zakaz',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/operator/tayyorlar',
    label: 'Tayyorlar',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
  {
    href: '/operator/yuborilganlar',
    label: 'Yuborilganlar',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
  {
    href: '/operator/qarz',
    label: 'Qarzlar',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
]

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  await requireRole('OPERATOR')

  return (
    <div className="app-shell">
      <Sidebar role="OPERATOR" userName="Operator" navItems={navItems} />
      <main className="main-content">
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}
