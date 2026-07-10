'use client'

/**
 * localStorage-based data store for Gilam orders.
 * All data persists in the browser. Reactive updates via custom DOM event.
 */

import { useState, useEffect } from 'react'
import type { Order, OrderStatus, QarzHolati, Worker, Attendance, AttendanceStatus } from './types'

const ORDERS_KEY = 'gilam_orders'
const ID_KEY = 'gilam_next_id'
const SEEDED_KEY = 'gilam_seeded_v3'

// ─── Low-level helpers ────────────────────────────────────────────────────────

function readOrders(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  // Notify all hooks in the same tab
  window.dispatchEvent(new Event('gilam-data-changed'))
}

function nextId(): number {
  const current = parseInt(localStorage.getItem(ID_KEY) ?? '3999', 10)
  const next = current + 1
  localStorage.setItem(ID_KEY, String(next))
  return next
}

// ─── Demo seed data ───────────────────────────────────────────────────────────

function seedDemo(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(SEEDED_KEY)) return

  const now = new Date()
  const d = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString()

  const demo: Order[] = [
    {
      id: 4000,
      mijozIsmi: 'Alisher Karimov',
      manzil: 'Yunusobod 12-uy, 45-xonadon',
      telefon: '+998 90 123 45 67',
      izohOperator: 'Juda ehtiyotkorlik bilan',
      status: 'YANGI',
      qarzHolati: 'TOLANMAGAN',
      tolanganSumma: 0,
      createdAt: d(2),
      updatedAt: d(2),
      yaratganOperatorLogin: 'Operator',
    },
    {
      id: 4001,
      mijozIsmi: 'Nodira Yusupova',
      manzil: 'Chilonzor, 8-massiv 3-uy',
      telefon: '+998 93 456 78 90',
      status: 'YANGI',
      qarzHolati: 'TOLANMAGAN',
      tolanganSumma: 0,
      createdAt: d(1),
      updatedAt: d(1),
      yaratganOperatorLogin: 'Operator',
    },
    {
      id: 4002,
      mijozIsmi: 'Botir Toshmatov',
      manzil: 'Mirzo Ulug\'bek, 5-uy',
      telefon: '+998 94 321 09 87',
      izohOperator: 'Kechgacha tayyor bo\'lsin',
      status: 'ISHDA',
      gilamSoni: 4,
      adyolSoni: 2,
      umumiyHajm: 28.5,
      summa: 570000,
      izohAdmin: 'Gilamlar katta, ehtiyotkorlik kerak',
      qarzHolati: 'TOLANMAGAN',
      tolanganSumma: 0,
      createdAt: d(3),
      updatedAt: d(1),
      yaratganOperatorLogin: 'Operator',
      tahrirlaganAdminLogin: 'admin',
    },
    {
      id: 4003,
      mijozIsmi: 'Zulfiya Rahimova',
      manzil: 'Shayxontohur, Navruz ko\'chasi 7',
      telefon: '+998 91 234 56 78',
      status: 'TAYYOR',
      gilamSoni: 2,
      adyolSoni: 3,
      pardaOgirligi: 5.5,
      umumiyHajm: 14,
      summa: 420000,
      qarzHolati: 'TOLANMAGAN',
      tolanganSumma: 0,
      createdAt: d(4),
      updatedAt: d(0),
      yaratganOperatorLogin: 'Operator',
      tahrirlaganAdminLogin: 'admin',
      bajarganIshchiLogin: 'Ishchi',
    },
    {
      id: 4004,
      mijozIsmi: 'Jahongir Mirzaev',
      manzil: 'Bektemir, Sanoat ko\'chasi 12',
      telefon: '+998 97 654 32 10',
      status: 'YUBORILDI',
      gilamSoni: 6,
      korpaSoni: 4,
      umumiyHajm: 42,
      summa: 840000,
      qarzHolati: 'QISMAN',
      tolanganSumma: 420000,
      createdAt: d(7),
      updatedAt: d(2),
      yaratganOperatorLogin: 'Operator',
      tahrirlaganAdminLogin: 'admin',
      bajarganIshchiLogin: 'Ishchi',
      chiqarganOperatorLogin: 'Operator',
    },
    {
      id: 4005,
      mijozIsmi: 'Sarvinoz Qodirov',
      manzil: 'Uchtepa, Bog\'bon ko\'chasi 3',
      telefon: '+998 99 111 22 33',
      status: 'YUBORILDI',
      gilamSoni: 3,
      adyolSoni: 1,
      pardaOgirligi: 8,
      umumiyHajm: 21,
      summa: 630000,
      qarzHolati: 'TOLANGAN',
      tolanganSumma: 630000,
      createdAt: d(10),
      updatedAt: d(5),
      yaratganOperatorLogin: 'Operator',
      tahrirlaganAdminLogin: 'admin',
      bajarganIshchiLogin: 'Ishchi',
      chiqarganOperatorLogin: 'Operator',
    },
  ]

  localStorage.setItem(ORDERS_KEY, JSON.stringify(demo))
  localStorage.setItem(ID_KEY, '4005')
  localStorage.setItem(SEEDED_KEY, 'true')
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function storeCreateOrder(data: {
  mijozIsmi: string
  manzil: string
  telefon: string
  izohOperator?: string | null
}): Order {
  const orders = readOrders()
  const order: Order = {
    id: nextId(),
    mijozIsmi: data.mijozIsmi,
    manzil: data.manzil,
    telefon: data.telefon,
    izohOperator: data.izohOperator || null,
    status: 'YANGI',
    qarzHolati: 'TOLANMAGAN',
    tolanganSumma: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    yaratganOperatorLogin: 'Operator',
  }
  orders.push(order)
  writeOrders(orders)
  return order
}

