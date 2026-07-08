'use client'

import { useState } from 'react'
import { formatCurrency, getQarzLabel } from '@/lib/utils'
import { useDebt, storeUpdateOrder } from '@/lib/store'
import type { QarzHolati } from '@/lib/types'

export function AdminQarzClient() {
  const { orders, totalDebt, loading } = useDebt()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSave = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    const tolanganSumma = parseInt(formData.get('tolanganSumma') as string) || 0
    const qarzHolati = formData.get('qarzHolati') as QarzHolati

    storeUpdateOrder(id, { tolanganSumma, qarzHolati })
    
    setEditingId(null)
    setIsPending(false)
  }

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Qarz</h1>
          <p className="page-subtitle">To&apos;lanmagan va qisman to&apos;langan zakazlar</p>
        </div>
      </div>

      <div className="stats-card" style={{ marginBottom: '1.5rem', maxWidth: 360 }}>
        <div className="stat-label">Jami qarzdorlik</div>
        <div className="stat-number" style={{ color: 'var(--danger)' }}>
          {new Intl.NumberFormat('uz-UZ').format(totalDebt)} so&apos;m
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{orders.length} ta zakaz</div>
      </div>

      {orders.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">✅</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Barcha zakazlar to&apos;langan!</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Telefon</th>
                <th>Summa</th>
                <th>To&apos;langan</th>
                <th>Qoldiq</th>
                <th>Holat</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const qoldiq = (order.summa ?? 0) - order.tolanganSumma
                const isEditing = editingId === order.id
                return (
                  <tr key={order.id}>
                    <td><span className="order-id">#{order.id}</span></td>
                    <td style={{ fontWeight: 500 }}>{order.mijozIsmi}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{order.telefon}</td>
                    <td>{formatCurrency(order.summa)}</td>
                    <td>
                      {isEditing ? (
                        <input form={`debt-form-${order.id}`} name="tolanganSumma" type="number" min="0" step="100" defaultValue={order.tolanganSumma} className="input" style={{ width: 130 }} />
                      ) : formatCurrency(order.tolanganSumma)}
                    </td>
                    <td style={{ color: qoldiq > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                      {formatCurrency(Math.max(0, qoldiq))}
                    </td>
                    <td>
                      {isEditing ? (
                        <select form={`debt-form-${order.id}`} name="qarzHolati" defaultValue={order.qarzHolati} className="input" style={{ width: 130 }}>
                          <option value="TOLANMAGAN">To&apos;lanmagan</option>
                          <option value="QISMAN">Qisman</option>
                          <option value="TOLANGAN">To&apos;langan</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${order.qarzHolati.toLowerCase()}`}>
                          {getQarzLabel(order.qarzHolati)}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <form id={`debt-form-${order.id}`} onSubmit={(e) => handleSave(order.id, e)} style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit" disabled={isPending} className="btn btn-success btn-sm">
                            {isPending ? <span className="spinner" /> : '✓ Saqlash'}
                          </button>
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Bekor</button>
                        </form>
                      ) : (
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(order.id)}>✏️ Tahrirlash</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
