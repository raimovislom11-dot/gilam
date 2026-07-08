'use client'

import { useState } from 'react'
import { formatCurrency, formatDate, formatNumber, getQarzLabel } from '@/lib/utils'
import { useOrders } from '@/lib/store'

export function OperatorYuborilganlarClient() {
  const { orders: allOrders, loading } = useOrders()
  // Currently we just show all YUBORILDI orders as a demo,
  // normally it would be filtered by the current operator.
  const orders = allOrders.filter(o => o.status === 'YUBORILDI')

  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.mijozIsmi.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="page-title">Yuborilganlar</h1>
          <p className="page-subtitle">Siz tomonidan yuborilgan zakazlar tarixi</p>
        </div>
        <div style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 10, padding: '0.5rem 1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {filtered.length} ta zakaz
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="filter-bar">
          <div className="search-bar" style={{ flex: '1 1 200px' }}>
            <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" className="input" placeholder="Mijoz ismi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dan:</span>
            <input type="date" className="input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gacha:</span>
            <input type="date" className="input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          {(search || dateFrom || dateTo) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDateFrom(''); setDateTo('') }}>✕ Tozalash</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📤</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Hech narsa topilmadi</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Mijoz</th><th>Telefon</th><th>Hajm</th><th>Summa</th><th>Qarz holati</th><th>Yuborilgan sana</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td><span className="order-id">#{order.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{order.mijozIsmi}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{order.telefon}</td>
                  <td>{formatNumber(order.umumiyHajm, 'm²')}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(order.summa)}</td>
                  <td><span className={`badge badge-${order.qarzHolati.toLowerCase()}`}>{getQarzLabel(order.qarzHolati)}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(order.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
