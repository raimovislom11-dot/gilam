'use client'

import { useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { useOrders, storeUpdateOrder } from '@/lib/store'

function WorkOrderCard({ order }: { order: Order }) {
  const [isPending, setIsPending] = useState(false)

  const handleComplete = () => {
    setIsPending(true)
    storeUpdateOrder(order.id, { 
      status: 'TAYYOR',
      bajarganIshchiLogin: 'Ishchi',
    })
    setTimeout(() => setIsPending(false), 500)
  }

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--warning), var(--primary))',
        borderRadius: '14px 14px 0 0',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="order-id">#{order.id}</span>
            <span className="badge badge-ishda">ISHDA</span>
          </div>
          <h3 style={{ margin: '0.375rem 0 0.25rem', fontSize: '1.25rem', fontWeight: 700 }}>{order.mijozIsmi}</h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>📞 {order.telefon}</span>
            <span>📍 {order.manzil}</span>
          </div>
        </div>
        <button onClick={handleComplete} disabled={isPending} className="btn btn-primary" style={{ boxShadow: '0 0 24px var(--primary-glow)' }}>
          {isPending ? (
            <><span className="spinner" /> Saqlanmoqda...</>
          ) : (
            <>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Tugallandi
            </>
          )}
        </button>
      </div>

      <div className="divider" />

      <div className="detail-grid">
        {order.gilamSoni != null && (
          <div className="detail-item"><div className="detail-item-label">🪄 Gilam</div><div className="detail-item-value">{order.gilamSoni} dona</div></div>
        )}
        {order.adyolSoni != null && (
          <div className="detail-item"><div className="detail-item-label">🛏 Adyol</div><div className="detail-item-value">{order.adyolSoni} dona</div></div>
        )}
        {order.pardaOgirligi != null && (
          <div className="detail-item"><div className="detail-item-label">🪟 Parda</div><div className="detail-item-value">{order.pardaOgirligi} kg</div></div>
        )}
        {order.korpaSoni != null && (
          <div className="detail-item"><div className="detail-item-label">🧸 Ko&apos;rpa</div><div className="detail-item-value">{order.korpaSoni} dona</div></div>
        )}
        {order.umumiyHajm != null && (
          <div className="detail-item"><div className="detail-item-label">📐 Hajm</div><div className="detail-item-value">{order.umumiyHajm} m²</div></div>
        )}
        {order.summa != null && (
          <div className="detail-item"><div className="detail-item-label">💰 Summa</div><div className="detail-item-value" style={{ color: 'var(--success)' }}>{formatCurrency(order.summa)}</div></div>
        )}
      </div>

      {(order.izohOperator || order.izohAdmin) && (
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
          {order.izohOperator && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: order.izohAdmin ? '0.375rem' : 0 }}>
              💬 <strong>Operator:</strong> {order.izohOperator}
            </div>
          )}
          {order.izohAdmin && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              📝 <strong>Admin:</strong> {order.izohAdmin}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        🕐 {formatDate(order.updatedAt)}
      </div>
    </div>
  )
}

export function IshchiClient() {
  const { orders, loading } = useOrders('ISHDA')

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mening Zakazlarim</h1>
          <p className="page-subtitle">Bajarish kerak bo&apos;lgan buyurtmalar</p>
        </div>
        <div style={{ background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: '0.5rem 1rem', color: 'var(--warning)', fontWeight: 600 }}>
          {orders.length} ta zakaz
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎉</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Barcha zakazlar bajarildi!</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Admin yangi zakaz yuborsa shu yerda ko&apos;rinadi</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
          {orders.map((order) => <WorkOrderCard key={order.id} order={order} />)}
        </div>
      )}
    </>
  )
}
