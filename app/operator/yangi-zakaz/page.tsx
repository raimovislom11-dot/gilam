'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { storeCreateOrder } from '@/lib/store'

export default function YangiZakazPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const mijozIsmi = formData.get('mijozIsmi') as string
    const manzil = formData.get('manzil') as string
    const telefon = formData.get('telefon') as string
    const izohOperator = formData.get('izohOperator') as string

    if (!mijozIsmi || !manzil || !telefon) {
      setError('Iltimos, barcha majburiy maydonlarni to\'ldiring.')
      setIsPending(false)
      return
    }

    try {
      storeCreateOrder({ mijozIsmi, manzil, telefon, izohOperator })
      // Navigate to somewhere or reset form
      // Let's just reset form and show success
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
      alert('Zakaz muvaffaqiyatli yaratildi!')
    } catch {
      setError('Xatolik yuz berdi.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Yangi Zakaz</h1>
          <p className="page-subtitle">Mijozdan kelgan yangi buyurtmani kiritish</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-grid-2">
            <div className="input-group">
              <label className="input-label" htmlFor="mijozIsmi">Mijoz ismi *</label>
              <input id="mijozIsmi" name="mijozIsmi" type="text" required className="input" placeholder="Masalan: Alisher Valiyev" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="telefon">Telefon raqami *</label>
              <input id="telefon" name="telefon" type="tel" required className="input" placeholder="+998 90 123 45 67" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="manzil">Manzil (To&apos;liq) *</label>
            <input id="manzil" name="manzil" type="text" required className="input" placeholder="Tuman, ko'cha, uy, mo'ljal..." />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="izohOperator">Qo&apos;shimcha izoh (ixtiyoriy)</label>
            <textarea id="izohOperator" name="izohOperator" className="input" placeholder="Mijozning maxsus talablari yoki olib ketish vaqti haqida..." rows={3} style={{ resize: 'vertical' }} />
          </div>

          <div className="form-actions" style={{ marginTop: '1rem' }}>
            <button type="submit" disabled={isPending} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {isPending ? <><span className="spinner" /> Saqlanmoqda...</> : <>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Saqlash va Adminga jo&apos;natish
              </>}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
