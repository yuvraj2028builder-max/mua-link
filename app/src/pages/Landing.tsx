import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Copy,
  Link2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { profileUrl } from '../lib/site'

const pains = [
  {
    n: '01',
    title: 'Leads live in five places',
    copy: 'Instagram DMs, WhatsApp, calls, referrals. Somewhere in there is a booking you never saw.',
  },
  {
    n: '02',
    title: 'The same questions, on repeat',
    copy: 'Date, city, services, budget. You type it out again for every single bride.',
  },
  {
    n: '03',
    title: 'Details arrive in pieces',
    copy: 'Half the info is missing, so the conversation stretches across two days.',
  },
  {
    n: '04',
    title: 'The fastest reply wins',
    copy: 'If you take six hours, she has already booked someone who answered in twenty minutes.',
  },
]

const steps = [
  {
    icon: Link2,
    step: 'Step one',
    title: 'Share one link',
    copy: 'Create your profile, add your looks, services and prices. Put the link in your Instagram bio.',
  },
  {
    icon: CalendarCheck,
    step: 'Step two',
    title: 'Bride fills the smart form',
    copy: 'Occasion, services, date, venue, budget. Seven calm screens, no account needed, answers saved automatically.',
  },
  {
    icon: MessageCircle,
    step: 'Step three',
    title: 'You get a complete request',
    copy: 'Every detail in one card, with a fit check and a warm opener drafted for you. Reply on WhatsApp in one tap.',
  },
]

const features = [
  { icon: Wand2, title: 'Fit label with a reason', copy: 'Good fit, needs review, or not a fit — always with the reason shown.' },
  { icon: MessageCircle, title: 'One-tap WhatsApp reply', copy: 'A warm, personal opener, pre-filled and ready to send.' },
  { icon: ShieldCheck, title: 'Lead never gets lost', copy: 'Every request is saved the moment she submits it.' },
]

