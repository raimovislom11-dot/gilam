'use client'

import { useState } from 'react'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import type { Order, QarzHolati } from '@/lib/types'
import { useOrders, storeUpdateOrder } from '@/lib/store'

export function OperatorJarayondaClient({ role = 'OPERATOR' }: { role?: 'OPERATOR' | 'ADMIN' }) {
  const { orders, loading } = useOrders('JARAYONDA')
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<QarzHolati>('TOLANGAN')
  const [paidAmount, setPaidAmount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTugallash = (order: Order) => {
    setSelectedOrder(order)
    setPaymentStatus('TOLANGAN')
    setPaidAmount(order.summa ? order.summa.toString() : '')
  }

  const submitPayment = () => {
    if (!selectedOrder) return
    setIsSubmitting(true)
    
    let finalAmount = 0
    if (paymentStatus === 'TOLANGAN') {
      finalAmount = selectedOrder.summa || 0
    } else if (paymentStatus === 'QISMAN') {
      finalAmount = Number(paidAmount) || 0
    } else {
      finalAmount = 0 // TOLANMAGAN
    }

    storeUpdateOrder(selectedOrder.id, {
      status: 'YUBORILDI',
      qarzHolati: paymentStatus,
      tolanganSumma: finalAmount
    })

    setTimeout(() => {
      setIsSubmitting(false)
      setSelectedOrder(null)
    }, 300)
  }

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Jarayonda</h1>
          <p className="page-subtitle">Yetkazib berilayotgan (yo'ldagi) zakazlar</p>
        </div>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 10, padding: '0.5rem 1rem', color: 'var(--primary)', fontWeight: 600 }}>
          {orders.length} ta zakaz
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🚚</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Jarayondagi zakazlar yo'q</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Tayyor zakazlar chiqarib yuborilganda bu yerga tushadi</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="order-id">#{order.id}</span>
                    <span className="badge badge-ishda">JARAYONDA</span>
                  </div>
                  <h3 style={{ margin: '0.375rem 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>{order.mijozIsmi}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>📞 {order.telefon}</span>
                    <span>📍 {order.manzil}</span>
                  </div>
                </div>
                <button onClick={() => handleTugallash(order)} className="btn btn-primary">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Tugallash
                </button>
              </div>

              <div className="divider" />

              <div className="detail-grid">
                <div className="detail-item"><div className="detail-item-label">Gilam</div><div className="detail-item-value">{formatNumber(order.gilamSoni, 'dona')}</div></div>
                <div className="detail-item"><div className="detail-item-label">Adyol</div><div className="detail-item-value">{formatNumber(order.adyolSoni, 'dona')}</div></div>
                <div className="detail-item"><div className="detail-item-label">Hajm</div><div className="detail-item-value">{formatNumber(order.umumiyHajm, 'm²')}</div></div>
                <div className="detail-item"><div className="detail-item-label">Jami Summa</div><div className="detail-item-value" style={{ color: 'var(--success)' }}>{formatCurrency(order.summa)}</div></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-title">To'lovni qabul qilish</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)} style={{ padding: '0.25rem' }}>✕</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', background: 'var(--bg)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mijoz: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedOrder.mijozIsmi}</span></div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Jami summa: <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(selectedOrder.summa)}</span></div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">To'lov holati *</label>
                <select 
                  className="input" 
                  value={paymentStatus} 
                  onChange={(e) => {
                    const st = e.target.value as QarzHolati
                    setPaymentStatus(st)
                    if (st === 'TOLANGAN') setPaidAmount(selectedOrder.summa ? selectedOrder.summa.toString() : '')
                    if (st === 'TOLANMAGAN') setPaidAmount('0')
                  }}
                >
                  <option value="TOLANGAN">To'liq to'landi</option>
                  <option value="QISMAN">Qisman to'landi</option>
                  <option value="TOLANMAGAN">To'lanmadi (Qarz)</option>
                </select>
              </div>

              {paymentStatus === 'QISMAN' && (
                <div className="input-group">
                  <label className="input-label">To'langan summa (so'm) *</label>
                  <input 
                    type="number" 
                    className="input" 
                    placeholder="Masalan: 50000"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setSelectedOrder(null)}>Bekor qilish</button>
              <button className="btn btn-primary" onClick={submitPayment} disabled={isSubmitting || (paymentStatus === 'QISMAN' && !paidAmount)}>
                {isSubmitting ? 'Saqlanmoqda...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
