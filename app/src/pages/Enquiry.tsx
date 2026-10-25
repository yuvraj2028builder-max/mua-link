import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { format, parseISO, startOfToday } from 'date-fns'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Crown,
  Gem,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { useOptionalStore } from '../store'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { usePublicArtist } from '../hooks/usePublicArtist'
import { createEnquiry } from '../lib/api'
import { buildLeadReview } from '../lib/review'
import { hasBackend } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { emptyEnquiry } from '../data'
import type { EnquiryDraft } from '../types'
import { budgets, formatEventDateLong, formatTime, isValidIndianMobile, occasions } from '../lib/site'
import { compressImage } from '../lib/image'

const occasionIcons: Record<string, LucideIcon> = {
  'Bridal (Main Wedding)': Crown,
  Engagement: Gem,
  'Pre-Wedding Shoot': Camera,
  Reception: Sparkles,
  'Party / Function': PartyPopper,
  Other: MoreHorizontal,
}

function loadDraft(username: string): EnquiryDraft {
  try {
    const saved = localStorage.getItem(`mualink-enquiry-${username}`)
    if (saved) return { ...emptyEnquiry, ...JSON.parse(saved) as EnquiryDraft }
  } catch {
    // ignore a corrupted draft
  }
  return { ...emptyEnquiry }
}

