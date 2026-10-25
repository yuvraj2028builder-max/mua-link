import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { fetchMyArtist } from '../lib/api'
import { requireSupabase } from '../lib/supabase'
import Logo from '../components/Logo'
import { Button } from '@/components/ui/button'
import { FullPageLoader } from '../components/RequireAuth'

export default function AuthCallback() {
  const { user, loading, configured } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [loadError, setLoadError] = useState('')
  const [timedOut, setTimedOut] = useState(false)
  const exchangeStarted = useRef(false)
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code') || ''
  const oauthError = params.get('error_description') || params.get('error') || ''
  const error = loadError || (oauthError
    ? t('We could not complete the Google sign-in. Please try again.')
    : !configured
      ? t('Accounts are not connected in this build.')
      : !loading && !user && !code
        ? t('We could not complete the Google sign-in. Please try again.')
        : '')
  usePageMeta({
    title: (error || timedOut ? t('Sign in') : t('Signing you in…')) + ' · MUALink',
    noindex: true,
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setTimedOut(true), 12000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!configured || loading || oauthError) return

    if (!user && code) {
      if (exchangeStarted.current) return
      exchangeStarted.current = true
      requireSupabase().auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
        if (exchangeError) {
          console.error('Google sign-in exchange failed:', exchangeError.message)
          setLoadError(t('We could not complete the Google sign-in. Please try again.'))
          return
        }
        window.history.replaceState({}, '', '/auth/callback')
      })
      return
    }

    if (!user) return
    let active = true
    ;(async () => {
      try {
        const artist = await fetchMyArtist(user.id)
        if (!active) return
        const savedNext = sessionStorage.getItem('mualink-next')
        sessionStorage.removeItem('mualink-next')
        const next = savedNext && savedNext.startsWith('/') && !savedNext.startsWith('/signin')
          ? savedNext
          : '/dashboard'
        navigate(!artist && next === '/dashboard' ? '/onboarding' : next, { replace: true })
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : t('Could not finish signing you in.'))
      }
    })()

    return () => { active = false }
  }, [code, configured, loading, navigate, oauthError, t, user])

  if (!error && !timedOut) {
    return <FullPageLoader label={t('Signing you in…')} />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Logo />
      <span className="mt-10 flex size-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertTriangle className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl">{t('Sign-in needs one more try.')}</h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {error || t('This is taking longer than usual. Check your connection and try again.')}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild className="rounded-full">
          <Link to="/signin">{t('Back to sign in')}</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/">{t('Go to home')}</Link>
        </Button>
      </div>
    </div>
  )
}
