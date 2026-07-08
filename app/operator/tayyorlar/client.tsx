'use client'

import { useState } from 'react'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { useOrders, storeUpdateOrder } from '@/lib/store'

function OrderCard({ order }: { order: Order }) {
  const [isPending, setIsPending] = useState(false)

  const handleSend = () => {
    setIsPending(true)
    storeUpdateOrder(order.id, { 
      status: 'YUBORILDI',
      chiqarganOperatorLogin: 'Operator',
    })
    // No need to reset setIsPending to false if the card unmounts,
    // but just in case it doesn't unmount immediately:
    setTimeout(() => setIsPending(false), 500)
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="order-id">#{order.id}</span>
            <span className="badge badge-tayyor">TAYYOR</span>
          </div>
          <h3 style={{ margin: '0.375rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>{order.mijozIsmi}</h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>📞 {order.telefon}</span>
            <span>📍 {order.manzil}</span>
          </div>
        </div>
        <button onClick={handleSend} disabled={isPending} className="btn btn-success">
          {isPending ? (
            <><span className="spinner" /> Yuborilmoqda...</>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Chiqarib yuborish
            </>
          )}
        </button>
      </div>

      <div className="divider" />

      <div className="detail-grid">
        <div className="detail-item"><div className="detail-item-label">Gilam</div><div className="detail-item-value">{formatNumber(order.gilamSoni, 'dona')}</div></div>
        <div className="detail-item"><div className="detail-item-label">Adyol</div><div className="detail-item-value">{formatNumber(order.adyolSoni, 'dona')}</div></div>
        <div className="detail-item"><div className="detail-item-label">Parda</div><div className="detail-item-value">{formatNumber(order.pardaOgirligi, 'kg')}</div></div>
        <div className="detail-item"><div className="detail-item-label">Ko&apos;rpa</div><div className="detail-item-value">{formatNumber(order.korpaSoni, 'dona')}</div></div>
        <div className="detail-item"><div className="detail-item-label">Hajm</div><div className="detail-item-value">{formatNumber(order.umumiyHajm, 'm²')}</div></div>
        <div className="detail-item"><div className="detail-item-label">Summa</div><div className="detail-item-value" style={{ color: 'var(--success)' }}>{formatCurrency(order.summa)}</div></div>
      </div>

      {(order.izohOperator || order.izohAdmin) && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {order.izohOperator && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>💬 {order.izohOperator}</span>}
          {order.izohAdmin && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📝 Admin: {order.izohAdmin}</span>}
        </div>
      )}

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
        {order.bajarganIshchiLogin && <span>🔧 Bajardi: {order.bajarganIshchiLogin}</span>}
        <span>🕐 {formatDate(order.updatedAt)}</span>
      </div>
    </div>
  )
}

export function OperatorTayyorlarClient() {
  const { orders, loading } = useOrders('TAYYOR')

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tayyorlar</h1>
          <p className="page-subtitle">Ishchi tomonidan tayyor qilingan buyurtmalar</p>
        </div>
        <div style={{ background: 'var(--success-bg)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: '0.5rem 1rem', color: 'var(--success)', fontWeight: 600 }}>
          {orders.length} ta tayyor
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">✅</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Tayyor zakazlar yo&apos;q</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Ishchi zakazni tugatgach shu yerda ko&apos;rinadi</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '1rem' }}>
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </>
  )
}