export default function Enquiry() {
  const { username } = useParams()
  const { artist, unavailableDates, loading, error } = usePublicArtist(username)
  const store = useOptionalStore()
  const { t } = useI18n()
  const [searchParams] = useSearchParams()

  usePageMeta({
    title: artist ? t('Send a booking request to {name}', { name: artist.fullName }) : t('Booking request'),
    description: artist
      ? t('Share your wedding date, venue and services with {name} in one short form. No account needed.', { name: artist.fullName })
      : undefined,
    image: artist?.profilePhoto || undefined,
  })

  const [draft, setDraft] = useState<EnquiryDraft>(() => loadDraft(username || 'demo'))
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const serviceParam = searchParams.get('service')
  const draftKey = `mualink-enquiry-${username || 'demo'}`

  const steps = [
    { title: t('Let’s start with you'), subtitle: t('So the artist knows who she’s speaking to.') },
    { title: t('What’s the occasion?'), subtitle: t('This helps her suggest the right look.') },
    { title: t('Which services do you need?'), subtitle: t('Pick everything that applies. You can discuss details later.') },
    { title: t('When and where?'), subtitle: t('The date, ready-by time and venue area.') },
    { title: t('A rough budget?'), subtitle: t('Completely optional. It just saves a round of messages.') },
    { title: t('Anything else?'), subtitle: t('Share a note or an inspiration photo if you have one.') },
    { title: t('One last look'), subtitle: t('Check the details before sending your request.') },
  ]

  useEffect(() => {
    if (!serviceParam || !artist) return
    if (!artist.services.some((service) => service.name === serviceParam)) return
    setDraft((current) => current.services.includes(serviceParam)
      ? current
      : { ...current, services: [...current.services, serviceParam] })
  }, [serviceParam, artist])

  useEffect(() => {
    if (submitted) return
    try {
      localStorage.setItem(draftKey, JSON.stringify(draft))
    } catch {
      // private mode — the draft simply won't survive a refresh
    }
  }, [draft, draftKey, submitted])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <Logo />
        <span className="size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-label={t('Loading')} />
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <Logo />
        <p className="mt-10 eyebrow">{t('Not available')}</p>
        <h1 className="mt-3 max-w-lg text-4xl">{t('This request link isn’t active.')}</h1>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {error || t('The artist may have paused their profile or changed their link.')}
        </p>
        <Button asChild className="mt-7 rounded-full"><Link to="/">{t('Explore MUALink')}</Link></Button>
      </div>
    )
  }

  const firstName = artist.fullName.split(' ')[0] || artist.fullName
  const update = (patch: Partial<EnquiryDraft>) => setDraft((current) => ({ ...current, ...patch }))
  const selectedDate = draft.eventDate ? parseISO(`${draft.eventDate}T12:00:00`) : undefined
  const dateUnavailable = Boolean(draft.eventDate && unavailableDates.includes(draft.eventDate))
  const familyServiceSelected = draft.services.some((service) => service.toLowerCase().includes('family'))
  const visibleServices = artist.services.filter((service) => service.visible)

  const toggleService = (name: string) => {
    setDraft((current) => {
      const selected = current.services.includes(name)
      const services = selected ? current.services.filter((item) => item !== name) : [...current.services, name]
      const familySelected = services.some((service) => service.toLowerCase().includes('family'))
      return { ...current, services, familyCount: familySelected ? Math.max(1, current.familyCount) : 0 }
    })
    setErrors((current) => ({ ...current, services: '', familyCount: '' }))
  }

  const validate = (currentStep: number) => {
    const next: Record<string, string> = {}
    if (currentStep === 1) {
      if (draft.brideName.trim().length < 2) next.brideName = t('Please enter your name')
      if (!isValidIndianMobile(draft.brideWhatsapp)) next.brideWhatsapp = t('Enter a valid 10-digit Indian mobile number')
    }
    if (currentStep === 2 && !draft.occasion) next.occasion = t('Choose an occasion to continue')
    if (currentStep === 3) {
      if (!draft.services.length) next.services = t('Select at least one service')
      if (familyServiceSelected && draft.familyCount < 1) next.familyCount = t('Add the number of people')
    }
    if (currentStep === 4) {
      if (!draft.eventDate) next.eventDate = t('Pick your event date')
      if (!draft.venue.trim()) next.venue = t('Add the venue or area')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goTo = (nextStep: number) => {
    setStep(nextStep)
    setErrors({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNext = async () => {
    if (!validate(step)) return
    if (step < 7) {
      goTo(step + 1)
      return
    }

    setSubmitting(true)
    try {
      if (hasBackend) {
        const review = buildLeadReview(draft, artist, unavailableDates)
        await createEnquiry(artist.id, draft, review)
      } else {
        store?.addLead(draft)
      }
      localStorage.removeItem(draftKey)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success(t('Request sent! She’ll reply on WhatsApp.'))
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : t('Could not send your request. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const compressed = await compressImage(file)
      update({ inspirationPhoto: compressed })
      toast.success(t('Inspiration photo added'))
    } catch (photoError) {
      toast.error(photoError instanceof Error ? photoError.message : t('Could not upload that photo'))
    } finally {
      setUploading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-background texture-warm">
        <header className="border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="page-shell flex h-16 items-center justify-between">
            <Logo />
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> {t('Request sent')}
            </span>
          </div>
        </header>

        <main className="page-shell flex max-w-xl flex-1 flex-col justify-center py-12">
          <div className="animate-fade-up rounded-[1.8rem] border border-border/70 bg-card p-7 text-center shadow-xl shadow-black/5 sm:p-10">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="size-8" />
            </span>
            <p className="mt-6 eyebrow">{t('Submitted')}</p>
            <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">
              {t('{name} will get back to you on WhatsApp.', { name: firstName })}
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('Your request is in her dashboard. Expect a reply at {number} within 24 hours.', { number: draft.brideWhatsapp })}
            </p>

            <div className="mt-7 rounded-2xl border border-border/70 bg-secondary/50 p-4 text-left text-[12px]">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-2.5">
                <span className="text-muted-foreground">{t('Occasion')}</span>
                <span className="font-semibold">{t(draft.occasion)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5">
                <span className="text-muted-foreground">{t('Date')}</span>
                <span className="font-semibold">{formatEventDateLong(draft.eventDate)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5">
                <span className="text-muted-foreground">{t('Venue')}</span>
                <span className="font-semibold">{draft.venue}</span>
              </div>
              <div className="flex items-start justify-between gap-3 pt-2.5">
                <span className="shrink-0 text-muted-foreground">{t('Services')}</span>
                <span className="text-right font-semibold">{draft.services.join(', ')}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Button asChild variant="outline" className="h-11 flex-1 rounded-full">
                <Link to={`/p/${artist.username}`}>{t('Back to profile')}</Link>
              </Button>
              <Button asChild className="h-11 flex-1 rounded-full">
                <Link to="/">
                  {t('Explore MUALink')} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t('You can safely close this page')}
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background texture-warm">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="page-shell flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link
              to={`/p/${artist.username}`}
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> {t('Back to {name}', { name: firstName })}
            </Link>
          </div>
        </div>
      </header>

      <main className="page-shell max-w-2xl pb-28 pt-6 sm:pt-10">
        <div className="mb-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{t('Booking request · {name}', { name: firstName })}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {t('Step {step} of 7', { step })}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" /> {t('Saved automatically')}
            </span>
          </div>
          <Progress value={(step / 7) * 100} className="mt-3 h-1.5 bg-secondary [&>[data-slot=progress-indicator]]:bg-primary" />
        </div>

        <div key={step} className="animate-fade-up rounded-[1.8rem] border border-border/70 bg-card p-5 shadow-xl shadow-black/[0.04] sm:p-8">
          <p className="eyebrow">{step === 7 ? t('Review') : t('Your details')}</p>
          <h1 className="mt-2 text-2xl leading-tight sm:text-3xl">{steps[step - 1].title}</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">{steps[step - 1].subtitle}</p>

          <div className="mt-6">
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="bride-name" className="field-label">{t('Your name')}</Label>
                  <Input
                    id="bride-name"
                    value={draft.brideName}
                    onChange={(event) => { update({ brideName: event.target.value }); setErrors((current) => ({ ...current, brideName: '' })) }}
                    placeholder="Sneha Kapoor"
                    autoComplete="name"
                    className="mt-2 h-12 rounded-xl text-[15px]"
                    aria-invalid={Boolean(errors.brideName)}
                  />
                  {errors.brideName && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.brideName}</p>}
                </div>
                <div>
                  <Label htmlFor="bride-whatsapp" className="field-label">{t('WhatsApp number')}</Label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring/30">
                    <span className="text-[13px] font-bold text-muted-foreground">+91</span>
                    <Input
                      id="bride-whatsapp"
                      inputMode="numeric"
                      value={draft.brideWhatsapp}
                      onChange={(event) => { update({ brideWhatsapp: event.target.value.replace(/\D/g, '').slice(0, 10) }); setErrors((current) => ({ ...current, brideWhatsapp: '' })) }}
                      placeholder="98765 43210"
                      autoComplete="tel"
                      className="h-12 border-0 bg-transparent px-0 text-[15px] shadow-none focus-visible:ring-0"
                      aria-invalid={Boolean(errors.brideWhatsapp)}
                    />
                  </div>
                  {errors.brideWhatsapp
                    ? <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.brideWhatsapp}</p>
                    : <p className="mt-1.5 text-[11px] text-muted-foreground">{t('Only {name} will see this. She’ll reply here.', { name: firstName })}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {occasions.map((occasion) => {
                    const Icon = occasionIcons[occasion] || Sparkles
                    const selected = draft.occasion === occasion
                    return (
                      <button
                        key={occasion}
                        type="button"
                        onClick={() => { update({ occasion }); setErrors({}) }}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                          selected ? 'border-primary bg-accent shadow-sm' : 'border-border bg-background hover:border-primary/40'
                        }`}
                      >
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>
                          <Icon className="size-4" />
                        </span>
                        <span className="text-[13px] font-bold">{t(occasion)}</span>
                        {selected && <Check className="ml-auto size-4 text-primary" />}
                      </button>
                    )
                  })}
                </div>
                {errors.occasion && <p className="mt-3 text-[11px] font-semibold text-destructive">{errors.occasion}</p>}
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="space-y-2">
                  {visibleServices.map((service) => {
                    const selected = draft.services.includes(service.name)
                    return (
                      <label
                        key={service.id}
                        htmlFor={`service-${service.id}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                          selected ? 'border-primary/60 bg-accent/60' : 'border-border bg-background hover:border-primary/30'
                        }`}
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selected}
                          onCheckedChange={() => toggleService(service.name)}
                          className="mt-0.5"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px] font-bold">{service.name}</span>
                            <span className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                              {service.priceType === 'custom_quote'
                                ? t('Custom quote')
                                : service.priceType === 'starting_from'
                                  ? t('from ₹{price}', { price: (service.price ?? 0).toLocaleString('en-IN') })
                                  : `₹${(service.price ?? 0).toLocaleString('en-IN')}`}
                            </span>
                          </span>
                          <span className="mt-1 block text-[11px] leading-relaxed text-muted-foreground">{service.description}</span>
                        </span>
                      </label>
                    )
                  })}
                </div>
                {errors.services && <p className="mt-2 text-[11px] font-semibold text-destructive">{errors.services}</p>}

                {familyServiceSelected && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-border bg-secondary/60 p-4">
                    <div>
                      <p className="text-[13px] font-bold">{t('How many people in the family?')}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{t('Including the bride, if relevant.')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => update({ familyCount: Math.max(1, draft.familyCount - 1) })}
                        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-lg leading-none"
                        aria-label={t('Fewer people')}
                      >−</button>
                      <span className="w-6 text-center text-sm font-bold">{draft.familyCount}</span>
                      <button
                        type="button"
                        onClick={() => update({ familyCount: Math.min(20, draft.familyCount + 1) })}
                        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-lg leading-none"
                        aria-label={t('More people')}
                      >+</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <Label className="field-label">{t('Event date')}</Label>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={`mt-2 h-12 w-full justify-start rounded-xl px-4 text-[13px] font-semibold ${!draft.eventDate ? 'text-muted-foreground' : ''}`}
                      >
                        <CalendarDays className="size-4 text-primary" />
                        {draft.eventDate ? formatEventDateLong(draft.eventDate) : t('Choose a date')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date) {
                            update({ eventDate: format(date, 'yyyy-MM-dd') })
                            setDateOpen(false)
                            setErrors((current) => ({ ...current, eventDate: '' }))
                          }
                        }}
                        disabled={{ before: startOfToday() }}
                        defaultMonth={selectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.eventDate && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.eventDate}</p>}
                  {dateUnavailable && (
                    <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                      {t('This date may already be booked — submit anyway and {name} will confirm.', { name: firstName })}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="ready-by" className="field-label">{t('Ready by (optional)')}</Label>
                  <div className="relative mt-2">
                    <Clock3 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="ready-by"
                      type="time"
                      value={draft.readyBy}
                      onChange={(event) => update({ readyBy: event.target.value })}
                      className="h-12 rounded-xl pl-9 text-[13px]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {draft.readyBy
                      ? t('Ready by {time}', { time: formatTime(draft.readyBy) })
                      : t('When should the makeup be finished?')}
                  </p>
                </div>

                <div>
                  <Label htmlFor="venue" className="field-label">{t('Venue city / area')}</Label>
                  <div className="relative mt-2">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="venue"
                      value={draft.venue}
                      onChange={(event) => { update({ venue: event.target.value }); setErrors((current) => ({ ...current, venue: '' })) }}
                      placeholder={t('e.g. The Leela, Gurgaon')}
                      className="h-12 rounded-xl pl-9 text-[13px]"
                      aria-invalid={Boolean(errors.venue)}
                    />
                  </div>
                  {errors.venue && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.venue}</p>}
                  {artist.serviceCities.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {artist.serviceCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => update({ venue: city })}
                          className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {budgets.map((budget) => {
                    const selected = draft.budget === budget
                    return (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => update({ budget })}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[13px] font-bold transition-all ${
                          selected ? 'border-primary bg-accent shadow-sm' : 'border-border bg-background hover:border-primary/40'
                        }`}
                      >
                        {t(budget)}
                        <span className={`flex size-5 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                          {selected && <Check className="size-3" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                  {t('Not sure yet? Skip this — {name} will share options after understanding your look.', { name: firstName })}
                </p>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="notes" className="field-label">{t('Anything else? (optional)')}</Label>
                  <Textarea
                    id="notes"
                    value={draft.notes}
                    onChange={(event) => update({ notes: event.target.value.slice(0, 500) })}
                    placeholder={t('Outfit colour, skin concerns, the look you love…')}
                    className="mt-2 min-h-28 rounded-xl text-[13px]"
                  />
                  <p className="mt-1 text-right text-[10px] text-muted-foreground">{draft.notes.length}/500</p>
                </div>

                <div>
                  <Label className="field-label">{t('Inspiration photo (optional)')}</Label>
                  {draft.inspirationPhoto ? (
                    <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
                      <img src={draft.inspirationPhoto} alt={t('Inspiration')} className="size-16 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold">{t('Inspiration added')}</p>
                        <p className="text-[10px] text-muted-foreground">{t('Compressed and ready to send')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => update({ inspirationPhoto: undefined })}
                        className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-destructive"
                        aria-label={t('Remove inspiration photo')}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-accent/30">
                      <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                        {uploading ? <Upload className="size-4 animate-pulse" /> : <Camera className="size-4" />}
                      </span>
                      <span className="text-[12px] font-bold">{uploading ? t('Compressing photo…') : t('Add a look you love')}</span>
                      <span className="text-[10px] text-muted-foreground">{t('JPG, PNG or WEBP · up to 5MB')}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        disabled={uploading}
                        onChange={(event) => handlePhoto(event.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-primary/10 bg-accent/40 px-3.5 py-3 text-[11px] leading-relaxed text-foreground/70">
                  <Wand2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {t('{name} gets a short summary of this request with your dates and services. You won’t need to repeat it on WhatsApp.', { name: firstName })}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/70 bg-secondary/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('You')}</p>
                    <button type="button" onClick={() => goTo(1)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                  </div>
                  <p className="mt-1.5 text-[13px] font-bold">{draft.brideName}</p>
                  <p className="text-[11px] text-muted-foreground">+91 {draft.brideWhatsapp}</p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Occasion & services')}</p>
                    <button type="button" onClick={() => goTo(2)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                  </div>
                  <p className="mt-1.5 text-[13px] font-bold">{t(draft.occasion)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {draft.services.join(', ')}
                    {familyServiceSelected && draft.familyCount > 0
                      ? ` · ${t('{count} family members', { count: draft.familyCount })}`
                      : ''}
                  </p>
                </div>

                <div className="rounded-xl border border-border/70 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Date & venue')}</p>
                    <button type="button" onClick={() => goTo(4)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                  </div>
                  <p className="mt-1.5 text-[13px] font-bold">{formatEventDateLong(draft.eventDate)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {draft.venue}{draft.readyBy ? ` · ${t('ready by {time}', { time: formatTime(draft.readyBy) })}` : ''}
                  </p>
                  {dateUnavailable && (
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                      <AlertTriangle className="size-3" /> {t('Date may already be booked — she will confirm')}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Budget')}</p>
                      <button type="button" onClick={() => goTo(5)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                    </div>
                    <p className="mt-1.5 text-[13px] font-bold">{draft.budget ? t(draft.budget) : t('Not shared')}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Inspiration')}</p>
                      <button type="button" onClick={() => goTo(6)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                    </div>
                    {draft.inspirationPhoto
                      ? <img src={draft.inspirationPhoto} alt={t('Inspiration')} className="mt-1.5 size-12 rounded-md object-cover" />
                      : <p className="mt-1.5 text-[11px] text-muted-foreground">{t('Not added')}</p>}
                  </div>
                </div>

                {draft.notes && (
                  <div className="rounded-xl border border-border/70 bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('Notes')}</p>
                      <button type="button" onClick={() => goTo(6)} className="text-[10px] font-bold text-primary">{t('Edit')}</button>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/75">{draft.notes}</p>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-xl border border-border/70 bg-secondary/50 px-3.5 py-3 text-[11px] leading-relaxed text-muted-foreground">
                  <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {t('{name} will reply on WhatsApp at the number you gave. No payment is taken here.', { name: firstName })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-7 flex items-center gap-3 border-t border-border/60 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => goTo(Math.max(1, step - 1))}
              disabled={step === 1 || submitting}
              className="h-11 rounded-full px-4 text-[12px]"
            >
              <ArrowLeft className="size-4" /> {t('Back')}
            </Button>
            <div className="flex-1" />
            <Button type="button" onClick={goNext} disabled={submitting} className="h-11 min-w-[9.5rem] rounded-full px-6 text-[12px]">
              {submitting
                ? <>{t('Sending…')}</>
                : step === 7
                  ? <>{t('Send request')} <Check className="size-4" /></>
                  : <>{t('Continue')} <ArrowRight className="size-4" /></>}
            </Button>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('Powered by MUALink · Your details stay between you and {name}', { name: firstName })}
        </p>
      </main>
    </div>
  )
}
