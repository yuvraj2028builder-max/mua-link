import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  CreditCard,
  Link2,
  LockKeyhole,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { Button } from '@/components/ui/button'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { profileDisplayUrl, profilePath, profileUrl } from '../lib/site'

type TFn = (english: string, vars?: Record<string, string | number>) => string

const trustPoints = [
  { icon: ShieldCheck, label: 'Your number stays private' },
  { icon: Wallet, label: 'No booking commission' },
  { icon: Smartphone, label: 'No app for brides' },
  { icon: Sparkles, label: 'Free in V1' },
]

const steps = [
  {
    title: 'Share your link',
    copy: 'Add it to your Instagram bio. One tap opens your work, prices and dates.',
  },
  {
    title: 'She tells you everything',
    copy: 'Date, venue, budget, services. Seven short questions, no account needed.',
  },
  {
    title: 'Reply with the full picture',
    copy: 'Get the complete brief and a warm opener. Reply on WhatsApp when you’re ready.',
  },
]

const features = [
  'Portfolio tagged by look',
  'Services & starting prices',
  'Cities, hours & travel',
  'Sticky booking button',
]

const inclusions = [
  'Unlimited bride requests',
  '20 portfolio photos',
  'Services & starting prices',
  'Request summaries & openers',
  'WhatsApp click-to-chat',
  'Mobile-first dashboard',
]

const promises = [
  { icon: Wallet, title: 'You keep every rupee', copy: 'No commission on bookings. Your price is your price.' },
  { icon: ShieldCheck, title: 'Your number stays private', copy: 'Only you can start the WhatsApp chat.' },
  { icon: Smartphone, title: 'No app for brides', copy: 'A link and seven quick questions. That’s the whole ask.' },
  { icon: CreditCard, title: 'No card, no timer', copy: 'Free in V1. If anything changes, we’ll tell you first.' },
]

const faqs = [
  {
    q: 'Do brides need an account?',
    a: 'No. She opens your link, answers seven quick questions and sends the request.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing in V1. No commission, no card and no trial timer.',
  },
  {
    q: 'Will brides see my number?',
    a: 'No. Your number stays private until you choose to reply on WhatsApp.',
  },
  {
    q: 'Do I need a new app?',
    a: 'No. MUALink works in your phone browser — for you and for brides.',
  },
  {
    q: 'How long does setup take?',
    a: 'About ten minutes: your photos, services, prices and available dates.',
  },
  {
    q: 'What if a request isn’t a fit?',
    a: 'Archive it or mark it lost. Nothing is booked or charged automatically.',
  },
]

function Eyebrow({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <p
      className={`flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.2em] ${
        tone === 'light' ? 'text-[hsl(var(--gold-soft))]' : 'text-primary/70'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${tone === 'light' ? 'bg-[hsl(var(--gold-soft))]' : 'bg-[hsl(var(--gold))]'}`}
        aria-hidden="true"
      />
      {children}
    </p>
  )
}

function MockField({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background px-2.5 py-2">
      <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        <Icon className="size-2.5" />
        {label}
      </p>
      <p className="mt-0.5 truncate text-[11px] font-semibold">{value}</p>
    </div>
  )
}

