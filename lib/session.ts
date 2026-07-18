import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { Role } from './types'

export type { Role }

export interface SessionPayload {
  userId: number
  role: Role
  apiToken: string   // The Spring Boot JWT — forwarded as Bearer on every API call
  expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET ?? 'gilam-production-ready-fallback-session-secret-key-32bytes'
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Creates our own signed session cookie storing the Spring Boot JWT for API calls.
 * @param userId  - from Spring Boot login response
 * @param role    - from Spring Boot login response
 * @param apiToken - the Spring Boot JWT to forward to the API
 */
export async function createSession(userId: number, role: Role, apiToken: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const token = await encrypt({ userId, role, apiToken, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  return decrypt(token)
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
