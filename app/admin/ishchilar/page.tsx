'use client'

import { useState } from 'react'
import { useWorkers, storeCreateWorker } from '@/lib/store'

export default function IshchilarPage() {
  const { workers, loading } = useWorkers()
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const ism = formData.get('ism') as string
    const telefon = formData.get('telefon') as string
    const lavozim = formData.get('lavozim') as string

    if (ism && telefon) {
      storeCreateWorker({ ism, telefon, lavozim })
      setShowAddForm(false)
    }
  }

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Ishchilar</h1>
          <p className="page-subtitle">Barcha ishchilar ro&apos;yxati va ularni boshqarish</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Bekor qilish' : '+ Ishchi qo\'shish'}
        </button>
      </div>

      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', maxWidth: '600px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>Yangi ishchi qo&apos;shish</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="input-group">
              <label className="input-label" htmlFor="ism">F.I.O. *</label>
              <input id="ism" name="ism" type="text" required className="input" placeholder="Ism familiya" />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="telefon">Telefon raqami *</label>
              <input id="telefon" name="telefon" type="tel" required className="input" placeholder="+998 90 123 45 67" />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="lavozim">Lavozim (ixtiyoriy)</label>
              <input id="lavozim" name="lavozim" type="text" className="input" placeholder="Masalan: Yuvuvchi" />
            </div>
            <div className="form-actions" style={{ marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      )}

      {workers.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">👥</div>
          <p style={{ fontWeight: 600 }}>Hali ishchilar qo&apos;shilmagan</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Yangi ishchi qo&apos;shish uchun yuqoridagi tugmani bosing</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>F.I.O.</th>
                <th>Telefon</th>
                <th>Lavozim</th>
                <th>Qo&apos;shilgan sana</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(w => (
                <tr key={w.id}>
                  <td style={{ color: 'var(--text-muted)' }}>#{w.id}</td>
                  <td style={{ fontWeight: 500 }}>{w.ism}</td>
                  <td>{w.telefon}</td>
                  <td>{w.lavozim || '-'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(w.createdAt).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
