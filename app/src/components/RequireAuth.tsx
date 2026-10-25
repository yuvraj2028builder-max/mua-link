import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../auth/AuthProvider'
import Logo from './Logo'

export function FullPageLoader({ label = 'Loading your studio…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background">
      <Logo />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/2 animate-loader-slide rounded-full bg-primary" />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (!configured) return <>{children}</>
  if (loading) return <FullPageLoader />
  if (!user) {
    const next = `${location.pathname}${location.search}`
    return <Navigate to={`/signin?next=${encodeURIComponent(next)}`} replace />
  }
  return <>{children}</>
}
