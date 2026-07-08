export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m'
}

export function formatNumber(value: number | null | undefined, unit = ''): string {
  if (value == null) return '—'
  return `${value}${unit ? ' ' + unit : ''}`
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    YANGI: 'Yangi',
    TAHRIRLANDI: 'Tahrirlandi',
    ISHDA: 'Ishda',
    TAYYOR: 'Tayyor',
    YUBORILDI: 'Yuborildi',
  }
  return labels[status] || status
}

export function getQarzLabel(qarz: string): string {
  const labels: Record<string, string> = {
    TOLANMAGAN: 'To\'lanmagan',
    QISMAN: 'Qisman',
    TOLANGAN: 'To\'langan',
  }
  return labels[qarz] || qarz
}
