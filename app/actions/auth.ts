'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession, type Role } from '@/lib/session'
import type { AuthResponse } from '@/lib/types'

export type LoginState = { error?: string } | undefined

const API_URL = process.env.API_URL ?? 'https://gilam.213.199.51.43.sslip.io'

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const loginInput = (formData.get('login') as string)?.trim()
  const password = formData.get('password') as string

  if (!loginInput || !password) {
    return { error: 'Login va parol kiritish shart' }
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: loginInput, password }),
    })

    if (!res.ok) {
      const errorMsg = await res.text()
      return { error: errorMsg || 'Login yoki parol noto\'g\'ri' }
    }

    const data = (await res.json()) as AuthResponse
    await createSession(data.userId, data.role, data.token)

    const dashboards: Record<Role, string> = {
      ADMIN: '/admin/zakazlar',
      OPERATOR: '/operator/yangi-zakaz',
      ISHCHI: '/ishchi',
    }

    redirect(dashboards[data.role])
  } catch (err: any) {
    if (err.message && err.message.includes('NEXT_REDIRECT')) {
      throw err;
    }
    return { error: err.message || 'Tizimga kirishda xatolik yuz berdi. Qayta urinib ko\'ring.' }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
