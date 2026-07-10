'use client'

import { useState } from 'react'
import { formatCurrency, formatDate, formatNumber, getQarzLabel } from '@/lib/utils'
import { useOrders } from '@/lib/store'

export function AdminArxivClient() {
  const { orders: allOrders, loading } = useOrders()
  const orders = allOrders.filter(o => o.status === 'YUBORILDI' && o.qarzHolati === 'TOLANGAN')

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.mijozIsmi.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search)
    const orderDate = new Date(o.updatedAt)
    const from = dateFrom ? new Date(dateFrom) : null
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : null
    return matchSearch && (!from || orderDate >= from) && (!to || orderDate <= to)
  })

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Arxiv</h1>
          <p className="page-subtitle">Yuborilgan barcha zakazlar tarixi</p>
        </div>
        <div style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {filtered.length} / {orders.length} ta zakaz
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="filter-bar">
          <div className="search-bar" style={{ flex: '1 1 220px' }}>
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" className="input" placeholder="Mijoz ismi yoki ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Dan:</span>
            <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Gacha:</span>
            <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          {(search || dateFrom || dateTo) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDateFrom(''); setDateTo('') }}>✕ Tozalash</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🗂️</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Hech narsa topilmadi</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((order) => (
            <div key={order.id} className="card">
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer' }}
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="order-id">#{order.id}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.mijozIsmi}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.telefon}</div>
                  </div>
                  <span className="badge badge-yuborildi">YUBORILDI</span>
                  <span className={`badge badge-${order.qarzHolati.toLowerCase()}`}>
                    {getQarzLabel(order.qarzHolati)}
                  </span>
                  {order.summa && <span style={{ fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(order.summa)}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(order.updatedAt)}</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    style={{ transform: expandedId === order.id ? 'rotate(180deg)' : 'none', transition: '0.2s', color: 'var(--text-muted)' }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>

              {expandedId === order.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div className="detail-grid">
                    <div className="detail-item"><div className="detail-item-label">Manzil</div><div className="detail-item-value">{order.manzil}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Gilam</div><div className="detail-item-value">{formatNumber(order.gilamSoni, 'dona')}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Adyol</div><div className="detail-item-value">{formatNumber(order.adyolSoni, 'dona')}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Parda</div><div className="detail-item-value">{formatNumber(order.pardaOgirligi, 'kg')}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Ko&apos;rpa</div><div className="detail-item-value">{formatNumber(order.korpaSoni, 'dona')}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Hajm</div><div className="detail-item-value">{formatNumber(order.umumiyHajm, 'm²')}</div></div>
                    <div className="detail-item"><div className="detail-item-label">Summa</div><div className="detail-item-value">{formatCurrency(order.summa)}</div></div>
                    <div className="detail-item"><div className="detail-item-label">To&apos;langan</div><div className="detail-item-value">{formatCurrency(order.tolanganSumma)}</div></div>
                  </div>
                  {(order.izohOperator || order.izohAdmin) && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {order.izohOperator && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💬 Operator: {order.izohOperator}</div>}
                      {order.izohAdmin && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📝 Admin: {order.izohAdmin}</div>}
                    </div>
                  )}
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {order.yaratganOperatorLogin && <span>📋 Yaratdi: {order.yaratganOperatorLogin}</span>}
                    {order.tahrirlaganAdminLogin && <span>✏️ Tahrirladi: {order.tahrirlaganAdminLogin}</span>}
                    {order.bajarganIshchiLogin && <span>🔧 Bajardi: {order.bajarganIshchiLogin}</span>}
                    {order.chiqarganOperatorLogin && <span>📤 Chiqardi: {order.chiqarganOperatorLogin}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