function HeroVisual({ t }: { t: TFn }) {
  const liveUrl = profileUrl('priyanka').replace(/^https?:\/\//, 'https://')

  return (
    <div className="relative mx-auto w-full max-w-[450px] pb-8 lg:max-w-none">
      <div className="mb-3 flex flex-col items-start gap-1.5 px-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary/60">{t('Sample profile')}</p>
          <p className="mt-0.5 whitespace-nowrap font-display text-lg leading-tight">Priyanka Sharma</p>
        </div>
        <Link
          to={profilePath('priyanka')}
          className="flex min-w-0 items-center gap-1 text-[9.5px] font-semibold text-primary transition-colors hover:text-primary/70 sm:text-[10px]"
        >
          <span>{liveUrl}</span>
          <ArrowUpRight className="size-3 shrink-0" />
        </Link>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-3 rounded-[15rem_15rem_3rem_3rem] border border-[hsl(var(--gold))]/35"
          aria-hidden="true"
        />

        <div className="hero-photo relative overflow-hidden rounded-[14rem_14rem_2rem_2rem] border border-white/60 bg-card">
          <img
            src="/images/hero.jpg"
            alt={t('Soft glam bridal makeup by a MUALink artist')}
            className="h-[480px] w-full object-cover object-top sm:h-[600px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" aria-hidden="true" />
        </div>

        <div className="absolute -bottom-1 left-4 right-4 rounded-2xl border border-border/80 bg-card p-4 shadow-[0_28px_60px_-28px_rgba(47,27,24,0.5)] sm:-left-7 sm:right-auto sm:w-[282px]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('New request')}</p>
            <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 pulse-dot" />
              {t('Just now')}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2.5">
            <img src="/images/look1.jpg" alt="" className="size-9 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="font-display text-base leading-tight">Sneha Kapoor</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {t('Bridal (Main Wedding)')} · 12 Dec 2026
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <div className="rounded-lg bg-secondary/70 px-2.5 py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('Venue')}</p>
              <p className="truncate text-[10px] font-semibold">{t('The Leela, Gurgaon')}</p>
            </div>
            <div className="rounded-lg bg-secondary/70 px-2.5 py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('Budget')}</p>
              <p className="text-[10px] font-semibold">₹20K+</p>
            </div>
          </div>

          <div className="mt-3 border-t border-border/60 pt-2.5">
            <span className="text-[9px] text-muted-foreground">{t('No account needed')}</span>
            <span className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[9px] font-bold text-primary-foreground">
              <MessageCircle className="size-2.5" />
              {t('Reply on WhatsApp')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SharePreview({ t }: { t: TFn }) {
  return (
    <div>
      <div className="rounded-[1.6rem] border border-border/70 bg-card p-4 shadow-[0_25px_60px_-30px_rgba(64,38,30,0.45)]">
        <div className="flex items-center gap-3">
          <img
            src="/images/look1.jpg"
            alt=""
            className="size-11 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-primary/15"
          />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold">priyanka.makeup</p>
            <p className="truncate text-[10px] text-muted-foreground">{t('Bridal & soft glam · Delhi NCR')}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full border border-border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            {t('Artist')}
          </span>
        </div>

        <div className="mt-3 rounded-xl border border-primary/15 bg-background px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <Link2 className="size-2.5" />
            {t('Link in bio')}
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-semibold text-primary">{profileDisplayUrl('priyanka')}</span>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Copy className="size-3" />
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {['/images/look1.jpg', '/images/look2.jpg', '/images/look3.jpg'].map((src) => (
            <img key={src} src={src} alt="" className="aspect-[4/5] w-full rounded-lg object-cover" />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
          <span className="text-[10px] font-semibold">{t('Portfolio · Prices · Dates')}</span>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary">
            {t('Open')} <ArrowRight className="size-2.5" />
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] text-muted-foreground">{t('Looks like a mini website — not another app.')}</p>
    </div>
  )
}

function FormPreview({ t }: { t: TFn }) {
  return (
    <div>
      <div className="rounded-[1.6rem] border border-border/70 bg-card p-5 shadow-[0_25px_60px_-30px_rgba(64,38,30,0.45)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-primary/70">{t('Booking request')}</p>
            <p className="mt-1 font-display text-xl leading-tight">{t('Tell {name} about your day.', { name: 'Priyanka' })}</p>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[8px] font-bold text-muted-foreground">3 / 7</span>
        </div>

        <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[42%] rounded-full bg-primary" />
        </div>

        <div className="mt-4 space-y-2">
          <MockField icon={CalendarDays} label={t('Wedding date')} value="12 Dec 2026" />
          <MockField icon={MapPin} label={t('Venue')} value={t('The Leela, Gurgaon')} />
          <div className="grid grid-cols-2 gap-2">
            <MockField icon={Wallet} label={t('Budget')} value="₹20K+" />
            <MockField icon={Sparkles} label={t('Services')} value={t('Bridal + family')} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <ShieldCheck className="size-2.5 text-primary" />
            {t('No account needed')}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[9px] font-bold text-primary-foreground">
            {t('Continue')} <ArrowRight className="size-2.5" />
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-[10px] text-muted-foreground">{t('Seven calm screens. Her answers save as she goes.')}</p>
    </div>
  )
}

function ReplyPreview({ t }: { t: TFn }) {
  return (
    <div>
      <div className="rounded-[1.6rem] border border-border/70 bg-card p-4 shadow-[0_25px_60px_-30px_rgba(64,38,30,0.45)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-primary/70">{t('New request')}</p>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold text-emerald-700">
            {t('Good fit')}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <img src="/images/look1.jpg" alt="" className="size-10 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight">Sneha Kapoor</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {t('Bridal (Main Wedding)')} · 12 Dec 2026
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[t('The Leela, Gurgaon'), '₹20K+', `${t('Family')} ×4`, 'HD'].map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/70 bg-background px-2 py-0.5 text-[9px] font-semibold text-foreground/70"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-3 rounded-xl border border-primary/10 bg-accent/60 p-3">
          <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-primary/70">{t('Your opener')}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-foreground/75">
            {t('“Hi Sneha! Thank you for sharing your wedding details. I’d love to hear more about the look you have in mind…”')}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-[10px] font-bold text-primary-foreground">
          <MessageCircle className="size-3" />
          {t('Reply on WhatsApp')}
        </div>
        <p className="mt-2 text-center text-[8.5px] text-muted-foreground">{t('Your number stays private. You start the chat.')}</p>
      </div>
      <p className="mt-4 text-center text-[10px] text-muted-foreground">{t('One tap opens WhatsApp with the message ready.')}</p>
    </div>
  )
}

function ProfileBrowser({ t }: { t: TFn }) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2.4rem] bg-[radial-gradient(60%_60%_at_50%_50%,hsl(350_40%_90%/.8),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-[0_44px_90px_-55px_rgba(64,38,30,0.6)]">
        <div className="flex items-center gap-2 border-b border-border/60 bg-secondary/50 px-4 py-2.5">
          <span className="size-2 rounded-full bg-[#e6a39d]" />
          <span className="size-2 rounded-full bg-[#e8c987]" />
          <span className="size-2 rounded-full bg-[#a9c9aa]" />
          <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-full border border-border/50 bg-card px-3 py-1 text-[9px] text-muted-foreground">
            <LockKeyhole className="size-2.5 text-emerald-600" />
            {profileDisplayUrl('priyanka')}
          </span>
          <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70">
            {t('Preview')}
          </span>
        </div>

        <div className="relative h-40 sm:h-48">
          <img src="/images/cover.jpg" alt={t('Bridal portfolio cover')} className="size-full object-cover object-[center_32%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
            {t('Sample profile')}
          </span>
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-9 flex items-end justify-between gap-3">
            <img
              src="/images/look1.jpg"
              alt="Priyanka"
              className="size-16 rounded-full border-4 border-card object-cover shadow-sm"
            />
            <span className="mb-1 rounded-full bg-primary px-3 py-1.5 text-[9px] font-bold text-primary-foreground">
              {t('Request a Booking')}
            </span>
          </div>

          <h3 className="mt-3 font-display text-2xl leading-none">Priyanka Sharma</h3>
          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t('New Delhi · Hindi, English, Punjabi')}
          </p>

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {['/images/look2.jpg', '/images/look3.jpg', '/images/look4.jpg'].map((src) => (
              <img key={src} src={src} alt="" className="aspect-square w-full rounded-md object-cover" />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/70 px-3 py-2.5">
            <div>
              <p className="text-[11px] font-bold">{t('Signature Bridal')}</p>
              <p className="text-[9px] text-muted-foreground">{t('HD makeup, hair, draping')}</p>
            </div>
            <p className="shrink-0 text-[11px] font-bold text-primary">{t('from ₹25,000')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { configured, user } = useAuth()
  const { t } = useI18n()
  const [activeStep, setActiveStep] = useState(0)
  const createPath = configured ? (user ? '/onboarding' : '/signin') : '/onboarding'

  usePageMeta({
    title: 'MUALink — Your artistry, booked.',
    description:
      'One beautiful profile link for Indian makeup artists. Brides share their date, venue and budget once, and you reply on WhatsApp.',
  })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="landing-hero relative overflow-hidden">
          <div className="absolute inset-0 grid-lines opacity-40" aria-hidden="true" />
          <div className="page-shell relative grid items-center gap-10 pb-20 pt-10 sm:gap-14 sm:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24 lg:pt-16">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm backdrop-blur">
                <span className="size-1.5 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
                {t('For makeup artists in Delhi NCR')}
              </p>

              <h1 className="mt-7 max-w-[13ch] text-[3.2rem] leading-[0.92] sm:text-[4.5rem] lg:text-[5rem]">
                {t('Get booked.')}
                <span className="mt-2 block text-[0.82em] italic text-primary">{t('Not buried in DMs.')}</span>
              </h1>

              <p className="mt-5 max-w-[30rem] text-[15px] leading-relaxed text-muted-foreground sm:text-[15.5px]">
                {t(
                  'One beautiful link for your work, prices and dates. Brides share their details once — you reply on WhatsApp with the full picture.',
                )}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-full px-7 text-sm shadow-lg shadow-primary/15">
                  <Link to={createPath}>
                    {t('Create your free link')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="hidden h-12 rounded-full border-primary/20 bg-card/60 px-6 text-sm sm:inline-flex"
                >
                  <Link to={profilePath('priyanka')}>
                    {t('See a real profile')}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <p className="mt-4 flex items-center gap-1 text-[12.5px] text-muted-foreground">
                {t('Planning a wedding?')}{' '}
                <Link to={profilePath('priyanka')} className="inline-flex items-center gap-0.5 font-semibold text-primary link-underline">
                  {t('Browse Priyanka’s profile')}
                  <ArrowUpRight className="size-3" />
                </Link>
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t border-primary/10 pt-5 text-[11px] font-semibold text-muted-foreground">
                {['Free in V1', 'No booking commission', '10-minute setup'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-primary" />
                    {t(item)}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '120ms' }}>
              <HeroVisual t={t} />
            </div>
          </div>
        </section>

        <div className="border-y border-border/70 bg-card/60">
          <div className="page-shell grid grid-cols-2 gap-y-4 py-4 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border/70">
            {trustPoints.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-2.5 sm:justify-center sm:px-4">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="text-[11px] font-semibold text-foreground/80">{t(item.label)}</span>
                </div>
              )
            })}
          </div>
        </div>

        <section id="how-it-works" className="scroll-mt-24 border-b border-border/60 bg-[hsl(28_34%_95%)]">
          <div className="page-shell py-20 lg:py-28">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <Eyebrow>{t('How it works')}</Eyebrow>
                <h2 className="mt-4 max-w-2xl text-4xl leading-[1.03] sm:text-5xl lg:text-[3.4rem]">
                  {t('Three steps. Then it’s handled.')}
                </h2>
              </div>
              <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                {t(
                  'No new app to learn. No WhatsApp Business approval. Works on the phone already in your hand.',
                )}
              </p>
            </div>

            <div className="mt-11 overflow-hidden rounded-[1.8rem] border border-border/70 bg-card shadow-[0_36px_90px_-55px_rgba(64,38,30,0.55)]">
              <div className="grid lg:grid-cols-[0.84fr_1.16fr]">
                <div className="flex flex-col p-5 sm:p-8 lg:p-10">
                  <div role="tablist" aria-label={t('How it works')} className="space-y-1.5">
                    {steps.map((step, index) => {
                      const active = index === activeStep
                      return (
                        <button
                          key={step.title}
                          type="button"
                          role="tab"
                          id={`tour-tab-${index}`}
                          aria-selected={active}
                          aria-controls={`tour-panel-${index}`}
                          onClick={() => setActiveStep(index)}
                          className={`flex w-full items-start gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                            active
                              ? 'border-primary/15 bg-accent/60'
                              : 'border-transparent hover:bg-secondary/60'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block font-display text-lg leading-tight ${
                                active ? 'text-foreground' : 'text-foreground/60'
                              }`}
                            >
                              {t(step.title)}
                            </span>
                            <span
                              className={`mt-1 block text-[12px] leading-relaxed ${
                                active ? 'text-muted-foreground' : 'text-muted-foreground/70'
                              }`}
                            >
                              {t(step.copy)}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-6 border-t border-border/60 pt-5">
                    <Link
                      to={profilePath('priyanka')}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary link-underline"
                    >
                      {t('Open the live profile')}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="relative flex items-center justify-center overflow-hidden bg-[linear-gradient(145deg,hsl(30_42%_94%),hsl(348_36%_94%))] p-6 pb-12 sm:p-10 sm:pb-14">
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/50 blur-3xl"
                    aria-hidden="true"
                  />
                  <div
                    className="relative w-full max-w-[390px]"
                    role="tabpanel"
                    id={`tour-panel-${activeStep}`}
                    aria-labelledby={`tour-tab-${activeStep}`}
                  >
                    <div key={activeStep} className="animate-fade-up">
                      {activeStep === 0 && <SharePreview t={t} />}
                      {activeStep === 1 && <FormPreview t={t} />}
                      {activeStep === 2 && <ReplyPreview t={t} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="profile" className="scroll-mt-24 page-shell py-20 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <div className="order-2 lg:order-1">
              <ProfileBrowser t={t} />
            </div>

            <div className="order-1 lg:order-2">
              <Eyebrow>{t('Your page')}</Eyebrow>
              <h2 className="mt-4 max-w-lg text-4xl leading-[1.03] sm:text-5xl">
                {t('A page that looks like your best work.')}
              </h2>
              <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
                {t(
                  'Portfolio, prices, cities and availability — all in one link. Your WhatsApp number stays private; she requests a booking, you decide when to reply.',
                )}
              </p>

              <div className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {features.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 border-t border-primary/15 pt-3 text-[12px] font-semibold"
                  >
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                    {t(item)}
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="mt-8 rounded-full border-primary/20 bg-card/60">
                <Link to={profilePath('priyanka')}>
                  {t('Open the live profile')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24 border-y border-border/60 bg-[hsl(28_34%_95%)]">
          <div className="page-shell py-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <Eyebrow>{t('Pricing, honestly')}</Eyebrow>
                <h2 className="mt-4 text-6xl leading-none sm:text-7xl">{t('₹0 in V1.')}</h2>
                <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
                  {t(
                    'No card. No commission. No trial timer. If that changes, you will hear it from us first.',
                  )}
                </p>
                <Button asChild className="mt-7 rounded-full">
                  <Link to={createPath}>
                    {t('Create your free link')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <CreditCard className="size-3.5" />
                  {t('No card details. Ever.')}
                </p>
              </div>

              <div className="rounded-[1.8rem] border border-border/70 bg-card p-6 sm:p-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {t('Everything included')}
                  </p>
                  <div className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {inclusions.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[12px] font-semibold">
                        <Check className="size-3.5 shrink-0 text-primary" />
                        {t(item)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-border/70 pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {t('Our promises')}
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {promises.map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.title} className="flex gap-2.5">
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                            <Icon className="size-3.5" />
                          </span>
                          <div>
                            <p className="text-[12px] font-bold">{t(item.title)}</p>
                            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{t(item.copy)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 page-shell py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <Eyebrow>{t('Straight answers.')}</Eyebrow>
              <h2 className="mt-4 max-w-sm text-4xl leading-[1.03] sm:text-5xl">
                {t('The questions every artist asks.')}
              </h2>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                {t('Still unsure? Open the live profile and see exactly what a bride sees.')}
              </p>
              <Button asChild variant="outline" className="mt-6 rounded-full border-primary/20 bg-card/60">
                <Link to={profilePath('priyanka')}>
                  {t('See a real profile')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-x-10 sm:grid-cols-2">
              {faqs.map((item) => (
                <div key={item.q} className="border-t border-border/70 py-5">
                  <h3 className="text-[14px] font-bold">{t(item.q)}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">{t(item.a)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="relative scroll-mt-24 overflow-hidden bg-[hsl(15_24%_11%)] text-[hsl(30_40%_96%)]">
          <div
            className="pointer-events-none absolute -left-24 top-0 size-[26rem] rounded-full"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.25)', filter: 'blur(110px)' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full"
            style={{ backgroundColor: 'hsl(var(--gold) / 0.16)', filter: 'blur(100px)' }}
            aria-hidden="true"
          />

          <div className="page-shell relative grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
            <div>
              <Eyebrow tone="light">{t('One link. Better enquiries.')}</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                {t('Your next bride is already looking.')}
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-white/55">
                {t(
                  'Give her a page worth stopping for. Set up your profile in ten minutes, share the link, and let the form do the asking.',
                )}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-[hsl(30_40%_96%)] px-7 text-[hsl(15_24%_13%)] hover:bg-white"
                >
                  <Link to={createPath}>
                    {t('Create your free link')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link to={profilePath('priyanka')}>
                    {t('See a real profile')}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <p className="mt-5 text-[11px] text-white/40">
                {t('Free in V1 · No commission · Your number stays private')}
              </p>
            </div>

            <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
              <img
                src="/images/look2.jpg"
                alt=""
                className="h-44 w-full rounded-t-full rounded-b-xl border border-white/10 object-cover opacity-90 sm:h-56"
              />
              <img
                src="/images/look4.jpg"
                alt=""
                className="h-56 w-full rounded-t-full rounded-b-xl border border-white/10 object-cover sm:h-72"
              />
              <img
                src="/images/look3.jpg"
                alt=""
                className="h-48 w-full rounded-t-full rounded-b-xl border border-white/10 object-cover opacity-90 sm:h-64"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
