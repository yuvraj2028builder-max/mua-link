import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { format, parseISO, startOfToday } from 'date-fns'
import {
  Archive,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock3,
  Copy,
  Inbox,
  IndianRupee,
  Link2,
  MapPin,
  MessageCircle,
  Pencil,
  Search,
  Sparkles,
  Users,
  Wand2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import UserMenu from '../components/UserMenu'
import { FullPageLoader } from '../components/RequireAuth'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import type { Lead, LeadStatus } from '../types'
import {
  daysUntil,
  fitMeta,
  formatEventDate,
  formatEventDateLong,
  formatTime,
  formatVenue,
  initials,
  leadReminderMessage,
  profileUrl,
  statusMeta,
  waLink,
} from '../lib/site'
import { leadFitReason, leadOpener, leadSummary } from '../lib/review'

type TabKey = 'new' | 'replied' | 'confirmed' | 'archived'

const statusOrder: LeadStatus[] = ['new', 'replied', 'quote_sent', 'confirmed', 'lost', 'archived']

export default function Dashboard() {
  const {
    profile,
    leads,
    unavailableDates,
    loading,
    error,
    demo,
    setLeadStatus,
    markLeadRead,
    toggleUnavailableDate,
    refresh,
  } = useStore()
  const { t } = useI18n()
  const [tab, setTab] = useState<TabKey>('new')
  const [search, setSearch] = useState('')
  const [detailId, setDetailId] = useState<string | null>(null)

  usePageMeta({ title: t('Artist studio') + ' · MUALink', noindex: true })

  const sorted = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [leads],
  )

  if (loading) return <FullPageLoader label={t('Loading your studio…')} />

  if (!profile) {
    if (error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <Logo />
          <h1 className="mt-6 text-3xl">{t('We couldn’t open your studio.')}</h1>
          <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => refresh()} className="mt-2 rounded-full">{t('Try again')}</Button>
        </div>
      )
    }
    return <Navigate to="/onboarding" replace />
  }

  const newCount = sorted.filter((lead) => lead.status === 'new').length
  const repliedCount = sorted.filter((lead) => lead.status === 'replied' || lead.status === 'quote_sent').length
  const confirmedCount = sorted.filter((lead) => lead.status === 'confirmed').length
  const archivedCount = sorted.filter((lead) => lead.status === 'archived' || lead.status === 'lost').length

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'new', label: t('New'), count: newCount },
    { key: 'replied', label: t('Replied'), count: repliedCount },
    { key: 'confirmed', label: t('Confirmed'), count: confirmedCount },
    { key: 'archived', label: t('Archived'), count: archivedCount },
  ]

  const filtered = sorted
    .filter((lead) => {
      if (tab === 'new') return lead.status === 'new'
      if (tab === 'replied') return lead.status === 'replied' || lead.status === 'quote_sent'
      if (tab === 'confirmed') return lead.status === 'confirmed'
      return lead.status === 'archived' || lead.status === 'lost'
    })
    .filter((lead) => {
      const needle = search.trim().toLowerCase()
      if (!needle) return true
      return [lead.brideName, lead.occasion, lead.venue, lead.services.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })

  const unreadNew = sorted.filter((lead) => lead.status === 'new' && lead.unread)
  const newestUnread = unreadNew[0] || sorted.find((lead) => lead.status === 'new')
  const activeLead = sorted.find((lead) => lead.id === detailId) || null

  const openLead = (lead: Lead) => {
    setDetailId(lead.id)
    if (lead.unread) void markLeadRead(lead.id)
  }

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(message)
    } catch {
      toast.error(t('Could not copy — please select and copy manually'))
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('Good morning') : hour < 17 ? t('Good afternoon') : t('Good evening')
  const firstName = profile.fullName.split(' ')[0] || profile.fullName
  const blockedDates = unavailableDates.map((date) => parseISO(`${date}T12:00:00`))
  const shareText = t('Hi! Here is my MUALink profile — send me your booking details here: {url}', {
    url: profileUrl(profile.username),
  })

  const handleBlockDate = (date: Date | undefined) => {
    if (!date) return
    const iso = format(date, 'yyyy-MM-dd')
    const blocked = unavailableDates.includes(iso)
    void toggleUnavailableDate(iso)
    toast.success(blocked ? t('Date is open for requests again') : t('Date marked unavailable'))
  }

  const emptyCopy: Record<TabKey, { title: string; body: string }> = {
    new: {
      title: t('No new requests right now'),
      body: t('When a bride sends an enquiry, it will appear here with a ready summary.'),
    },
    replied: {
      title: t('Nothing in progress'),
      body: t('Requests you have replied to will collect here until they are confirmed.'),
    },
    confirmed: {
      title: t('No confirmed bookings yet'),
      body: t('Move a lead to Confirmed once the date and quote are locked in.'),
    },
    archived: {
      title: t('Nothing archived'),
      body: t('Archived and lost enquiries stay here for your records.'),
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              {t('Artist studio')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to={`/p/${profile.username}`}>
                {t('View profile')} <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/onboarding">
                <Pencil className="size-3.5" />
                <span className="hidden sm:inline">{t('Edit profile')}</span>
              </Link>
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="page-shell py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{format(new Date(), 'EEEE, d MMMM')}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{t('{greeting}, {name}.', { greeting, name: firstName })}</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              {newCount > 0
                ? newCount === 1
                  ? t('1 request needs your attention. Your reply is the whole game.')
                  : t('{count} requests need your attention. Your replies are the whole game.', { count: newCount })
                : t('You’re all caught up. Your profile is doing the first round of questions for you.')}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit rounded-full">
            <Link to="/onboarding">
              {t('Edit your profile')} <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {profile.paused && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-semibold text-amber-800">
            {t('Your profile is paused. Brides can’t view your services or send requests until you make it live again.')}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { label: t('New'), value: newCount, dot: true },
            { label: t('Replied'), value: repliedCount },
            { label: t('Confirmed'), value: confirmedCount },
            { label: t('Archived'), value: archivedCount },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border/70 bg-card px-4 py-3">
              <div className="flex items-center gap-1.5">
                {stat.dot && newCount > 0 && <span className="size-1.5 rounded-full bg-primary pulse-dot" />}
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
              </div>
              <p className="mt-1 font-display text-2xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {newestUnread && (
          <div className="mt-5 overflow-hidden rounded-2xl bg-[linear-gradient(110deg,hsl(15_24%_13%),hsl(342_31%_24%))] text-[hsl(30_40%_96%)]">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[hsl(var(--gold-soft))]" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold-soft))]">{t('New request')}</p>
                  <p className="mt-0.5 font-display text-lg leading-tight">
                    {newestUnread.brideName} · {formatEventDate(newestUnread.eventDate)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/55">
                    {t(newestUnread.occasion)} · {formatVenue(profile.city, newestUnread.venue) || t('Venue not shared')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => openLead(newestUnread)}
                  className="h-9 rounded-full bg-[hsl(30_40%_96%)] text-[hsl(15_24%_13%)] hover:bg-white"
                >
                  {t('Open request')} <ArrowRight className="size-3.5" />
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-9 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <a
                    href={waLink(profile.whatsapp, leadReminderMessage(newestUnread, profile.username, profile.city))}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="size-3.5" /> {t('Send yourself a reminder')}
                  </a>
                </Button>
              </div>
            </div>
            <p className="border-t border-white/10 px-5 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">
              {t('This opens your own WhatsApp chat with a ready reminder — no extra cost')}
            </p>
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto rounded-full border border-border/70 bg-card p-1">
                {tabs.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                      tab === item.key
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${
                      tab === item.key ? 'bg-white/20' : item.key === 'new' && item.count > 0 ? 'bg-accent text-primary' : 'bg-secondary'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('Search brides, venue…')}
                  className="h-9 rounded-full bg-card pl-9 text-xs"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {filtered.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => openLead(lead)}
                  className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-black/[0.04]"
                >
                  {lead.unread && <span className="absolute right-4 top-4 size-2 rounded-full bg-primary pulse-dot" aria-label={t('Unread')} />}
                  <div className="flex items-start justify-between gap-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xs text-primary">
                        {initials(lead.brideName)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-[16px] leading-tight">{lead.brideName}</p>
                        <p className="mt-0.5 truncate text-[10px] font-semibold text-muted-foreground">
                          {t(lead.occasion)} · {formatEventDate(lead.eventDate, 'd MMM')}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${fitMeta[lead.fitLabel].chip}`}>
                      {t(fitMeta[lead.fitLabel].label)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{formatVenue(profile.city, lead.venue) || t('Venue not shared')}</span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {lead.services.slice(0, 2).map((service) => (
                      <span key={service} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[9px] font-semibold text-foreground/70">
                        {service}
                      </span>
                    ))}
                    {lead.services.length > 2 && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
                        +{lead.services.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground">
                      <span>{t(lead.budget || 'Not shared')}</span>
                      <span className="size-0.5 rounded-full bg-muted-foreground/40" />
                      <span>
                        {daysUntil(lead.eventDate) >= 0
                          ? t('{count} days away', { count: daysUntil(lead.eventDate) })
                          : t('Past date')}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                      {t('Open')} <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Inbox className="size-5" />
                </span>
                <p className="mt-4 font-display text-xl">{search ? t('No matches for that search') : emptyCopy[tab].title}</p>
                <p className="mt-1 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
                  {search ? t('Try a different name, venue or service.') : emptyCopy[tab].body}
                </p>
                {!search && tab === 'new' && (
                  <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                    <Link to={`/p/${profile.username}`}>{t('See your public profile')}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">{t('Your public link')}</p>
                <Link2 className="size-3.5 text-primary" />
              </div>
              <h2 className="mt-2 font-display text-xl">{t('Share your profile')}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {t('Put this link in your Instagram bio. Brides land on your portfolio and send details here.')}
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 pl-3">
                <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                <p className="truncate text-[11px] font-semibold">{profileUrl(profile.username)}</p>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button size="sm" className="h-9 rounded-full text-[11px]" onClick={() => copy(profileUrl(profile.username), t('Profile link copied'))}>
                  <Copy className="size-3.5" /> {t('Copy')}
                </Button>
                <Button asChild size="sm" variant="outline" className="h-9 rounded-full text-[11px]">
                  <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noreferrer">
                    <MessageCircle className="size-3.5" /> WhatsApp
                  </a>
                </Button>
              </div>

              <Link to={`/p/${profile.username}`} className="mt-3 flex items-center justify-center gap-1 text-[10px] font-bold text-primary">
                {t('Preview your profile')} <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="eyebrow">{t('Availability')}</p>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${unavailableDates.length ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {unavailableDates.length ? t('{count} blocked', { count: unavailableDates.length }) : t('All open')}
                </span>
              </div>
              <h2 className="mt-2 font-display text-xl">{t('Protect your dates')}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {t('Tap a date to block it. Brides see a gentle warning, but can still send a request.')}
              </p>

              <Calendar
                mode="single"
                selected={undefined}
                onSelect={handleBlockDate}
                disabled={{ before: startOfToday() }}
                modifiers={{ blocked: blockedDates }}
                modifiersClassNames={{ blocked: 'bg-rose-100 text-rose-800 font-bold hover:bg-rose-200' }}
                className="mx-auto mt-2 rounded-xl border border-border/60 bg-card"
              />

              {unavailableDates.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {unavailableDates.slice(0, 4).map((date) => (
                    <div key={date} className="flex items-center justify-between rounded-lg bg-secondary/60 px-2.5 py-1.5">
                      <p className="text-[10px] font-bold">{formatEventDate(date, 'd MMM yyyy')}</p>
                      <button
                        type="button"
                        onClick={() => { void toggleUnavailableDate(date); toast.success(t('Date is open again')) }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={t('Unblock {date}', { date })}
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  {unavailableDates.length > 4 && (
                    <p className="text-[9px] font-semibold text-muted-foreground">{t('+{count} more', { count: unavailableDates.length - 4 })}</p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-accent/40 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">{t('How summaries work')}</p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                {t('Each request arrives with a short summary and a fit check built from your services and availability. Nothing is sent to the bride automatically.')}
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-10 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {demo ? t('Preview studio · saved in this browser') : t('Your studio · private to your account')}
        </p>
      </main>

      <LeadDetail
        lead={activeLead}
        onClose={() => setDetailId(null)}
        onStatus={(id, status) => setLeadStatus(id, status)}
      />
    </div>
  )
}

function LeadDetail({
  lead,
  onClose,
  onStatus,
}: {
  lead: Lead | null
  onClose: () => void
  onStatus: (id: string, status: LeadStatus) => Promise<void>
}) {
  const { unavailableDates, toggleUnavailableDate, profile } = useStore()
  const { t, lang } = useI18n()

  const blocked = lead ? unavailableDates.includes(lead.eventDate) : false
  const message = lead ? leadOpener(lead, profile?.fullName || '', lang) : ''

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message)
      toast.success(t('Opener copied — paste it on WhatsApp'))
    } catch {
      toast.error(t('Could not copy the message'))
    }
  }

  const toggleBlocked = () => {
    if (!lead) return
    void toggleUnavailableDate(lead.eventDate)
    toast.success(blocked ? t('Date is open for requests again') : t('Date marked unavailable'))
  }

  const replyOnWhatsApp = async () => {
    if (!lead) return
    window.open(waLink(lead.brideWhatsapp, message), '_blank', 'noopener')
    if (lead.status === 'new') {
      await onStatus(lead.id, 'replied')
      toast.success(t('WhatsApp opened — request marked Replied'), {
        action: {
          label: t('Undo'),
          onClick: () => { void onStatus(lead.id, 'new') },
        },
      })
      return
    }
    toast.success(t('Opening WhatsApp…'))
  }

  return (
    <Dialog open={Boolean(lead)} onOpenChange={(open) => !open && onClose()}>
      {lead && (
        <DialogContent className="max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto rounded-2xl p-0">
          <DialogDescription className="sr-only">
            {t('Full booking request from {name}', { name: lead.brideName })}
          </DialogDescription>
          <div className="border-b border-border/60 bg-secondary/40 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 pr-6">
              <div className="flex items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base text-primary-foreground">
                  {initials(lead.brideName)}
                </span>
                <div>
                  <DialogTitle className="font-display text-2xl leading-tight">{lead.brideName}</DialogTitle>
                  <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                    +91 {lead.brideWhatsapp} · {t('received {date}', { date: format(parseISO(lead.createdAt), 'd MMM, h:mm a') })}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${statusMeta[lead.status].chip}`}>
                  {t(statusMeta[lead.status].label)}
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${fitMeta[lead.fitLabel].chip}`}>
                  {t(fitMeta[lead.fitLabel].label)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: t('Occasion'), value: t(lead.occasion) },
                { icon: CalendarDays, label: t('Event date'), value: formatEventDateLong(lead.eventDate) },
                { icon: Clock3, label: t('Ready by'), value: lead.readyBy ? formatTime(lead.readyBy) : t('Not specified') },
                { icon: MapPin, label: t('Venue'), value: formatVenue(profile?.city || '', lead.venue) || t('Not shared') },
                { icon: IndianRupee, label: t('Budget'), value: t(lead.budget || 'Not shared') },
                ...(lead.services.some((service) => service.toLowerCase().includes('family')) && lead.familyCount > 0
                  ? [{ icon: Users, label: t('Family makeup'), value: t('{count} people', { count: lead.familyCount }) }]
                  : []),
              ].map((fact) => (
                <div key={fact.label} className="rounded-xl border border-border/60 bg-card px-3 py-2.5">
                  <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <fact.icon className="size-3" /> {fact.label}
                  </p>
                  <p className="mt-1 text-[11px] font-bold leading-snug">{fact.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="field-label">{t('Services requested')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lead.services.map((service) => (
                  <span key={service} className="rounded-full border border-primary/15 bg-accent px-2.5 py-1 text-[10px] font-bold text-primary">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {lead.notes && (
              <div>
                <p className="field-label">{t('Her note')}</p>
                <p className="mt-1.5 rounded-xl border border-border/60 bg-secondary/40 px-3.5 py-3 text-[12px] leading-relaxed text-foreground/80">
                  “{lead.notes}”
                </p>
              </div>
            )}

            {lead.inspirationPhoto && (
              <div>
                <p className="field-label">{t('Inspiration photo')}</p>
                <a href={lead.inspirationPhoto} target="_blank" rel="noreferrer" className="mt-2 block w-fit">
                  <img src={lead.inspirationPhoto} alt={t('Bride inspiration')} className="h-28 rounded-xl border border-border object-cover" />
                </a>
              </div>
            )}

            <div className="rounded-2xl border border-primary/15 bg-accent/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary/70">
                  <Wand2 className="size-3.5" /> {t('Request summary')}
                </p>
                <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${fitMeta[lead.fitLabel].chip}`}>
                  <span className={`size-1.5 rounded-full ${fitMeta[lead.fitLabel].dot}`} />
                  {t(fitMeta[lead.fitLabel].label)}
                </span>
              </div>

              <p className="mt-2.5 text-[12px] leading-relaxed text-foreground/80">{leadSummary(lead, lang, profile?.city || '')}</p>
              <div className="mt-3 rounded-xl bg-card/70 px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t('Why this label')}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-foreground/75">{leadFitReason(lead, lang)}</p>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t('Suggested opener')}</p>
                  <button type="button" onClick={copyMessage} className="flex items-center gap-1 text-[9px] font-bold text-primary">
                    <Copy className="size-3" /> {t('Copy')}
                  </button>
                </div>
                <p className="mt-1.5 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-[11px] leading-relaxed text-foreground/85">
                  {message}
                </p>
              </div>
            </div>

            {blocked && (
              <p className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-800">
                <CalendarX2 className="size-3.5" /> {t('You have marked this date as unavailable.')}
              </p>
            )}

            <div className="flex flex-col gap-2 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold">{t('Lead status')}</p>
                <p className="text-[10px] text-muted-foreground">{t('Move this request through your pipeline.')}</p>
              </div>
              <Select value={lead.status} onValueChange={(value) => void onStatus(lead.id, value as LeadStatus)}>
                <SelectTrigger className="h-9 w-full rounded-full text-[11px] font-semibold sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOrder.map((status) => (
                    <SelectItem key={status} value={status} className="text-[11px] font-semibold">
                      {t(statusMeta[status].label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-border/60 bg-background/95 p-4 backdrop-blur">
            <Button
              className="h-10 flex-1 rounded-full text-[12px]"
              onClick={() => void replyOnWhatsApp()}
            >
              <MessageCircle className="size-4" /> {t('Reply on WhatsApp')}
            </Button>
            <Button variant="outline" className="h-10 rounded-full text-[12px]" onClick={copyMessage}>
              <Copy className="size-3.5" /> {t('Copy opener')}
            </Button>
            <Button variant="ghost" className="h-10 rounded-full text-[12px]" onClick={toggleBlocked}>
              <CalendarX2 className="size-3.5" /> {blocked ? t('Unblock date') : t('Block this date')}
            </Button>
            {!blocked && (
              <p className="w-full text-[10px] text-muted-foreground">
                {t('This blocks the date in Availability; the request itself stays unchanged.')}
              </p>
            )}
            <Button
              variant="ghost"
              className="h-10 rounded-full text-[12px]"
              onClick={() => {
                void onStatus(lead.id, 'archived')
                toast.success(t('Request archived'))
                onClose()
              }}
            >
              <Archive className="size-3.5" /> {t('Archive')}
            </Button>
            {lead.status === 'new' && (
              <Button
                variant="ghost"
                className="h-10 rounded-full text-[12px]"
                onClick={() => void onStatus(lead.id, 'replied')}
              >
                <CheckCircle2 className="size-3.5" /> {t('Mark replied')}
              </Button>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
