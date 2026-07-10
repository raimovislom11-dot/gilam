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

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 800
        const MAX_HEIGHT = 800
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.6))
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}
