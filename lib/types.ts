// ─── Shared Types — mirrors Spring Boot entities ────────────────────────────

export type Role = 'ADMIN' | 'OPERATOR' | 'ISHCHI'
export type OrderStatus = 'YANGI' | 'TAHRIRLANDI' | 'ISHDA' | 'TAYYOR' | 'YUBORILDI'
export type QarzHolati = 'TOLANMAGAN' | 'QISMAN' | 'TOLANGAN'

/**
 * Mirrors the Spring Boot Order DTO returned from the API.
 * Relations are flattened to login strings.
 */
export interface Order {
  id: number
  mijozIsmi: string
  manzil: string
  telefon: string
  izohOperator?: string | null
  status: OrderStatus
  gilamSoni?: number | null
  adyolSoni?: number | null
  pardaOgirligi?: number | null
  korpaSoni?: number | null
  umumiyHajm?: number | null
  eskiHajm?: number | null
  summa?: number | null
  rasmlar?: string[]
  izohAdmin?: string | null
  qarzHolati: QarzHolati
  tolanganSumma: number
  createdAt: string
  updatedAt: string
  // Flattened relation info
  yaratganOperatorLogin?: string | null
  yaratganOperatorId?: number | null
  tahrirlaganAdminLogin?: string | null
  bajarganIshchiLogin?: string | null
  chiqarganOperatorLogin?: string | null
  chiqarganOperatorId?: number | null
}

/** Spring Boot login response */
export interface AuthResponse {
  token: string
  role: Role
  userId: number
  login: string
}

/** GET /api/orders/debt-summary */
export interface DebtSummaryResponse {
  orders: Order[]
  totalDebt: number
}

/** GET /api/analytics */
export interface AnalyticsResponse {
  chartData: AnalyticsPoint[]
  totals: AnalyticsTotals
}

export interface AnalyticsPoint {
  label: string   // e.g. "24.06" (week) or "Yan" (month)
  summa: number
  hajm: number
  count: number
}

export interface AnalyticsTotals {
  summa: number
  hajm: number
  adyol: number
  korpa: number
  count: number
}

// ─── Workers & Attendance ───────────────────────────────────────────────────

export interface Worker {
  id: number
  ism: string
  telefon: string
  lavozim?: string
  createdAt: string
}

export type AttendanceStatus = 'KELDI' | 'KELMADI' | 'RUXSAT'

export interface Attendance {
  id: number
  workerId: number
  sana: string // YYYY-MM-DD
  status: AttendanceStatus
  izoh: string
  createdAt: string
}
