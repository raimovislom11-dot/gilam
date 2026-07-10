'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { ThemeToggle } from '@/components/ThemeToggle'

import { useState, useEffect } from 'react'

interface NavItem {
  href?: string
  label: string
  icon: React.ReactNode
  children?: { href: string; label: string; icon?: React.ReactNode }[]
}

interface SidebarProps {
  role: 'ADMIN' | 'OPERATOR' | 'ISHCHI'
  userName?: string
  navItems: NavItem[]
}

const roleColors: Record<string, string> = {
  ADMIN: 'var(--primary)',
  OPERATOR: 'var(--accent)',
  ISHCHI: 'var(--success)',
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  OPERATOR: 'Operator',
  ISHCHI: 'Ishchi',
}

export function Sidebar({ role, userName, navItems }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }))
  }

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: '1rem' }}>🪄</div>
          <span className="sidebar-logo-text" style={{ fontSize: '1rem' }}>Gilam</span>
        </div>
        <button className="burger-btn" onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div className="sidebar-logo-icon">🪄</div>
            <span className="sidebar-logo-text">Gilam</span>
          </div>
          <button className="close-btn d-md-none" onClick={() => setIsOpen(false)}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Role badge */}
        <div style={{ padding: '0.75rem 1rem 0', marginBottom: '0.25rem' }}>
          <div style={{
            background: `${roleColors[role]}18`,
            border: `1px solid ${roleColors[role]}40`,
            borderRadius: 8,
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: roleColors[role],
              boxShadow: `0 0 6px ${roleColors[role]}`,
            }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: roleColors[role] }}>
              {roleLabels[role]}
            </span>
            {userName && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                {userName}
              </span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ) : (
                <div 
                  className="nav-item" 
                  style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                  onClick={() => toggleGroup(item.label)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span>{item.label}</span>
                    <svg 
                      width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                      style={{ transform: openGroups[item.label] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              )}
              {item.children && openGroups[item.label] && (
                <div style={{ paddingLeft: '2.5rem', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', marginBottom: '8px' }}>
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`nav-item ${pathname === child.href ? 'active' : ''}`}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                    >
                      {child.icon && <span className="nav-icon" style={{ transform: 'scale(0.8)' }}>{child.icon}</span>}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Chiqish
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
