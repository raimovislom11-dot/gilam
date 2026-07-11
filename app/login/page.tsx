'use client'

import { useActionState, useState } from 'react'
import { login, LoginState } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logo.jpeg" 
            alt="Oqqo'rg'on Professional Gilam Yuvish" 
            style={{ 
              width: 100, height: 100, 
              borderRadius: '50%', 
              objectFit: 'cover',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 32px var(--primary-glow)',
            }} 
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }} className="gradient-text">
            Oqqo'rg'on
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
            Boshqaruv tizimiga kirish
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <div className="alert alert-error shake">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={action} className="form-grid">
          <div className="input-group">
            <label className="input-label" htmlFor="login">Login</label>
            <input
              id="login"
              name="login"
              type="text"
              className="input"
              placeholder="Loginni kiriting"
              autoComplete="username"
              required
              disabled={pending}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Parol</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="Parolni kiriting"
                autoComplete="current-password"
                required
                disabled={pending}
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 0,
                }}
              >
                {showPassword ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            {pending ? (
              <>
                <span className="spinner" />
                Kirish...
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Kirish
              </>
            )}
          </button>
        </form>

        {/* Hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.875rem',
          background: 'var(--bg-card)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <p style={{ margin: '0 0 0.375rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Demo kirish:</p>
          <p style={{ margin: '0.15rem 0' }}>👑 Admin: <code style={{ color: 'var(--primary-light)' }}>admin</code> / <code style={{ color: 'var(--primary-light)' }}>admin</code></p>
          <p style={{ margin: '0.15rem 0' }}>📋 Operator: <code style={{ color: 'var(--accent)' }}>Operator</code> / <code style={{ color: 'var(--accent)' }}>Operator</code></p>
          <p style={{ margin: '0.15rem 0' }}>🔧 Ishchi: <code style={{ color: 'var(--success)' }}>Ishchi</code> / <code style={{ color: 'var(--success)' }}>Ishchi</code></p>
        </div>
      </div>
    </div>
  )
}
