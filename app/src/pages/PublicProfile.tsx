import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Languages,
  LoaderCircle,
  MapPin,
  Plane,
  Share2,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import Logo from '../components/Logo'
import SiteFooter from '../components/SiteFooter'
import LanguageToggle from '../components/LanguageToggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { formatTime, inr } from '../lib/site'
import { usePublicArtist } from '../hooks/usePublicArtist'
import { useI18n } from '../i18n'
import { useAuth } from '../auth/AuthProvider'
import { usePageMeta } from '../lib/seo'

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <Logo />
      {children}
    </div>
  )
}

export default function PublicProfile() {
  const { username } = useParams()
  const { artist: profile, loading, error } = usePublicArtist(username)
  const { t } = useI18n()
  const { configured, user } = useAuth()
  const [activeTag, setActiveTag] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const createPath = configured ? (user ? '/dashboard' : '/signin') : '/onboarding'
  const cover = profile?.portfolio[0]?.url || profile?.profilePhoto || '/images/cover.jpg'

  usePageMeta({
    title: profile
      ? `${profile.fullName} — Bridal makeup artist in ${profile.city} | MUALink`
      : 'Artist profile | MUALink',
    description: profile
      ? `${profile.fullName} · ${profile.city}. ${profile.bio}`.slice(0, 160)
      : undefined,
    image: profile ? cover : undefined,
    noindex: !profile,
  })

  if (loading) {
    return (
      <PageShell>
        <LoaderCircle className="mt-10 size-6 animate-spin text-primary" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('Opening this profile…')}</p>
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell>
        <h1 className="mt-10 text-4xl sm:text-5xl">{t('This profile didn’t load.')}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">{error}</p>
        <div className="mt-7 flex gap-2">
          <Button className="rounded-full" onClick={() => window.location.reload()}>{t('Try again')}</Button>
          <Button asChild variant="outline" className="rounded-full"><Link to="/">{t('Go home')}</Link></Button>
        </div>
      </PageShell>
    )
  }

  if (!profile) {
    return (
      <PageShell>
        <h1 className="mt-10 text-4xl sm:text-5xl">{t('This profile isn’t here.')}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {t('The link may have changed, or the artist has paused her profile.')}
        </p>
        <Button asChild className="mt-7 rounded-full">
          <Link to="/">{t('Explore MUALink')}</Link>
        </Button>
      </PageShell>
    )
  }

  const services = profile.services.filter((service) => service.visible)
  const tags = ['All', ...Array.from(new Set(profile.portfolio.map((item) => item.tag)))]
  const shown = activeTag === 'All'
    ? profile.portfolio
    : profile.portfolio.filter((item) => item.tag === activeTag)
  const lowestPrice = services
    .map((service) => service.price)
    .filter((price): price is number => price != null)
    .sort((a, b) => a - b)[0]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${profile.username}`)
      toast.success(t('Profile link copied'))
    } catch {
      toast.error(t('Could not copy — long-press the address bar instead'))
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <Logo light />
          <div className="flex items-center gap-1.5">
            <LanguageToggle tone="light" />
            <Button
              variant="ghost"
              size="sm"
              onClick={copyLink}
              className="rounded-full text-white hover:bg-white/15 hover:text-white"
            >
              <Share2 className="size-4" />
              <span className="hidden sm:inline">{t('Share')}</span>
            </Button>
            <Button asChild size="sm" variant="secondary" className="rounded-full bg-white/90 text-foreground hover:bg-white">
              <Link to={createPath}>{t('Create your link')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative h-[300px] sm:h-[400px]">
        <img src={cover} alt={t('{name} portfolio cover', { name: profile.fullName })} className="size-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25" />
        <div className="absolute inset-x-0 bottom-4">
          <div className="page-shell flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            <Sparkles className="size-3" /> {t('Bridal & occasion makeup')} · {profile.city}
          </div>
        </div>
      </div>

      <div className="page-shell relative -mt-16 sm:-mt-20">
        <div className="flex items-end justify-between gap-3">
          <img
            src={profile.profilePhoto || '/images/look1.jpg'}
            alt={profile.fullName}
            className="size-24 shrink-0 rounded-full border-4 border-background object-cover shadow-xl sm:size-32"
          />
          {profile.isDemo && (
            <span className="mb-1 rounded-full border border-border bg-card px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {t('Sample profile')}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl leading-none sm:text-5xl">{profile.fullName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" />{profile.city}</span>
              <span className="flex items-center gap-1"><Languages className="size-3.5" />{profile.languages.map((language) => t(language)).join(', ')}</span>
              <span className="flex items-center gap-1"><Clock3 className="size-3.5" />{formatTime(profile.workingFrom)} – {formatTime(profile.workingTo)}</span>
            </div>
          </div>
          <div className="hidden items-center gap-3 pb-1 sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Services from')}</p>
              <p className="font-display text-xl text-primary">{lowestPrice ? inr(lowestPrice) : t('On request')}</p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full px-6 shadow-lg shadow-primary/20">
              <Link to={`/p/${profile.username}/request`}>
                {t('Request a Booking')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="page-shell">
        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Check, label: t('No account needed') },
            { icon: Clock3, label: t('Takes about 3 minutes') },
            { icon: CalendarDays, label: t('Reply on WhatsApp within 24 hrs') },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card px-4 py-3 text-[12px] font-semibold text-foreground/80">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent text-primary"><item.icon className="size-3.5" /></span>
              {item.label}
            </div>
          ))}
        </section>

        <section className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t('Portfolio')}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">{t('Recent work')}</h2>
            </div>
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                    activeTag === tag
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {t(tag)}
                  {tag !== 'All' && (
                    <span className="ml-1.5 opacity-60">{profile.portfolio.filter((item) => item.tag === tag).length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
            {shown.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightbox(index)}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary text-left"
              >
                <img
                  src={item.url}
                  alt={t('{tag} makeup look', { tag: t(item.tag) })}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {t(item.tag)}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-gradient-to-t from-black/45 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-white/90 p-1.5 text-foreground"><ArrowRight className="size-3.5" /></span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{t('Services')}</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">{t('What I offer')}</h2>
            </div>
            <p className="hidden max-w-xs text-right text-[11px] leading-relaxed text-muted-foreground sm:block">
              {t('Final quote depends on the look, location and number of people.')}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.id} className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg leading-tight">{service.name}</h3>
                    <p className="shrink-0 text-right text-sm font-bold text-primary">
                      {service.priceType === 'custom_quote' ? t('Custom quote') : (
                        <>
                          {service.priceType === 'starting_from' && <span className="mr-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t('from')} </span>}
                          {inr(service.price)}
                        </>
                      )}
                    </p>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
                <Link
                  to={`/p/${profile.username}/request?service=${encodeURIComponent(service.name)}`}
                  className="mt-4 inline-flex w-fit items-center gap-1 text-[11px] font-bold text-primary link-underline"
                >
                  {t('Request this service')} <ArrowRight className="size-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <p className="eyebrow">{t('About')}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{t('The experience')}</h2>
            <p className="mt-5 max-w-xl text-[15px] leading-[1.8] text-foreground/80">{profile.bio}</p>

            <div className="mt-6">
              <p className="field-label">{t('Cities served')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.serviceCities.map((city) => (
                  <span key={city} className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-border/70 bg-[hsl(26_36%_96%)] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('Working details')}</p>
            <dl className="mt-4 space-y-4 text-[12px]">
              <div>
                <dt className="flex items-center gap-1.5 font-bold"><CalendarDays className="size-3.5 text-primary" />{t('Working days')}</dt>
                <dd className="mt-1 text-muted-foreground">{profile.workingDays.map((day) => t(day.slice(0, 3))).join(' · ')}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 font-bold"><Clock3 className="size-3.5 text-primary" />{t('Hours')}</dt>
                <dd className="mt-1 text-muted-foreground">{formatTime(profile.workingFrom)} {t('to')} {formatTime(profile.workingTo)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 font-bold"><Plane className="size-3.5 text-primary" />{t('Travel')}</dt>
                <dd className="mt-1 text-muted-foreground">{profile.travelAvailable ? t('Available outside the city') : t('Within the city only')}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 font-bold"><Languages className="size-3.5 text-primary" />{t('Languages')}</dt>
                <dd className="mt-1 text-muted-foreground">{profile.languages.map((language) => t(language)).join(', ')}</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="mt-16 overflow-hidden rounded-[1.8rem] bg-[linear-gradient(120deg,hsl(350_42%_94%),hsl(38_48%_90%))] p-7 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow">{t('Your date, her calendar')}</p>
              <h2 className="mt-2 max-w-md text-3xl leading-tight sm:text-4xl">
                {t('Tell {name} about your day.', { name: profile.fullName.split(' ')[0] })}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{t('Seven quick screens. No account. She replies on WhatsApp.')}</p>
            </div>
            <Button asChild size="lg" className="h-12 shrink-0 rounded-full px-6">
              <Link to={`/p/${profile.username}/request`}>
                {t('Request a Booking')} <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <div className="mt-16">
        <SiteFooter />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Services from')}</p>
            <p className="truncate font-display text-lg text-primary">{lowestPrice ? inr(lowestPrice) : t('On request')}</p>
          </div>
          <Button asChild className="h-11 flex-1 rounded-full text-sm">
            <Link to={`/p/${profile.username}/request`}>
              {t('Request a Booking')} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-0 bg-transparent p-0 shadow-none" showCloseButton={false}>
          <DialogTitle className="sr-only">{t('Portfolio image')}</DialogTitle>
          {lightbox !== null && shown[lightbox] && (
            <div className="relative">
              <img
                src={shown[lightbox].url}
                alt={t('{tag} makeup look', { tag: t(shown[lightbox].tag) })}
                className="max-h-[78vh] w-full rounded-2xl object-contain"
              />
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setLightbox((lightbox - 1 + shown.length) % shown.length)}
                  className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                  aria-label={t('Previous image')}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                  {t(shown[lightbox].tag)} · {lightbox + 1}/{shown.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightbox((lightbox + 1) % shown.length)}
                  className="flex size-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                  aria-label={t('Next image')}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
