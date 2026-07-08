'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAnalytics } from '@/lib/store'
import type { AnalyticsPoint, AnalyticsTotals, Order } from '@/lib/types'

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`
}

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
function getMonthKey(dateStr: string): string {
  return MONTHS[new Date(dateStr).getMonth()]
}

function aggregateOrders(
  orders: Order[],
  period: 'weekly' | 'monthly'
): { chartData: AnalyticsPoint[]; totals: AnalyticsTotals } {
  const grouped: Record<string, { summa: number; hajm: number; count: number }> = {}

  for (const o of orders) {
    const label = period === 'weekly' ? getWeekKey(o.createdAt) : getMonthKey(o.createdAt)
    if (!grouped[label]) grouped[label] = { summa: 0, hajm: 0, count: 0 }
    grouped[label].summa += o.summa ?? 0
    grouped[label].hajm += o.umumiyHajm ?? 0
    grouped[label].count += 1
  }

  const chartData = Object.entries(grouped).map(([label, v]) => ({ label, ...v }))

  const totals: AnalyticsTotals = {
    summa: orders.reduce((s, o) => s + (o.summa ?? 0), 0),
    hajm: orders.reduce((s, o) => s + (o.umumiyHajm ?? 0), 0),
    adyolKorpa: orders.reduce((s, o) => s + (o.adyolSoni ?? 0) + (o.korpaSoni ?? 0), 0),
    count: orders.length,
  }

  return { chartData, totals }
}

export function AdminAnalitikaClient() {
  const { orders, loading } = useAnalytics()
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly')

  const { chartData, totals } = useMemo(() => {
    return aggregateOrders(orders, period)
  }, [orders, period])

  const formatK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}M` : `${Math.round(v)}K`

  if (loading) return <div className="page-header"><h1 className="page-title">Yuklanmoqda...</h1></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analitika</h1>
          <p className="page-subtitle">Yuborilgan zakazlar statistikasi</p>
        </div>
        <div className="tabs" style={{ marginBottom: 0, width: 'auto' }}>
          <button className={`tab-btn ${period === 'weekly' ? 'active' : ''}`} onClick={() => setPeriod('weekly')}>Haftalik</button>
          <button className={`tab-btn ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>Oylik</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stats-card">
          <div className="stat-label">Umumiy summa</div>
          <div className="stat-number gradient-text">
            {new Intl.NumberFormat('uz-UZ').format(Math.round(totals.summa / 1000000))} mln
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>so&apos;m</div>
        </div>
        <div className="stats-card">
          <div className="stat-label">Umumiy hajm</div>
          <div className="stat-number" style={{ color: 'var(--accent)' }}>
            {Math.round(totals.hajm * 10) / 10}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>m²</div>
        </div>
        <div className="stats-card">
          <div className="stat-label">Adyol + Ko&apos;rpa</div>
          <div className="stat-number" style={{ color: 'var(--success)' }}>{totals.adyolKorpa}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>dona</div>
        </div>
        <div className="stats-card">
          <div className="stat-label">Jami zakazlar</div>
          <div className="stat-number" style={{ color: 'var(--warning)' }}>{totals.count}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ta</div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">📊</div>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Hali ma&apos;lumot yo&apos;q</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Zakazlar yuborilgandan so&apos;ng grafik ko&apos;rinadi
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 600 }}>💰 Summa (ming so&apos;m)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData.map(d => ({ ...d, Summa: Math.round(d.summa / 1000) }))}>
                <defs>
                  <linearGradient id="colorSumma" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatK} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 13 }}
                  formatter={(v) => [`${Number(v)}K so'm`, 'Summa']}
                />
                <Area type="monotone" dataKey="Summa" stroke="#6366f1" strokeWidth={2} fill="url(#colorSumma)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 600 }}>📐 Hajm (m²)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.map(d => ({ ...d, Hajm: Math.round(d.hajm * 10) / 10 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 12 }} formatter={(v) => [`${Number(v)} m²`, 'Hajm']} />
                  <Bar dataKey="Hajm" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 600 }}>📦 Zakazlar soni</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.map(d => ({ ...d, Zakazlar: d.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 12 }} formatter={(v) => [`${Number(v)} ta`, 'Zakazlar']} />
                  <Bar dataKey="Zakazlar" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
