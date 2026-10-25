import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ArrowRight, Check, ShieldCheck, Sparkles, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import { Button } from '@/components/ui/button'

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.77 24c0-1.6.28-3.14.76-4.59l-7.97-6.19A23.94 23.94 0 0 0 0 24c0 3.88.93 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export default function SignIn() {
  const { user, configured, signInWithGoogle, loading } = useAuth()
  const { t } = useI18n()
  usePageMeta({ title: t('Sign in') + ' · MUALink', noindex: true })
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [busy, setBusy] = useState(false)

  const next = searchParams.get('next') || sessionStorage.getItem('mualink-next') || '/dashboard'

  useEffect(() => {
    if (loading || !user) return
    navigate(next, { replace: true })
  }, [loading, navigate, next, user])

  const handleGoogle = async () => {
    if (!configured) return
    setBusy(true)
    try {
      sessionStorage.setItem('mualink-next', next)
      await signInWithGoogle()
    } catch (error) {
      setBusy(false)
      toast.error(error instanceof Error ? error.message : t('Could not start Google sign-in.'))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button asChild variant="ghost" size="sm" className="rounded-full text-[11px]">
              <Link to="/">{t('Back to home')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="page-shell grid min-h-[calc(100vh-4rem)] items-center gap-12 py-10 lg:grid-cols-[1fr_440px] lg:py-16">
        <section className="hidden lg:block">
          <p className="eyebrow">{t('For makeup artists')}</p>
          <h1 className="mt-4 max-w-xl text-5xl leading-[1.02]">
            {t('One link.')}
            <span className="block italic text-primary">{t('Every bride, properly briefed.')}</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {t('Sign in to build your profile, receive complete booking requests and reply on WhatsApp — without the endless DMs.')}
          </p>

          <div className="mt-8 grid max-w-md gap-3">
            {[
              t('A public profile link for your Instagram bio'),
              t('Bride details collected before you reply'),
              t('Every request in one calm dashboard'),
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-[12px] font-semibold">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Check className="size-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            {t('Free for artists. No commission, no card.')}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[1.8rem] border border-border/70 bg-card p-6 shadow-xl shadow-black/[0.04] sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
              <Sparkles className="size-5" />
            </span>
            <h2 className="mt-5 text-3xl leading-tight">{t('Welcome to MUALink')}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {t('Sign in with Google to claim your link. We never post anything on your behalf.')}
            </p>

            {!configured && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[11px] leading-relaxed text-amber-900">
                <p className="font-bold">{t('Preview mode')}</p>
                <p className="mt-1">
                  {t('Google sign-in is not connected in this build. Add your Supabase keys to enable real accounts, or explore the demo.')}
                </p>
                <Button asChild size="sm" className="mt-3 h-8 rounded-full text-[10px]">
                  <Link to="/onboarding">{t('Open the demo profile builder')}</Link>
                </Button>
              </div>
            )}

            <Button
              type="button"
              onClick={handleGoogle}
              disabled={!configured || busy || loading}
              className="mt-6 h-12 w-full rounded-full bg-foreground text-[13px] font-bold text-background hover:bg-foreground/90"
            >
              <GoogleMark />
              {busy ? t('Connecting to Google…') : t('Continue with Google')}
              {!busy && <ArrowRight className="ml-auto size-4" />}
            </Button>

            <p className="mt-4 text-center text-[10px] leading-relaxed text-muted-foreground">
              {t('By continuing you agree to our')}{' '}
              <Link to="/terms" className="font-bold text-foreground underline underline-offset-2">{t('Terms')}</Link>
              {' '}{t('and')}{' '}
              <Link to="/privacy" className="font-bold text-foreground underline underline-offset-2">{t('Privacy Policy')}</Link>.
            </p>

            <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              {t('What brides see')}
              <span className="h-px flex-1 bg-border" />
            </div>

            <Link
              to="/p/priyanka"
              className="mt-4 flex items-center justify-between rounded-xl border border-border/70 bg-secondary/40 px-4 py-3 text-[11px] font-bold transition-colors hover:border-primary/30"
            >
              <span className="flex items-center gap-2">
                <Wand2 className="size-3.5 text-primary" />
                {t('See a sample artist profile')}
              </span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t('Made for artists in Delhi NCR')}
          </p>
        </section>
      </main>
    </div>
  )
}
