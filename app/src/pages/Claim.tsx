import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Check,
  LoaderCircle,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { isUsernameTaken } from '../lib/api'
import { hasBackend } from '../lib/supabase'
import { previewProfile } from '../lib/previews'
import { inr, isValidIndianMobile, isValidProfileUsername, normaliseUsername, profilePath } from '../lib/site'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import { FullPageLoader } from '../components/RequireAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function Claim() {
  const { username } = useParams()
  const slug = normaliseUsername(username)
  const validSlug = isValidProfileUsername(slug)
  const seed = validSlug ? previewProfile(slug) : null

  const { user, loading: authLoading, configured, signInWithGoogle } = useAuth()
  const { profile, loading: storeLoading, saveProfile, demo } = useStore()
  const { t } = useI18n()
  const navigate = useNavigate()

  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [claimState, setClaimState] = useState<'checking' | 'free' | 'taken'>(
    hasBackend && validSlug ? 'checking' : 'free',
  )

  usePageMeta({
    title: (seed ? `${t('Claim')} @${slug}` : t('Claim this profile')) + ' · MUALink',
    description: seed
      ? t('Claim the preview profile built for @{username} on MUALink. Free, and ready in one click.', { username: slug })
      : undefined,
    noindex: true,
  })

  useEffect(() => {
    if (!validSlug) return
    if (!hasBackend) {
      setClaimState('free')
      return
    }

    let active = true
    setClaimState('checking')
    isUsernameTaken(slug)
      .then((taken) => {
        if (active) setClaimState(taken ? 'taken' : 'free')
      })
      .catch(() => {
        if (active) setClaimState('free')
      })

    return () => { active = false }
  }, [slug, validSlug])

  const loading = authLoading || storeLoading
  if (loading) return <FullPageLoader label={t('Opening this claim…')} />

  if (!validSlug || !seed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <Logo />
        <h1 className="mt-10 text-4xl sm:text-5xl">{t('This link can’t be claimed.')}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {t('Use 3–30 lowercase letters, numbers or underscores.')}
        </p>
        <Button asChild className="mt-7 rounded-full">
          <Link to="/">{t('Explore MUALink')}</Link>
        </Button>
      </div>
    )
  }

  const realProfile = !demo && profile && !profile.isDemo ? profile : null
  const ownsLink = realProfile?.username === slug
  const otherProfile = realProfile && !ownsLink
  const taken = claimState === 'taken' && !ownsLink
  const checking = claimState === 'checking'
  const cover = seed.portfolio[0]?.url || seed.profilePhoto
  const lowestPrice = seed.services
    .map((service) => service.price)
    .filter((price): price is number => price != null)
    .sort((a, b) => a - b)[0]

  const nextPath = `/claim/${slug}`

  const startGoogle = async () => {
    setError('')
    setBusy(true)
    try {
      sessionStorage.setItem('mualink-next', nextPath)
      await signInWithGoogle()
    } catch (signInError) {
      setBusy(false)
      setError(signInError instanceof Error ? signInError.message : t('Could not start Google sign-in.'))
    }
  }

  const submitClaim = async () => {
    if (!isValidIndianMobile(whatsapp)) {
      setError(t('Enter a valid 10-digit WhatsApp number.'))
      return
    }

    setError('')
    setBusy(true)
    try {
      if (hasBackend) {
        if (claimState !== 'free') {
          setClaimState('taken')
          return
        }
        const justTaken = await isUsernameTaken(slug)
        if (justTaken) {
          setClaimState('taken')
          return
        }
      }

      await saveProfile({
        ...seed,
        id: hasBackend && user ? user.id : seed.id,
        whatsapp: whatsapp.replace(/\D/g, '').slice(-10),
        email: user?.email || seed.email,
        published: false,
        paused: false,
      })
      toast.success(t('Claimed — add your photos and publish when ready.'))
      navigate('/onboarding', { replace: true })
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : t('Could not claim this profile. Please try again.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background texture-warm">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" size="sm" className="rounded-full text-[11px]">
              <Link to={profilePath(slug)}>
                {t('View preview')} <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="page-shell py-8 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('Your preview is ready')}</p>
            <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl">
              {t('This page is built for')} <span className="italic text-primary">@{slug}</span>.
            </h1>
            <p className="mt-4 text-[14px] leading-relaxed text-muted-foreground">
              {t('It already looks like your work. Claim it free, swap in your real photos and WhatsApp, and share one link that answers every bride’s first questions.')}
            </p>
          </div>

          <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-card shadow-xl shadow-black/[0.04]">
              <div className="relative h-56 sm:h-64">
                <img
                  src={cover}
                  alt={t('{name} preview cover', { name: seed.fullName })}
                  className="size-full object-cover object-[center_30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-primary backdrop-blur">
                  <Zap className="size-3" /> {t('Preview')}
                </span>
                <div className="absolute inset-x-0 bottom-4 px-5">
                  <p className="font-display text-2xl text-white sm:text-3xl">{seed.fullName}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                    <Sparkles className="size-3" /> {t('Bridal & occasion makeup')} · {seed.city}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-end justify-between gap-3">
                  <img
                    src={seed.profilePhoto}
                    alt={seed.fullName}
                    className="-mt-12 size-20 shrink-0 rounded-full border-4 border-card object-cover shadow-lg sm:-mt-14 sm:size-24"
                  />
                  <div className="pb-1 text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Services from')}</p>
                    <p className="font-display text-lg text-primary">{lowestPrice ? inr(lowestPrice) : t('On request')}</p>
                  </div>
                </div>

                <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">{t(seed.bio)}</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {seed.portfolio.slice(1, 4).map((item) => (
                    <img
                      key={item.id}
                      src={item.url}
                      alt={t('{tag} makeup look', { tag: t(item.tag) })}
                      className="aspect-[4/5] w-full rounded-xl object-cover"
                    />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
                    <Camera className="size-3" /> {t('Sample photos')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
                    <Wand2 className="size-3" /> {t('Editable in 2 minutes')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-2.5 py-1">
                    <LockKeyhole className="size-3" /> {t('No card needed')}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-border/70 bg-card p-5 shadow-xl shadow-black/[0.04] sm:p-7">
              {ownsLink ? (
                <div>
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                    <BadgeCheck className="size-5" />
                  </span>
                  <h2 className="mt-5 text-2xl leading-tight">{t('This profile is already yours.')}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {t('You’re signed in with the account that owns @{username}. Update your photos, services or link anytime from your studio.', { username: slug })}
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Button asChild className="h-11 rounded-full text-[12px]">
                      <Link to="/dashboard">
                        {t('Open my dashboard')} <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11 rounded-full text-[12px]">
                      <Link to={profilePath(slug)}>{t('View my public profile')}</Link>
                    </Button>
                  </div>
                </div>
              ) : otherProfile ? (
                <div>
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                    <BadgeCheck className="size-5" />
                  </span>
                  <h2 className="mt-5 text-2xl leading-tight">{t('You already have a profile.')}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {t('One account runs one MUALink profile. Head to your studio to update your link, photos and services.')}
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Button asChild className="h-11 rounded-full text-[12px]">
                      <Link to="/dashboard">
                        {t('Open my dashboard')} <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11 rounded-full text-[12px]">
                      <Link to={profilePath(realProfile.username)}>{t('View my public profile')}</Link>
                    </Button>
                  </div>
                </div>
              ) : taken ? (
                <div>
                  <span className="flex size-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <AlertTriangle className="size-5" />
                  </span>
                  <h2 className="mt-5 text-2xl leading-tight">{t('This link was just claimed.')}</h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {t('Another artist has already taken @{username}. Head back to the preview to see who it belongs to, or explore MUALink for your own link.', { username: slug })}
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Button asChild variant="outline" className="h-11 rounded-full text-[12px]">
                      <Link to={profilePath(slug)}>{t('View this profile')}</Link>
                    </Button>
                    <Button asChild className="h-11 rounded-full text-[12px]">
                      <Link to="/">{t('Explore MUALink')}</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                      <ShieldCheck className="size-5" />
                    </span>
                    <span className="rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                      {t('Free in V1 · No card')}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl leading-tight">
                    {user ? t('Add your WhatsApp to claim @{username}.', { username: slug }) : t('Claim @{username} in one click.', { username: slug })}
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {user
                      ? t('This number is only for your studio. Brides never see it on your profile — they send their details through your booking form.')
                      : t('Sign in with Google so the page is linked to you. We never post, message or share anything on your behalf.')}
                  </p>

                  {!configured && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[11px] leading-relaxed text-amber-900">
                      <p className="font-bold">{t('Preview mode')}</p>
                      <p className="mt-1">
                        {t('Accounts are not connected in this build. Your claim will be saved on this device only.')}
                      </p>
                    </div>
                  )}

                  <div className="mt-5">
                    {configured && !user ? (
                      <Button
                        type="button"
                        onClick={startGoogle}
                        disabled={busy}
                        className="h-12 w-full rounded-full bg-foreground text-[13px] font-bold text-background hover:bg-foreground/90"
                      >
                        {busy ? <LoaderCircle className="size-4 animate-spin" /> : <GoogleMark />}
                        {busy ? t('Connecting to Google…') : t('Continue with Google')}
                        {!busy && <ArrowRight className="ml-auto size-4" />}
                      </Button>
                    ) : (
                      <div className="grid gap-3">
                        <div>
                          <Label htmlFor="claim-whatsapp" className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            {t('Your WhatsApp number')}
                          </Label>
                          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background p-1 pl-3 focus-within:border-primary/40">
                            <span className="text-[12px] font-bold text-muted-foreground">+91</span>
                            <Input
                              id="claim-whatsapp"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel-national"
                              maxLength={10}
                              placeholder="98765 43210"
                              value={whatsapp}
                              onChange={(event) => {
                                setWhatsapp(event.target.value.replace(/\D/g, '').slice(0, 10))
                                setError('')
                              }}
                              className="h-10 border-0 bg-transparent px-0 text-[13px] font-semibold shadow-none focus-visible:ring-0"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={submitClaim}
                          disabled={busy || checking}
                          className="h-12 w-full rounded-full text-[13px] font-bold"
                        >
                          {busy && <LoaderCircle className="size-4 animate-spin" />}
                          {checking ? t('Checking this link…') : t('Claim @{username}', { username: slug })}
                          {!busy && !checking && <ArrowRight className="ml-auto size-4" />}
                        </Button>
                      </div>
                    )}

                    {error && (
                      <p role="alert" className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-[11px] font-semibold text-destructive">
                        {error}
                      </p>
                    )}

                    <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
                      <Camera className="mt-px size-3 shrink-0 text-primary" />
                      {t('Your preview photos are placeholders. You’ll replace them before publishing — your page stays private until you choose to go live.')}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
                    {[
                      t('Keep your own photos and prices'),
                      t('Your number stays off the public page'),
                      t('Free forever in V1 — no commission'),
                    ].map((item) => (
                      <p key={item} className="flex items-center gap-2 text-[11px] font-semibold text-foreground/80">
                        <span className="flex size-4 items-center justify-center rounded-full bg-accent text-primary">
                          <Check className="size-2.5" />
                        </span>
                        {item}
                      </p>
                    ))}
                  </div>

                  {configured && !user && (
                    <p className="mt-4 text-center text-[10px] text-muted-foreground">
                      {t('Already claimed this page?')}{' '}
                      <Link to={`/signin?next=${encodeURIComponent(nextPath)}`} className="font-bold text-foreground underline underline-offset-2">
                        {t('Sign in with the same Google account')}
                      </Link>
                      .
                    </p>
                  )}
                </div>
              )}
            </section>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex items-center gap-1.5"><MessageCircle className="size-3.5 text-primary" /> {t('Built for WhatsApp replies')}</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-primary" /> {t('Private by default')}</span>
            <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-primary" /> {t('Made in India')}</span>
          </div>
        </div>
      </main>
    </div>
  )
}
