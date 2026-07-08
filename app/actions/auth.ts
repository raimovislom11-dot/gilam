'use server'

import { redirect } from 'next/navigation'
import { createSession, deleteSession, type Role } from '@/lib/session'
import type { AuthResponse } from '@/lib/types'

export type LoginState = { error?: string } | undefined

const API_URL = process.env.API_URL ?? 'http://localhost:8080'

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const loginInput = (formData.get('login') as string)?.trim()
  const password = formData.get('password') as string

  if (!loginInput || !password) {
    return { error: 'Login va parol kiritish shart' }
  }

  let role: Role
  let userId: number

  if (loginInput === 'admin' && password === 'admin') {
    role = 'ADMIN'
    userId = 1
  } else if (loginInput === 'Operator' && password === 'Operator') {
    role = 'OPERATOR'
    userId = 2
  } else if (loginInput === 'Ishchi' && password === 'Ishchi') {
    role = 'ISHCHI'
    userId = 3
  } else {
    return { error: 'Login yoki parol noto\'g\'ri' }
  }

  // Create a dummy token for local storage mode
  await createSession(userId, role, 'dummy-token')

  const dashboards: Record<Role, string> = {
    ADMIN: '/admin/zakazlar',
    OPERATOR: '/operator/yangi-zakaz',
    ISHCHI: '/ishchi',
  }

  redirect(dashboards[role])
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