export function storeUpdateOrder(id: number, updates: Partial<Order>): boolean {
  const orders = readOrders()
  const idx = orders.findIndex((o) => o.id === id)
  if (idx === -1) return false
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() }
  writeOrders(orders)
  return true
}

// ─── React hook ───────────────────────────────────────────────────────────────

/**
 * Reactive hook — re-renders whenever any order changes.
 * Optionally filters by one or more statuses.
 */
export function useOrders(status?: OrderStatus | OrderStatus[]): {
  orders: Order[]
  loading: boolean
} {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemo()

    const load = () => {
      const all = readOrders()
      if (!status) {
        setOrders(all)
      } else {
        const statuses = Array.isArray(status) ? status : [status]
        setOrders(all.filter((o) => statuses.includes(o.status as OrderStatus)))
      }
      setLoading(false)
    }

    load()
    window.addEventListener('gilam-data-changed', load)
    return () => window.removeEventListener('gilam-data-changed', load)
  }, [])

  return { orders, loading }
}

/** Get full analytics data from all YUBORILDI orders */
export function useAnalytics() {
  const { orders, loading } = useOrders('YUBORILDI')
  return { orders, loading }
}

/** Get debt summary: unpaid orders + total */
export function useDebt() {
  const [result, setResult] = useState<{ orders: Order[]; totalDebt: number }>({
    orders: [],
    totalDebt: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedDemo()

    const load = () => {
      const all = readOrders()
      const debtOrders = all.filter(
        (o) => o.status === 'YUBORILDI' && o.qarzHolati !== 'TOLANGAN' && o.summa != null
      )
      const totalDebt = debtOrders.reduce(
        (sum, o) => sum + Math.max(0, (o.summa ?? 0) - o.tolanganSumma),
        0
      )
      setResult({ orders: debtOrders, totalDebt })
      setLoading(false)
    }

    load()
    window.addEventListener('gilam-data-changed', load)
    return () => window.removeEventListener('gilam-data-changed', load)
  }, [])

  return { ...result, loading }
}

// ─── Workers & Attendance ───────────────────────────────────────────────────

const WORKERS_KEY = 'gilam_workers'
const ATTENDANCE_KEY = 'gilam_attendances'

export function readWorkers(): Worker[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(WORKERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeWorkers(workers: Worker[]): void {
  localStorage.setItem(WORKERS_KEY, JSON.stringify(workers))
  window.dispatchEvent(new Event('gilam-workers-changed'))
}

export function storeCreateWorker(data: { ism: string; telefon: string; lavozim?: string }): Worker {
  const workers = readWorkers()
  const worker: Worker = {
    id: nextId(),
    ism: data.ism,
    telefon: data.telefon,
    lavozim: data.lavozim,
    createdAt: new Date().toISOString()
  }
  workers.push(worker)
  writeWorkers(workers)
  return worker
}

export function useWorkers(): { workers: Worker[]; loading: boolean } {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => {
      setWorkers(readWorkers())
      setLoading(false)
    }
    load()
    window.addEventListener('gilam-workers-changed', load)
    return () => window.removeEventListener('gilam-workers-changed', load)
  }, [])

  return { workers, loading }
}

export function readAttendances(): Attendance[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function writeAttendances(atts: Attendance[]): void {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(atts))
  window.dispatchEvent(new Event('gilam-attendances-changed'))
}

export function storeSaveAttendance(workerId: number, sana: string, status: AttendanceStatus, izoh: string): void {
  const atts = readAttendances()
  const idx = atts.findIndex(a => a.workerId === workerId && a.sana === sana)
  if (idx !== -1) {
    atts[idx].status = status
    atts[idx].izoh = izoh
  } else {
    atts.push({
      id: nextId(),
      workerId,
      sana,
      status,
      izoh,
      createdAt: new Date().toISOString()
    })
  }
  writeAttendances(atts)
}

export function useAttendances(sana?: string): { attendances: Attendance[]; loading: boolean } {
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => {
      let all = readAttendances()
      if (sana) {
        all = all.filter(a => a.sana === sana)
      }
      setAttendances(all)
      setLoading(false)
    }
    load()
    window.addEventListener('gilam-attendances-changed', load)
    return () => window.removeEventListener('gilam-attendances-changed', load)
  }, [sana])

  return { attendances, loading }
}
