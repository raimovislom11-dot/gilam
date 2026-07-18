'use client'

import { useState, useEffect } from 'react'
import type { Order, OrderStatus, QarzHolati, Worker, Attendance, AttendanceStatus, DebtSummaryResponse } from './types'

// ─── Event Dispatch Helpers ──────────────────────────────────────────────────
function notifyDataChanged() {
  window.dispatchEvent(new Event('gilam-data-changed'))
}

function notifyWorkersChanged() {
  window.dispatchEvent(new Event('gilam-workers-changed'))
}

function notifyAttendancesChanged() {
  window.dispatchEvent(new Event('gilam-attendances-changed'))
}

// ─── CRUD Actions ────────────────────────────────────────────────────────────

export async function storeCreateOrder(data: {
  mijozIsmi: string
  manzil: string
  telefon: string
  izohOperator?: string | null
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to create order')
  }
  const order = await res.json() as Order
  notifyDataChanged()
  return order
}

export async function storeReorder(data: {
  mijozIsmi: string
  manzil: string
  telefon: string
  izohOperator?: string | null
  gilamSoni?: number | null
  adyolSoni?: number | null
  pardaOgirligi?: number | null
  korpaSoni?: number | null
  umumiyHajm?: number | null
  summa?: number | null
  izohAdmin?: string | null
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to reorder')
  }
  const order = await res.json() as Order
  notifyDataChanged()
  return order
}

export async function storeUpdateOrder(id: number, updates: Partial<Order>): Promise<boolean> {
  const res = await fetch(`/api/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    console.error('Update order failed:', await res.text())
    return false
  }
  notifyDataChanged()
  return true
}

// ─── React Hooks for Data Fetching ───────────────────────────────────────────

export function useOrders(status?: OrderStatus | OrderStatus[]): {
  orders: Order[]
  loading: boolean
} {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        let url = '/api/orders'
        if (status && !Array.isArray(status)) {
          url += `?status=${status}`
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch orders')
        
        let all = await res.json() as Order[]
        
        // If status was an array, filter it client-side
        if (status && Array.isArray(status)) {
          all = all.filter(o => status.includes(o.status))
        }
        
        setOrders(all)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    window.addEventListener('gilam-data-changed', load)
    return () => window.removeEventListener('gilam-data-changed', load)
  }, [status])

  return { orders, loading }
}

export function useAnalytics(): {
  orders: Order[]
  loading: boolean
} {
  return useOrders('YUBORILDI')
}

export function useDebt(): {
  orders: Order[]
  totalDebt: number
  loading: boolean
} {
  const [result, setResult] = useState<{ orders: Order[]; totalDebt: number }>({
    orders: [],
    totalDebt: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/orders/debt-summary')
        if (!res.ok) throw new Error('Failed to fetch debt summary')
        
        const data = await res.json() as DebtSummaryResponse
        setResult({
          orders: data.orders || [],
          totalDebt: data.totalDebt || 0
        })
      } catch (err) {
        console.error('Error fetching debt summary:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    window.addEventListener('gilam-data-changed', load)
    return () => window.removeEventListener('gilam-data-changed', load)
  }, [])

  return { ...result, loading }
}

// ─── Workers & Attendance ───────────────────────────────────────────────────

export async function storeCreateWorker(data: { ism: string; telefon: string; lavozim?: string }): Promise<Worker> {
  const res = await fetch('/api/workers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to create worker')
  }
  const worker = await res.json() as Worker
  notifyWorkersChanged()
  return worker
}

export function useWorkers(): { workers: Worker[]; loading: boolean } {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/workers')
        if (!res.ok) throw new Error('Failed to fetch workers')
        setWorkers(await res.json() as Worker[])
      } catch (err) {
        console.error('Error fetching workers:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    window.addEventListener('gilam-workers-changed', load)
    return () => window.removeEventListener('gilam-workers-changed', load)
  }, [])

  return { workers, loading }
}

export async function storeSaveAttendance(workerId: number, sana: string, status: AttendanceStatus, izoh: string): Promise<void> {
  const res = await fetch('/api/attendances', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workerId, sana, status, izoh }),
  })
  if (!res.ok) {
    throw new Error(await res.text() || 'Failed to save attendance')
  }
  notifyAttendancesChanged()
}

export function useAttendances(sana?: string): { attendances: Attendance[]; loading: boolean } {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        let url = '/api/attendances'
        if (sana) {
          url += `?sana=${sana}`
        }
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch attendances')
        setAttendances(await res.json() as Attendance[])
      } catch (err) {
        console.error('Error fetching attendances:', err)
      } finally {
        setLoading(false)
      }
    }

    load()
    window.addEventListener('gilam-attendances-changed', load)
    return () => window.removeEventListener('gilam-attendances-changed', load)
  }, [sana])

  return { attendances, loading }
}
