'use client'

import { useState, useMemo } from 'react'
import { useWorkers, useAttendances, storeSaveAttendance } from '@/lib/store'
import type { AttendanceStatus } from '@/lib/types'

export default function DavomatPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date()
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  })

  const { workers, loading: workersLoading } = useWorkers()
  const { attendances, loading: attLoading } = useAttendances(selectedDate)

  const handleStatusChange = (workerId: number, status: AttendanceStatus) => {
    const existing = attendances.find(a => a.workerId === workerId)
    storeSaveAttendance(workerId, selectedDate, status, existing?.izoh || '')
  }

  const handleIzohChange = (workerId: number, izoh: string) => {
    const existing = attendances.find(a => a.workerId === workerId)
    const status = existing?.status || 'KELDI'
    storeSaveAttendance(workerId, selectedDate, status, izoh)
  }

  const changeDay = (delta: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + delta)
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`)
  }

  const setToday = () => {
    const d = new Date()
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`)
  }

  // Calculate stats
  const stats = useMemo(() => {
    let keldi = 0
    let kelmadi = 0
    let ruxsat = 0
    let belgilanmagan = workers.length
    
    attendances.forEach(a => {
      if (workers.some(w => w.id === a.workerId)) {
        belgilanmagan--
        if (a.status === 'KELDI') keldi++
        else if (a.status === 'KELMADI') kelmadi++
        else if (a.status === 'RUXSAT') ruxsat++
      }
    })

    return { jami: workers.length, keldi, kelmadi, ruxsat, belgilanmagan }
  }, [workers, attendances])

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  if (workersLoading || attLoading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header & Date Controls */}
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title gradient-text">Davomat Boshqaruvi</h1>
          <p className="page-subtitle">Xodimlarning kunlik ishtirokini nazorat qilish va hisobotini yuritish</p>
        </div>
        
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderRadius: '100px' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => changeDay(-1)} style={{ borderRadius: '50%', width: 36, height: 36, padding: 0 }} title="Oldingi kun">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          
          <button className="btn btn-ghost btn-sm" onClick={setToday} style={{ fontWeight: 600, border: 'none', background: 'var(--bg-surface)' }}>
            Bugun
          </button>
          
          <input 
            type="date" 
            className="input" 
            style={{ width: 'auto', padding: '0.4rem 0.8rem', minHeight: '36px', border: 'none', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          
          <button className="btn btn-ghost btn-sm" onClick={() => changeDay(1)} style={{ borderRadius: '50%', width: 36, height: 36, padding: 0 }} title="Keyingi kun">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stats-card" style={{ borderTop: '3px solid var(--primary)' }}>
          <div className="stat-label">Jami xodimlar</div>
          <div className="stat-number">{stats.jami} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>ta</span></div>
        </div>
        <div className="stats-card" style={{ borderTop: '3px solid var(--success)' }}>
          <div className="stat-label">Kelganlar</div>
          <div className="stat-number" style={{ color: 'var(--success)' }}>{stats.keldi}</div>
        </div>
        <div className="stats-card" style={{ borderTop: '3px solid var(--danger)' }}>
          <div className="stat-label">Kelmadi</div>
          <div className="stat-number" style={{ color: 'var(--danger)' }}>{stats.kelmadi}</div>
        </div>
        <div className="stats-card" style={{ borderTop: '3px solid var(--warning)' }}>
          <div className="stat-label">Ruxsat so'raganlar</div>
          <div className="stat-number" style={{ color: 'var(--warning)' }}>{stats.ruxsat}</div>
        </div>
      </div>

      {workers.length === 0 ? (
        <div className="card empty-state" style={{ padding: '6rem 2rem' }}>
          <div className="empty-state-icon" style={{ fontSize: '4rem', opacity: 0.8, color: 'var(--primary)' }}>🧑‍💼</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>Ishchilar bazasi bo'sh</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400 }}>Davomatni yuritish uchun avval tizimga ishchilarni qo'shishingiz kerak.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 280px minmax(200px, 1.5fr)', gap: '1rem', padding: '1rem 1.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>Xodim</div>
            <div style={{ textAlign: 'center' }}>Holatni belgilash</div>
            <div>Izoh qoldirish</div>
          </div>
          
          {/* Worker Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {workers.map((w, i) => {
              const att = attendances.find(a => a.workerId === w.id)
              const status = att?.status
              
              return (
                <div key={w.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 280px minmax(200px, 1.5fr)', gap: '1rem', padding: '1.25rem 1.5rem', alignItems: 'center', borderBottom: i !== workers.length - 1 ? '1px solid var(--border)' : 'none', background: status ? 'transparent' : 'rgba(99, 102, 241, 0.03)', transition: 'background 0.3s' }}>
                  
                  {/* Avatar & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(99,102,241,0.2)' }}>
                      {getInitials(w.ism)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{w.ism}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{w.lavozim || 'Vazifasi kiritilmagan'}</div>
                    </div>
                  </div>

                  {/* Status Segmented Control */}
                  <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border)', justifyContent: 'space-between', gap: '4px' }}>
                    <button 
                      onClick={() => handleStatusChange(w.id, 'KELDI')}
                      style={{ flex: 1, padding: '0.4rem 0', borderRadius: '6px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: status === 'KELDI' ? 'var(--success-bg)' : 'transparent', color: status === 'KELDI' ? 'var(--success)' : 'var(--text-muted)' }}
                    >
                      Keldi
                    </button>
                    <button 
                      onClick={() => handleStatusChange(w.id, 'KELMADI')}
                      style={{ flex: 1, padding: '0.4rem 0', borderRadius: '6px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: status === 'KELMADI' ? 'var(--danger-bg)' : 'transparent', color: status === 'KELMADI' ? 'var(--danger)' : 'var(--text-muted)' }}
                    >
                      Kelmadi
                    </button>
                    <button 
                      onClick={() => handleStatusChange(w.id, 'RUXSAT')}
                      style={{ flex: 1, padding: '0.4rem 0', borderRadius: '6px', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: status === 'RUXSAT' ? 'var(--warning-bg)' : 'transparent', color: status === 'RUXSAT' ? 'var(--warning)' : 'var(--text-muted)' }}
                    >
                      Ruxsat
                    </button>
                  </div>

                  {/* Comment Input */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <input 
                      type="text" 
                      className="input"
                      placeholder="Qo'shimcha izoh..."
                      style={{ paddingLeft: '2.25rem', background: att?.izoh ? 'var(--bg-surface)' : 'transparent', border: att?.izoh ? '1px solid var(--border-hover)' : '1px dashed var(--border)' }}
                      value={att?.izoh || ''}
                      onChange={(e) => handleIzohChange(w.id, e.target.value)}
                    />
                  </div>
                  
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
