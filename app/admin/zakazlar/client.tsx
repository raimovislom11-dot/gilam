'use client'

import { useState } from 'react'
import { formatDate, fileToBase64 } from '@/lib/utils'
import type { Order } from '@/lib/types'
import { useOrders, storeUpdateOrder } from '@/lib/store'

export function AdminZakazlarClient() {
  const { orders: allOrders, loading } = useOrders()
  const orders = allOrders.filter((o) => o.status === 'YANGI')
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [editingImages, setEditingImages] = useState<string[]>([])

  const openEditModal = (order: Order) => {
    setSelectedOrder(order)
    setEditingImages(order.rasmlar || [])
    setError('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    try {
      const newImages = await Promise.all(
        Array.from(e.target.files).map(file => fileToBase64(file))
      )
      setEditingImages(prev => [...prev, ...newImages])
    } catch (err) {
      console.error('Image upload failed', err)
      setError('Rasmni yuklashda xatolik yuz berdi')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedOrder) return
    setError('')
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    const parse = (key: string) => formData.get(key) as string | null
    const num = (key: string) => { const v = parse(key); return v ? parseInt(v) : null }
    const flt = (key: string) => { const v = parse(key); return v ? parseFloat(v) : null }

    try {
      storeUpdateOrder(selectedOrder.id, {
        status: 'ISHDA',
        gilamSoni: num('gilamSoni'),
        adyolSoni: num('adyolSoni'),
        pardaOgirligi: flt('pardaOgirligi'),
        korpaSoni: num('korpaSoni'),
        umumiyHajm: flt('umumiyHajm'),
        summa: flt('summa'),
        rasmlar: editingImages,
        izohAdmin: parse('izohAdmin') || null,
        tahrirlaganAdminLogin: 'admin',
      })
      setSelectedOrder(null)
    } catch {
      setError('Xatolik yuz berdi. Qayta urinib ko\'ring.')
    } finally {
      setIsPending(false)
    }
  }

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Zakazlar</h1>
          <p className="page-subtitle">Yangi buyurtmalar ro&apos;yxati</p>
        </div>
        <div style={{
          background: 'var(--info-bg)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 10,
          padding: '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--info)',
          fontWeight: 600,
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
          </svg>
          {orders.length} ta yangi zakaz
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📋</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Yangi zakazlar yo&apos;q</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Operator yangi zakaz yaratganda shu yerda ko&apos;rinadi
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <span className="order-id">#{order.id}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{order.mijozIsmi}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.telefon}</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>📍 {order.manzil}</div>
                {order.izohOperator && (
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    💬 {order.izohOperator}
                  </div>
                )}
                {order.yaratganOperatorLogin && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    👤 {order.yaratganOperatorLogin}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatDate(order.createdAt)}
                </span>
                <span className="badge badge-yangi">YANGI</span>
                <button className="btn btn-primary btn-sm" onClick={() => openEditModal(order)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Tahrirlash
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Zakazni tahrirlash</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {selectedOrder.mijozIsmi} — {selectedOrder.telefon}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedOrder(null)} style={{ padding: '0.375rem' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label">Zakaz ID (avtomatik)</label>
              <input type="text" className="input input-readonly" value={`#${selectedOrder.id}`} readOnly />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label" htmlFor="gilamSoni">Gilam (dona)</label>
                  <input id="gilamSoni" name="gilamSoni" type="number" min="0" className="input" placeholder="0" defaultValue={selectedOrder.gilamSoni ?? ''} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="adyolSoni">Adyol (dona)</label>
                  <input id="adyolSoni" name="adyolSoni" type="number" min="0" className="input" placeholder="0" defaultValue={selectedOrder.adyolSoni ?? ''} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="pardaOgirligi">Parda (kg)</label>
                  <input id="pardaOgirligi" name="pardaOgirligi" type="number" step="0.1" min="0" className="input" placeholder="0.0" defaultValue={selectedOrder.pardaOgirligi ?? ''} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="korpaSoni">Ko&apos;rpa (dona)</label>
                  <input id="korpaSoni" name="korpaSoni" type="number" min="0" className="input" placeholder="0" defaultValue={selectedOrder.korpaSoni ?? ''} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="umumiyHajm">Umumiy hajm (m²)</label>
                  <input id="umumiyHajm" name="umumiyHajm" type="number" step="0.01" min="0" className="input" placeholder="0.00" defaultValue={selectedOrder.umumiyHajm ?? ''} />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="summa">Summa (so&apos;m)</label>
                  <input id="summa" name="summa" type="number" step="100" min="0" className="input" placeholder="0" defaultValue={selectedOrder.summa ?? ''} />
                </div>
              </div>
              <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                <label className="input-label">Rasmlar</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {editingImages.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="biriktirilgan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setEditingImages(prev => prev.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&times;</button>
                    </div>
                  ))}
                  <label style={{ width: 80, height: 80, borderRadius: 8, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </label>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="izohAdmin">Admin izohi</label>
                <textarea id="izohAdmin" name="izohAdmin" className="input" placeholder="Izoh..." rows={3} style={{ resize: 'vertical' }} defaultValue={selectedOrder.izohAdmin ?? ''} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setSelectedOrder(null)}>Bekor qilish</button>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                  {isPending ? <><span className="spinner" /> Saqlanmoqda...</> : <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Jo&apos;natish
                  </>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