export default function Landing() {
  const { configured, user } = useAuth()
  const { t } = useI18n()
  const createPath = configured ? (user ? '/onboarding' : '/signin') : '/onboarding'

  usePageMeta({
    title: 'MUALink — Every bridal enquiry, properly briefed',
    description: 'One beautiful profile link for Indian makeup artists. Brides share every detail in a smart form, and you reply on WhatsApp from one calm dashboard.',
  })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden texture-warm">
          <div className="pointer-events-none absolute -right-24 top-20 size-72 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(var(--gold-soft) / 0.55)' }} />
          <div className="page-shell relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.03fr_0.97fr] lg:gap-10 lg:pb-28 lg:pt-20">
            <div className="animate-fade-up">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-card/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                <Sparkles className="mr-1.5 size-3.5" />
                {t('Built for Delhi NCR makeup artists')}
              </Badge>

              <h1 className="mt-6 text-[2.9rem] leading-[0.98] sm:text-6xl lg:text-[4.4rem]">
                {t('Your artistry, booked.')}
                <span className="block italic text-primary">{t('Without the endless DMs.')}</span>
              </h1>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {t('MUALink gives you one beautiful profile link. Brides share every detail in a smart form. You get a clean request card — and reply on WhatsApp before she books someone else.')}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-full px-7 text-sm shadow-lg shadow-primary/20">
                  <Link to={createPath}>
                    {t('Create my free profile')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-primary/20 bg-card/60 px-6 text-sm">
                  <Link to="/p/priyanka">
                    {t('See a live profile')}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" />{t('Free forever in V1')}</span>
                <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" />{t('10-minute setup')}</span>
                <span className="flex items-center gap-1.5"><Check className="size-4 text-primary" />{t('No booking commission')}</span>
              </div>
            </div>

            <div className="pointer-events-none relative mx-auto w-full max-w-[440px] animate-fade-up lg:max-w-none" style={{ animationDelay: '120ms' }}>
              <div className="absolute -left-6 top-10 hidden size-24 rounded-full border border-primary/15 sm:block" />
              <div className="hero-photo relative overflow-hidden rounded-[2rem] border border-white/60 bg-card">
                <img
                  src="/images/hero.jpg"
                  alt={t('Soft glam bridal makeup by a MUALink artist')}
                  className="h-[430px] w-full object-cover object-top sm:h-[520px]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 pt-16 text-white">
                  <p className="font-display text-xl">Priyanka Sharma</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.18em] text-white/75">{t('Bridal & soft glam · Delhi NCR')}</p>
                </div>
              </div>

              <div className="animate-float absolute -left-3 top-8 hidden w-[210px] rounded-2xl border border-border/70 bg-card/95 p-3.5 shadow-xl shadow-black/10 backdrop-blur sm:-left-8 sm:block">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('New request')}</p>
                  <span className="size-2 rounded-full bg-primary pulse-dot" />
                </div>
                <p className="mt-2 font-display text-[15px] leading-tight">Sneha · 12 Dec</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t('Bridal + family makeup')}</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{t('Good fit')}</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">₹20K+</span>
                </div>
              </div>

              <div className="absolute -bottom-6 right-0 hidden w-[220px] rounded-2xl border border-border/70 bg-card/95 p-4 shadow-xl shadow-black/10 backdrop-blur sm:-right-6 sm:block">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-full bg-accent text-primary"><Wand2 className="size-3.5" /></span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Opener ready')}</p>
                </div>
                <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-foreground/80">
                  {t('“Hi Sneha! Thank you for sharing your wedding details. I’d love to hear more about the look you have in mind…”')}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary"><Copy className="size-3" /> {t('Copy to WhatsApp')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* OCCASION STRIP */}
        <div className="border-y border-border/70 bg-card/60">
          <div className="page-shell flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground/80">
            {['Bridal', 'Engagement', 'Reception', 'Pre-wedding', 'Party', 'Family'].map((item, index) => (
              <span key={item} className="flex items-center gap-8">
                {t(item)}
                {index < 5 && <span className="size-1 rounded-full bg-primary/30" />}
              </span>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <section id="why" className="page-shell py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="eyebrow">{t('The quiet leak')}</p>
              <h2 className="mt-4 text-4xl leading-[1.02] sm:text-5xl">
                {t('You’re not losing bookings because of your work.')}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {t('You’re losing them in the gap between her message and your reply. By the time the date, city and budget are sorted over DMs, the moment has passed.')}
              </p>
              <div className="mt-8 flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
                <div className="flex -space-x-2">
                  {['/images/look1.jpg', '/images/look2.jpg', '/images/look3.jpg'].map((src) => (
                    <img key={src} src={src} alt="" className="size-9 rounded-full border-2 border-card object-cover" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-bold text-foreground">{t('Built with working artists.')}</span><br />
                  {t('Not a studio tool. A solo MUA tool.')}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {pains.map((pain) => (
                <div key={pain.n} className="rounded-[1.4rem] border border-border/70 bg-card p-5 shadow-sm">
                  <span className="font-display text-sm italic text-primary/50">{pain.n}</span>
                  <h3 className="mt-2 text-lg leading-tight">{t(pain.title)}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t(pain.copy)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 overflow-hidden rounded-[1.8rem] bg-[hsl(15_24%_14%)] text-[hsl(30_40%_96%)]">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--gold-soft))]">{t('The fix')}</p>
                <h3 className="mt-3 max-w-lg text-3xl leading-[1.08] sm:text-4xl">
                  {t('Give every enquiry a proper front door.')}
                </h3>
              </div>
              <ul className="grid gap-3 text-sm">
                {[
                  'One link instead of five inboxes',
                  'Every detail collected before you reply',
                  'A warm, personal opener written for you',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-[hsl(var(--gold-soft))]" />
                    {t(item)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="border-y border-border/60 bg-[hsl(26_36%_96%)]">
          <div className="page-shell py-20 lg:py-28">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">{t('How it works')}</p>
                <h2 className="mt-4 max-w-xl text-4xl leading-[1.02] sm:text-5xl">
                  {t('Three steps between her scroll and your calendar.')}
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t('No new app to learn. No WhatsApp Business approval. Works on the phone already in your hand.')}
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {steps.map((item, index) => (
                <div key={item.step} className="relative rounded-[1.6rem] border border-border/70 bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary">
                      <item.icon className="size-5" />
                    </span>
                    <span className="font-display text-3xl italic text-primary/20">0{index + 1}</span>
                  </div>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/60">{t(item.step)}</p>
                  <h3 className="mt-2 text-xl">{t(item.title)}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t(item.copy)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DASHBOARD MOCK */}
        <section className="page-shell py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="eyebrow">{t('Your lead inbox')}</p>
              <h2 className="mt-4 text-4xl leading-[1.02] sm:text-5xl">
                {t('Calm, not chaotic.')}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {t('Every request arrives as a card with her details, a short summary, a fit label and a ready-to-send opener. You decide — reply, mark unavailable, or archive.')}
              </p>

              <div className="mt-8 space-y-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-accent text-primary">
                      <feature.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">{t(feature.title)}</p>
                      <p className="text-[13px] leading-relaxed text-muted-foreground">{t(feature.copy)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-8 rounded-full" variant="outline">
                <Link to="/dashboard">
                  {t('Open your dashboard')}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="grid-lines pointer-events-none relative rounded-[1.8rem] border border-border/70 bg-[hsl(26_36%_96%)] p-4 sm:p-6">
              <div className="soft-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl">Sneha Kapoor</h3>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{t('Good fit')}</span>
                    </div>
                    <p className="mt-1 text-[12px] text-muted-foreground">{t('Bridal (Main Wedding)')} · 12 Dec 2026</p>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent font-display text-sm text-primary">SK</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-xl bg-secondary/70 px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t('Venue')}</p>
                    <p className="mt-0.5 font-semibold">The Leela, Gurgaon</p>
                  </div>
                  <div className="rounded-xl bg-secondary/70 px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t('Budget')}</p>
                    <p className="mt-0.5 font-semibold">₹20K+</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['Signature Bridal', 'Family Makeup ×4'].map((service) => (
                    <span key={service} className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-foreground/70">{service}</span>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-primary/10 bg-accent/60 p-3">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-primary/70">
                    <Wand2 className="size-3" /> {t('Request summary')}
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/75">
                    {t('Sneha is planning a December wedding in Gurgaon and needs bridal makeup plus four family members. Her soft-glam preference matches your signature style.')}
                  </p>
                </div>

                <div className="mt-4 flex justify-between border-t border-border/60 pt-3 text-[10px] font-semibold text-muted-foreground">
                  <span>{t('Reply on WhatsApp')}</span>
                  <span>{t('Archive')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROFILE PREVIEW */}
        <section className="border-y border-border/60 bg-[hsl(26_36%_96%)]">
          <div className="page-shell grid gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-card shadow-[0_30px_80px_-45px_rgba(64,38,30,0.55)]">
                <div className="flex items-center gap-1.5 border-b border-border/60 bg-secondary/60 px-4 py-2.5">
                  <span className="size-2 rounded-full bg-rose-300" />
                  <span className="size-2 rounded-full bg-amber-300" />
                  <span className="size-2 rounded-full bg-emerald-300" />
                  <span className="ml-3 flex-1 rounded-full bg-card px-3 py-1 text-[10px] text-muted-foreground">{profileUrl('priyanka')}</span>
                </div>
                <div className="relative h-32 sm:h-40">
                  <img src="/images/hero.jpg" alt={t('Bridal portfolio cover')} className="size-full object-cover object-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
                <div className="px-5 pb-5">
                  <div className="-mt-8 flex items-end justify-between">
                    <img src="/images/look1.jpg" alt="Priyanka" className="size-16 rounded-full border-4 border-card object-cover" />
                    <span className="mb-1 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">{t('Request a Booking')}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl">Priyanka Sharma</h3>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('New Delhi · Hindi, English, Punjabi')}</p>
                  <p className="mt-3 max-w-md text-[12px] leading-relaxed text-muted-foreground">
                    {t('Soft glam, luminous skin, and looks that still feel like you. Modern bridal and occasion makeup across Delhi NCR.')}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-1.5">
                    {['/images/look2.jpg', '/images/look3.jpg', '/images/look4.jpg'].map((src) => (
                      <img key={src} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-border/70 px-3 py-2">
                    <div>
                      <p className="text-[11px] font-bold">{t('Signature Bridal')}</p>
                      <p className="text-[9px] text-muted-foreground">{t('HD makeup, hair, draping')}</p>
                    </div>
                    <p className="text-[11px] font-bold text-primary">{t('from ₹25,000')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="eyebrow">{t('Your public profile')}</p>
              <h2 className="mt-4 text-4xl leading-[1.02] sm:text-5xl">
                {t('A page that looks like your best work.')}
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                {t('Portfolio, prices, cities and availability — all in one link. Your WhatsApp number stays private; she requests a booking, you decide when to reply.')}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  'Portfolio tagged by look',
                  'Services & starting prices',
                  'Cities, hours & travel',
                  'Sticky booking button',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5 text-[12px] font-semibold">
                    <Check className="size-3.5 text-primary" /> {t(item)}
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-7 rounded-full">
                <Link to="/p/priyanka">
                  {t('Visit Priyanka’s profile')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FREE */}
        <section className="page-shell pb-20 lg:pb-28">
          <div className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-[linear-gradient(120deg,hsl(350_42%_94%),hsl(38_48%_92%))]">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div>
                <p className="eyebrow">{t('Pricing, honestly')}</p>
                <h2 className="mt-4 max-w-lg text-4xl leading-[1.02] sm:text-5xl">
                  {t('₹0. For now, and for a long while.')}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {t('V1 is completely free: profile, form, request cards, WhatsApp replies and lead management. No commission, no card, no trial timer. If we ever add a premium plan, the core stays free.')}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-card/80 p-5 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t('Everything included')}</p>
                <ul className="mt-3 space-y-2.5 text-[13px]">
                  {[
                    'Unlimited bride requests',
                    '20 portfolio photos',
                    'Request summaries & openers',
                    'WhatsApp click-to-chat',
                    'Availability warnings',
                    'Mobile-first dashboard',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" />{t(item)}</li>
                  ))}
                </ul>
                <Button asChild className="mt-5 w-full rounded-full">
                  <Link to={createPath}>{t('Start free')} <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-[hsl(15_24%_13%)] py-20 text-[hsl(30_40%_96%)] lg:py-28">
          <div className="pointer-events-none absolute -left-20 top-0 size-80 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(var(--primary) / 0.35)' }} />
          <div className="pointer-events-none absolute -right-10 bottom-0 size-72 rounded-full blur-3xl" style={{ backgroundColor: 'hsl(var(--gold) / 0.15)' }} />
          <div className="page-shell relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--gold-soft))]">{t('One link. Better enquiries.')}</p>
              <h2 className="mt-4 max-w-2xl text-4xl leading-[1.02] sm:text-5xl lg:text-[3.6rem]">
                {t('The next bride is already looking for you.')}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                {t('Set up your profile in ten minutes. Share the link. Let the form do the asking.')}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <Button asChild size="lg" className="h-12 rounded-full bg-[hsl(30_40%_96%)] px-7 text-[hsl(15_24%_13%)] hover:bg-white">
                <Link to={createPath}>{t('Create my profile')} <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/20 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">
                <Link to="/dashboard">{t('Open dashboard')}</Link>
              </Button>
              <p className="text-center text-[11px] text-white/40 lg:text-left">{t('Free forever in V1 · No commission')}</p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
