'use client'

import { useState } from 'react'
import { formatCurrency, formatDate, fileToBase64 } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { useOrders, storeUpdateOrder } from '@/lib/store'

function WorkOrderCard({ order, role }: { order: Order, role?: string }) {
  const [isPending, setIsPending] = useState(false)
  const [isEditingHajm, setIsEditingHajm] = useState(false)
  const [newHajm, setNewHajm] = useState(order.umumiyHajm?.toString() || '')

  const handleComplete = () => {
    setIsPending(true)
    storeUpdateOrder(order.id, { 
      status: 'TAYYOR',
      bajarganIshchiLogin: 'Ishchi',
    })
    setTimeout(() => setIsPending(false), 500)
  }

  const handleSaveHajm = () => {
    const val = parseFloat(newHajm)
    if (!isNaN(val) && val !== order.umumiyHajm) {
      storeUpdateOrder(order.id, {
        umumiyHajm: val,
        eskiHajm: order.umumiyHajm,
      })
    }
    setIsEditingHajm(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    try {
      const newImages = await Promise.all(
        Array.from(e.target.files).map(file => fileToBase64(file))
      )
      storeUpdateOrder(order.id, {
        rasmlar: [...(order.rasmlar || []), ...newImages]
      })
    } catch (err) {
      console.error('Image upload failed', err)
      alert('Rasmni yuklashda xatolik yuz berdi')
    }
  }

  const currentUserRole = role || 'ISHCHI'
  const canEdit = ['ISHCHI', 'ADMIN'].includes(currentUserRole)

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
          <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="detail-item-label">📐 Hajm</div>
              {isEditingHajm ? (
                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="input"
                    style={{ width: '70px', padding: '0.25rem 0.5rem', fontSize: '0.875rem', minHeight: '30px' }}
                    value={newHajm}
                    onChange={(e) => setNewHajm(e.target.value)}
                    autoFocus
                  />
                  <button onClick={handleSaveHajm} className="btn btn-primary" style={{ padding: '0.25rem', height: '30px', minHeight: '30px' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button onClick={() => { setIsEditingHajm(false); setNewHajm(order.umumiyHajm?.toString() || ''); }} className="btn btn-ghost" style={{ padding: '0.25rem', height: '30px', minHeight: '30px' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ) : (
                <div className="detail-item-value" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {order.eskiHajm != null ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.eskiHajm}</span>
                      <span>{order.umumiyHajm} m²</span>
                    </>
                  ) : (
                    <span>{order.umumiyHajm} m²</span>
                  )}
                  {canEdit && (
                    <button onClick={() => setIsEditingHajm(true)} className="btn btn-ghost" style={{ padding: '0.125rem', height: 'auto', minHeight: 0, color: 'var(--text-secondary)' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {order.summa != null && role !== 'ISHCHI' && (
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

      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Rasmlar</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {order.rasmlar?.map((src, i) => (
            <div key={i} style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="biriktirilgan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
          {canEdit && (
            <label style={{ width: 60, height: 60, borderRadius: 8, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </label>
          )}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        🕐 {formatDate(order.updatedAt)}
      </div>
    </div>
  )
}

export function IshchiClient({ role }: { role?: string }) {
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
          {orders.map((order) => <WorkOrderCard key={order.id} order={order} role={role} />)}
        </div>
      )}
    </>
  )
}
