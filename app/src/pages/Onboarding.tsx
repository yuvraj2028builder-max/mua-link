import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  ImagePlus,
  Link2,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store'
import { useAuth } from '../auth/AuthProvider'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { hasBackend } from '../lib/supabase'
import { isUsernameTaken } from '../lib/api'
import { newProfile } from '../lib/profile'
import { demoProfile } from '../data'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import UserMenu from '../components/UserMenu'
import { FullPageLoader } from '../components/RequireAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { compressImage } from '../lib/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MuaProfile, PortfolioItem, Service } from '../types'
import {
  formatTime,
  inr,
  isValidIndianMobile,
  languages as languageOptions,
  portfolioTags,
  profileUrl,
  RESERVED_USERNAMES,
  slugify,
  weekDays,
} from '../lib/site'

function cloneProfile(profile: MuaProfile): MuaProfile {
  return {
    ...profile,
    services: profile.services.map((service) => ({ ...service })),
    portfolio: profile.portfolio.map((item) => ({ ...item })),
    serviceCities: [...profile.serviceCities],
    workingDays: [...profile.workingDays],
    languages: [...profile.languages],
  }
}

function usernameError(value: string) {
  if (value.length < 3 || value.length > 30) return 'Use 3–30 characters'
  if (!/^[a-z0-9_]+$/.test(value)) return 'Only lowercase letters, numbers and underscores'
  if (RESERVED_USERNAMES.includes(value)) return 'That username is reserved'
  return ''
}

export default function Onboarding() {
  const { profile, loading, error } = useStore()
  const { user } = useAuth()
  const { t } = useI18n()

  usePageMeta({ title: t('Profile builder') + ' · MUALink', noindex: true })

  if (loading) return <FullPageLoader label={t('Opening your profile builder…')} />

  if (error && !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <Logo />
        <h1 className="mt-6 text-3xl">{t('We couldn’t open your profile.')}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2 rounded-full">{t('Try again')}</Button>
      </div>
    )
  }

  const fallback = newProfile(
    user?.id || demoProfile.id,
    String(user?.user_metadata?.full_name || ''),
    user?.email || '',
    slugify(String(user?.user_metadata?.full_name || '')),
  )
  if (user?.user_metadata?.avatar_url && !fallback.profilePhoto) {
    fallback.profilePhoto = String(user.user_metadata.avatar_url)
  }

  return (
    <OnboardingForm
      key={profile?.id || fallback.id}
      baseProfile={profile || fallback}
      isNew={!profile}
    />
  )
}

function OnboardingForm({ baseProfile, isNew }: { baseProfile: MuaProfile; isNew: boolean }) {
  const { profile, saveProfile, refresh } = useStore()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [form, setForm] = useState<MuaProfile>(() => cloneProfile(baseProfile))
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [published, setPublished] = useState(false)
  const [cityInput, setCityInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [nameCheck, setNameCheck] = useState<'idle' | 'checking' | 'available' | 'taken'>(() =>
    form.username && hasBackend && !isNew ? 'available' : 'idle',
  )
  const formRef = useRef(form)
  const saveProfileRef = useRef(saveProfile)
  const lastSavedRef = useRef(JSON.stringify(form))
  const autosaveTimerRef = useRef<number | null>(null)

  useEffect(() => { formRef.current = form }, [form])
  useEffect(() => { saveProfileRef.current = saveProfile }, [saveProfile])

  useEffect(() => {
    const snapshot = JSON.stringify(form)
    if (snapshot === lastSavedRef.current) return

    const timer = window.setTimeout(() => {
      autosaveTimerRef.current = null
      setSaving(true)
      void saveProfileRef.current(form)
        .then((saved) => {
          lastSavedRef.current = JSON.stringify(saved)
          if (JSON.stringify(formRef.current) === snapshot) setForm(cloneProfile(saved))
        })
        .catch((saveError: unknown) => {
          toast.error(saveError instanceof Error ? saveError.message : t('Could not save your profile'))
        })
        .finally(() => setSaving(false))
    }, 700)
    autosaveTimerRef.current = timer

    return () => {
      window.clearTimeout(timer)
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null
    }
  }, [form, t])

  const steps = [
    { n: 1, label: t('Basics') },
    { n: 2, label: t('About') },
    { n: 3, label: t('Services') },
    { n: 4, label: t('Portfolio') },
    { n: 5, label: t('Working info') },
    { n: 6, label: t('Publish') },
  ]

  useEffect(() => {
    const username = form.username
    if (!hasBackend || username.length < 3) {
      setNameCheck('idle')
      return
    }
    if (!usernameError(username) && profile?.username === username) {
      setNameCheck('available')
      return
    }
    if (usernameError(username)) {
      setNameCheck('idle')
      return
    }
    setNameCheck('checking')
    let active = true
    const timer = window.setTimeout(() => {
      isUsernameTaken(username)
        .then((taken) => { if (active) setNameCheck(taken ? 'taken' : 'available') })
        .catch(() => { if (active) setNameCheck('idle') })
    }, 450)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [form.username, profile?.username])

  const update = (patch: Partial<MuaProfile>) => setForm((current) => ({ ...current, ...patch }))
  const clearError = (key: string) => setErrors((current) => ({ ...current, [key]: '' }))

  const updateService = (id: string, patch: Partial<Service>) =>
    setForm((current) => ({
      ...current,
      services: current.services.map((service) => service.id === id ? { ...service, ...patch } : service),
    }))

  const moveService = (index: number, direction: -1 | 1) =>
    setForm((current) => {
      const services = [...current.services]
      const target = index + direction
      if (target < 0 || target >= services.length) return current
      ;[services[index], services[target]] = [services[target], services[index]]
      return { ...current, services }
    })

  const addService = () =>
    setForm((current) => current.services.length >= 15 ? current : {
      ...current,
      services: [...current.services, {
        id: `svc-${Date.now()}`,
        name: '',
        description: '',
        priceType: 'fixed',
        price: null,
        visible: true,
      }],
    })

  const movePortfolio = (index: number, direction: -1 | 1) =>
    setForm((current) => {
      const portfolio = [...current.portfolio]
      const target = index + direction
      if (target < 0 || target >= portfolio.length) return current
      ;[portfolio[index], portfolio[target]] = [portfolio[target], portfolio[index]]
      return { ...current, portfolio }
    })

  const addCity = () => {
    const value = cityInput.trim()
    if (!value) return
    if (form.serviceCities.some((city) => city.toLowerCase() === value.toLowerCase())) {
      setCityInput('')
      return
    }
    update({ serviceCities: [...form.serviceCities, value] })
    setCityInput('')
    clearError('serviceCities')
  }

  const toggleArrayValue = (key: 'workingDays' | 'languages', value: string) => {
    const list = form[key]
    update({ [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] } as Partial<MuaProfile>)
    clearError(key)
  }

  const validate = (currentStep: number) => {
    const next: Record<string, string> = {}

    if (currentStep === 1) {
      if (form.fullName.trim().length < 2 || form.fullName.trim().length > 60) next.fullName = t('Use 2–60 characters')
      const nameIssue = usernameError(form.username)
      if (nameIssue) next.username = t(nameIssue)
      else if (nameCheck === 'taken') next.username = t('That profile link is already taken. Try another username.')
      if (!form.city.trim()) next.city = t('Add your city')
      if (!isValidIndianMobile(form.whatsapp)) next.whatsapp = t('Enter a valid 10-digit Indian mobile number')
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('Enter a valid email address')
    }

    if (currentStep === 2) {
      if (!form.bio.trim()) next.bio = t('Write a short bio')
      if (form.bio.length > 300) next.bio = t('Keep it under 300 characters')
    }

    if (currentStep === 3) {
      if (form.services.length === 0) next.services = t('Add at least one service')
      form.services.forEach((service, index) => {
        if (!service.name.trim()) next[`service-name-${index}`] = t('Add a service name')
        if (service.priceType !== 'custom_quote' && (service.price == null || service.price < 0)) {
          next[`service-price-${index}`] = t('Add a price or choose custom quote')
        }
      })
    }

    if (currentStep === 5) {
      if (form.serviceCities.length === 0) next.serviceCities = t('Add at least one city or area')
      if (form.workingDays.length === 0) next.workingDays = t('Pick at least one working day')
      if (!form.workingFrom || !form.workingTo) next.hours = t('Set your working hours')
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goTo = (nextStep: number) => {
    setStep(nextStep)
    setMaxStep((current) => Math.max(current, nextStep))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const confirmUsernameFree = async () => {
    if (!hasBackend) return true
    if (profile?.username === form.username) return true
    try {
      const taken = await isUsernameTaken(form.username)
      if (taken) {
        setErrors((current) => ({ ...current, username: t('That profile link is already taken. Try another username.') }))
        setNameCheck('taken')
        return false
      }
      setNameCheck('available')
      return true
    } catch {
      return true
    }
  }

  const goNext = async () => {
    if (!validate(step)) return
    if (step === 1 && !(await confirmUsernameFree())) return
    if (step < 6) {
      try {
        await persist(form)
        goTo(step + 1)
      } catch (saveError) {
        toast.error(saveError instanceof Error ? saveError.message : t('Could not save your profile'))
      }
    }
  }

  const persist = async (next: MuaProfile) => {
    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current)
      autosaveTimerRef.current = null
    }
    if (JSON.stringify(next) === lastSavedRef.current) return next
    setSaving(true)
    try {
      const saved = await saveProfile(next)
      lastSavedRef.current = JSON.stringify(saved)
      if (JSON.stringify(formRef.current) === JSON.stringify(next)) setForm(cloneProfile(saved))
      return saved
    } finally {
      setSaving(false)
    }
  }

  const goBack = async () => {
    if (step === 1) return
    try {
      await persist(form)
      goTo(step - 1)
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : t('Could not save your profile'))
    }
  }

  const saveAndExit = async () => {
    if (!validate(1)) {
      goTo(1)
      toast.error(t('Add your basic details first'))
      return
    }
    if (!(await confirmUsernameFree())) {
      goTo(1)
      return
    }
    try {
      await persist(form)
      toast.success(t('Profile saved'))
      navigate('/dashboard')
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : t('Could not save your profile'))
    }
  }

  const publish = async () => {
    for (let current = 1; current <= 5; current += 1) {
      if (!validate(current)) {
        goTo(current)
        toast.error(t('A few details need attention'))
        return
      }
    }
    if (!(await confirmUsernameFree())) {
      goTo(1)
      return
    }
    try {
      await persist({ ...form, published: true, paused: false })
      setPublished(true)
      void refresh()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      toast.success(t('Your profile is live'))
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : t('Could not publish your profile'))
    }
  }

  const handleProfilePhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      update({ profilePhoto: await compressImage(file, 900, 0.75) })
      toast.success(t('Profile photo updated'))
    } catch (photoError) {
      toast.error(photoError instanceof Error ? photoError.message : t('Could not upload that photo'))
    } finally {
      setUploading(false)
    }
  }

  const handlePortfolio = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    try {
      const room = 20 - form.portfolio.length
      const chosen = Array.from(files).slice(0, room)
      const added: PortfolioItem[] = []
      for (const file of chosen) {
        const url = await compressImage(file, 1400, 0.72)
        added.push({ id: `photo-${Date.now()}-${added.length}`, url, tag: 'Other' })
      }
      update({ portfolio: [...form.portfolio, ...added] })
      if (files.length > room) toast.warning(t('Portfolio is capped at 20 photos'))
      else toast.success(t('{count} photos added', { count: added.length }))
    } catch (photoError) {
      toast.error(photoError instanceof Error ? photoError.message : t('Could not upload those photos'))
    } finally {
      setUploading(false)
    }
  }

  const copyLink = async (username: string) => {
    try {
      await navigator.clipboard.writeText(profileUrl(username))
      toast.success(t('Profile link copied'))
    } catch {
      toast.error(t('Could not copy the link'))
    }
  }

  if (published) {
    return (
      <div className="flex min-h-screen flex-col bg-background texture-warm">
        <header className="border-b border-border/60 bg-background/80 backdrop-blur">
          <div className="page-shell flex h-16 items-center justify-between">
            <Logo />
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              <Check className="size-4 text-primary" /> {t('Published')}
            </span>
          </div>
        </header>

        <main className="page-shell flex max-w-xl flex-1 flex-col justify-center py-12">
          <div className="animate-fade-up rounded-[1.8rem] border border-border/70 bg-card p-7 text-center shadow-xl shadow-black/5 sm:p-10">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-primary">
              <Link2 className="size-7" />
            </span>
            <p className="mt-6 eyebrow">{t('Your link is ready')}</p>
            <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{t('Your profile is live.')}</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t('Add this link to your Instagram bio. Brides will see your portfolio and send you a complete request.')}
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-2 pl-3">
              <Link2 className="size-4 shrink-0 text-primary" />
              <p className="min-w-0 flex-1 truncate text-left text-[12px] font-bold">{profileUrl(form.username)}</p>
              <Button size="sm" className="h-8 rounded-full text-[10px]" onClick={() => copyLink(form.username)}>
                <Copy className="size-3" /> {t('Copy')}
              </Button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="h-11 rounded-full text-[12px]">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(t('Hi! Here is my MUALink profile — you can send me your booking details here: {url}', { url: profileUrl(form.username) }))}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="size-4" /> {t('Share on WhatsApp')}
                </a>
              </Button>
              <Button asChild className="h-11 rounded-full text-[12px]">
                <Link to={`/p/${form.username}`}>
                  {t('View my profile')} <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>

            <button type="button" onClick={() => setPublished(false)} className="mt-5 text-[11px] font-bold text-muted-foreground hover:text-foreground">
              {t('Keep editing')}
            </button>

            <div className="mt-7 border-t border-border/60 pt-5">
              <Button asChild variant="ghost" className="h-10 w-full rounded-full text-[12px]">
                <Link to="/dashboard">{t('Go to dashboard')} <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              {t('Profile builder')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Button variant="ghost" size="sm" className="rounded-full text-[11px]" onClick={saveAndExit} disabled={saving}>
              {t('Save & exit')}
            </Button>
            <Button asChild variant="outline" size="sm" className="rounded-full text-[11px]">
              <Link to={`/p/${form.username || baseProfile.username}`}>
                {t('Preview')} <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="page-shell max-w-4xl py-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{t('MUA onboarding')}</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">{t('Build your profile')}</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{t('About 10 minutes. Everything can be edited later.')}</p>
          </div>
          <span className="flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <Clock3 className="size-3.5 text-primary" /> {t('Step {step} of 6', { step })}
          </span>
        </div>

        <div className="no-scrollbar mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-border/70 bg-card p-1.5">
          {steps.map((item) => {
            const active = step === item.n
            const complete = item.n < step
            const reachable = item.n <= maxStep
            return (
              <button
                key={item.n}
                type="button"
                disabled={!reachable}
                onClick={() => reachable && goTo(item.n)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-bold transition-colors ${
                  active ? 'bg-primary text-primary-foreground' : complete ? 'bg-accent text-primary' : 'text-muted-foreground'
                } ${!reachable ? 'opacity-45' : 'hover:bg-secondary'}`}
              >
                <span className={`flex size-5 items-center justify-center rounded-full text-[9px] ${
                  active ? 'bg-white/20' : complete ? 'bg-primary/10' : 'bg-secondary'
                }`}>
                  {complete ? <Check className="size-3" /> : item.n}
                </span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            )
          })}
        </div>

        <div key={step} className="animate-fade-up mt-4 rounded-[1.6rem] border border-border/70 bg-card p-5 shadow-sm sm:p-8">
          {step === 1 && (
            <section>
              <h2 className="text-2xl">{t('The basics')}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{t('This is what brides see first.')}</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="full-name" className="field-label">{t('Full name')}</Label>
                  <Input id="full-name" value={form.fullName} onChange={(event) => { update({ fullName: event.target.value }); clearError('fullName') }} className="mt-2 h-11 rounded-xl" />
                  {errors.fullName && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.fullName}</p>}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="username" className="field-label">{t('Your link')}</Label>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    <div className="flex min-w-0 flex-1 items-center gap-1 rounded-xl border border-input bg-background px-3">
                      <span className="max-w-[55vw] shrink-0 truncate text-[10px] font-bold text-muted-foreground">{`${window.location.origin}/p/`}</span>
                      <Input
                        id="username"
                        value={form.username}
                        onChange={(event) => { update({ username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 30) }); clearError('username') }}
                        className="h-11 border-0 bg-transparent px-0 text-[13px] font-semibold shadow-none focus-visible:ring-0"
                        aria-invalid={Boolean(errors.username) || nameCheck === 'taken'}
                      />
                      {nameCheck === 'checking' && (
                        <span className="size-3.5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" aria-label={t('Checking')} />
                      )}
                      {nameCheck === 'available' && <Check className="size-4 shrink-0 text-emerald-600" />}
                    </div>
                    <Button type="button" variant="outline" size="sm" className="h-11 shrink-0 rounded-xl text-[11px]" onClick={() => { update({ username: slugify(form.fullName) }); clearError('username') }}>
                      {t('Suggest')}
                    </Button>
                  </div>
                  {errors.username
                    ? <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.username}</p>
                    : nameCheck === 'available'
                      ? <p className="mt-1.5 text-[11px] font-semibold text-emerald-700">{t('This link is available.')}</p>
                      : <p className="mt-1.5 text-[11px] text-muted-foreground">{t('Lowercase letters, numbers and underscores. This becomes your shareable link.')}</p>}
                </div>

                <div>
                  <Label htmlFor="city" className="field-label">{t('City')}</Label>
                  <Input id="city" value={form.city} onChange={(event) => { update({ city: event.target.value }); clearError('city') }} className="mt-2 h-11 rounded-xl" />
                  {errors.city && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="field-label">{t('WhatsApp number')}</Label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
                    <span className="text-[12px] font-bold text-muted-foreground">+91</span>
                    <Input
                      id="whatsapp"
                      inputMode="numeric"
                      value={form.whatsapp}
                      onChange={(event) => { update({ whatsapp: event.target.value.replace(/\D/g, '').slice(0, 10) }); clearError('whatsapp') }}
                      className="h-11 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {errors.whatsapp
                    ? <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.whatsapp}</p>
                    : <p className="mt-1.5 text-[11px] text-muted-foreground">{t('Private — never shown on your public profile.')}</p>}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="email" className="field-label">{t('Display email (optional)')}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(event) => { update({ email: event.target.value }); clearError('email') }} className="mt-2 h-11 rounded-xl" />
                  {errors.email && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.email}</p>}
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 className="text-2xl">{t('About you')}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{t('Let your personality do some of the selling.')}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_200px]">
                <div>
                  <Label htmlFor="bio" className="field-label">{t('Short bio')}</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(event) => { update({ bio: event.target.value.slice(0, 300) }); clearError('bio') }}
                    className="mt-2 min-h-36 rounded-xl text-[13px] leading-relaxed"
                    placeholder={t('Soft glam, luminous skin, and looks that still feel like you…')}
                  />
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    {errors.bio ? <p className="font-semibold text-destructive">{errors.bio}</p> : <p className="text-muted-foreground">{t('Keep it warm and specific.')}</p>}
                    <p className="font-semibold text-muted-foreground">{form.bio.length}/300</p>
                  </div>
                </div>

                <div>
                  <Label className="field-label">{t('Profile photo')}</Label>
                  <label className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center hover:border-primary/40">
                    {form.profilePhoto ? (
                      <img src={form.profilePhoto} alt={t('Profile')} className="size-24 rounded-full object-cover" />
                    ) : (
                      <span className="flex size-12 items-center justify-center rounded-full bg-card text-primary shadow-sm"><ImagePlus className="size-5" /></span>
                    )}
                    <span className="text-[11px] font-bold">{uploading ? t('Compressing…') : form.profilePhoto ? t('Change photo') : t('Upload photo')}</span>
                    <span className="text-[9px] text-muted-foreground">{t('JPG, PNG or WEBP')}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => handleProfilePhoto(event.target.files?.[0])} />
                  </label>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl">{t('Your services')}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{t('Brides pick from this list on the form.')}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('{count}/15 services', { count: form.services.length })}</span>
              </div>

              <div className="mt-5 space-y-3">
                {form.services.map((service, index) => (
                  <div key={service.id} className="rounded-xl border border-border/70 bg-secondary/20 p-3.5">
                    <div className="flex items-start gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-[10px] font-bold text-muted-foreground">{index + 1}</span>
                      <Input
                        value={service.name}
                        onChange={(event) => { updateService(service.id, { name: event.target.value }); clearError(`service-name-${index}`) }}
                        placeholder={t('Service name, e.g. Signature Bridal')}
                        className="h-9 rounded-lg bg-card text-[12px] font-semibold"
                      />
                      <div className="flex shrink-0 items-center gap-1">
                        <button type="button" onClick={() => moveService(index, -1)} disabled={index === 0} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-card disabled:opacity-30" aria-label={t('Move service up')}><ArrowUp className="size-3.5" /></button>
                        <button type="button" onClick={() => moveService(index, 1)} disabled={index === form.services.length - 1} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-card disabled:opacity-30" aria-label={t('Move service down')}><ArrowDown className="size-3.5" /></button>
                        <button type="button" onClick={() => update({ services: form.services.filter((item) => item.id !== service.id) })} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-card hover:text-destructive" aria-label={t('Remove service')}><Trash2 className="size-3.5" /></button>
                      </div>
                    </div>
                    {errors[`service-name-${index}`] && <p className="mt-1 pl-8 text-[10px] font-semibold text-destructive">{errors[`service-name-${index}`]}</p>}

                    <Input
                      value={service.description}
                      onChange={(event) => updateService(service.id, { description: event.target.value.slice(0, 100) })}
                      placeholder={t('Short description (max 100 characters)')}
                      className="mt-2 h-9 rounded-lg bg-card text-[11px]"
                    />

                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                      <Select value={service.priceType} onValueChange={(value) => updateService(service.id, { priceType: value as Service['priceType'] })}>
                        <SelectTrigger className="h-9 rounded-lg bg-card text-[11px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed" className="text-[11px]">{t('Fixed price')}</SelectItem>
                          <SelectItem value="starting_from" className="text-[11px]">{t('Starting from')}</SelectItem>
                          <SelectItem value="custom_quote" className="text-[11px]">{t('Custom quote')}</SelectItem>
                        </SelectContent>
                      </Select>

                      {service.priceType === 'custom_quote' ? (
                        <div className="flex h-9 items-center rounded-lg border border-dashed border-border px-3 text-[11px] text-muted-foreground">{t('Quote on request')}</div>
                      ) : (
                        <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2">
                          <span className="text-[11px] font-bold text-muted-foreground">₹</span>
                          <Input
                            inputMode="numeric"
                            value={service.price ?? ''}
                            onChange={(event) => { updateService(service.id, { price: Number(event.target.value.replace(/\D/g, '')) || null }); clearError(`service-price-${index}`) }}
                            placeholder="25000"
                            className="h-9 border-0 bg-transparent px-0 text-[11px] shadow-none focus-visible:ring-0"
                          />
                        </div>
                      )}

                      <label className="col-span-2 flex items-center justify-end gap-2 text-[10px] font-bold text-muted-foreground sm:col-span-1">
                        <Switch checked={service.visible} onCheckedChange={(checked) => updateService(service.id, { visible: checked })} />
                        {t('Visible')}
                      </label>
                    </div>
                    {errors[`service-price-${index}`] && <p className="mt-1 text-[10px] font-semibold text-destructive">{errors[`service-price-${index}`]}</p>}
                  </div>
                ))}
              </div>

              {errors.services && <p className="mt-2 text-[11px] font-semibold text-destructive">{errors.services}</p>}

              <Button type="button" variant="outline" onClick={addService} disabled={form.services.length >= 15} className="mt-4 h-10 rounded-full text-[11px]">
                <Plus className="size-3.5" /> {t('Add service')}
              </Button>
            </section>
          )}

          {step === 4 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl">{t('Your portfolio')}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{t('The first photo becomes your cover. Add tags so brides can filter.')}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{t('{count}/20 photos', { count: form.portfolio.length })}</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {form.portfolio.map((item, index) => (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-border/70 bg-card">
                    <div className="relative aspect-[4/5]">
                      <img src={item.url} alt={t('Portfolio photo {count}', { count: index + 1 })} className="size-full object-cover" />
                      {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">{t('Cover')}</span>}
                      <button
                        type="button"
                        onClick={() => update({ portfolio: form.portfolio.filter((photo) => photo.id !== item.id) })}
                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"
                        aria-label={t('Remove photo')}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                    <div className="p-2">
                      <Select value={item.tag} onValueChange={(value) => update({ portfolio: form.portfolio.map((photo) => photo.id === item.id ? { ...photo, tag: value } : photo) })}>
                        <SelectTrigger className="h-7 w-full rounded-md px-2 text-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {portfolioTags.map((tag) => <SelectItem key={tag} value={tag} className="text-[11px]">{t(tag)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <div className="mt-1.5 flex items-center justify-between">
                        <div className="flex gap-1">
                          <button type="button" onClick={() => movePortfolio(index, -1)} disabled={index === 0} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary disabled:opacity-30" aria-label={t('Move photo earlier')}><ArrowUp className="size-3" /></button>
                          <button type="button" onClick={() => movePortfolio(index, 1)} disabled={index === form.portfolio.length - 1} className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary disabled:opacity-30" aria-label={t('Move photo later')}><ArrowDown className="size-3" /></button>
                        </div>
                        <span className="text-[9px] font-semibold text-muted-foreground">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {form.portfolio.length < 20 && (
                  <label className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 p-3 text-center hover:border-primary/40">
                    <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                      {uploading ? <Upload className="size-4 animate-pulse" /> : <ImagePlus className="size-4" />}
                    </span>
                    <span className="text-[10px] font-bold">{uploading ? t('Compressing…') : t('Add photos')}</span>
                    <span className="text-[9px] text-muted-foreground">{t('Up to 20 total')}</span>
                    <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => handlePortfolio(event.target.files)} />
                  </label>
                )}
              </div>
            </section>
          )}

          {step === 5 && (
            <section>
              <h2 className="text-2xl">{t('How you work')}</h2>
              <p className="mt-1 text-[13px] text-muted-foreground">{t('Used to check fit and warn brides about dates.')}</p>

              <div className="mt-6 space-y-6">
                <div>
                  <Label className="field-label">{t('Cities / areas served')}</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.serviceCities.map((city) => (
                      <span key={city} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold">
                        {city}
                        <button type="button" onClick={() => update({ serviceCities: form.serviceCities.filter((item) => item !== city) })} className="text-muted-foreground hover:text-destructive" aria-label={t('Remove {name}', { name: city })}><Trash2 className="size-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={cityInput}
                      onChange={(event) => setCityInput(event.target.value)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addCity() } }}
                      placeholder={t('Add a city or area')}
                      className="h-10 max-w-xs rounded-xl text-[12px]"
                    />
                    <Button type="button" variant="outline" className="h-10 rounded-xl px-4 text-[11px]" onClick={addCity}><Plus className="size-3.5" /> {t('Add')}</Button>
                  </div>
                  {errors.serviceCities && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.serviceCities}</p>}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
                  <div>
                    <p className="flex items-center gap-1.5 text-[12px] font-bold"><MapPin className="size-3.5 text-primary" /> {t('Travel available')}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{t('Willing to travel outside your city for bookings.')}</p>
                  </div>
                  <Switch checked={form.travelAvailable} onCheckedChange={(checked) => update({ travelAvailable: checked })} />
                </div>

                <div>
                  <Label className="field-label">{t('Working days')}</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {weekDays.map((day) => {
                      const selected = form.workingDays.includes(day)
                      return (
                        <button
                          key={day}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => toggleArrayValue('workingDays', day)}
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${selected ? 'border-primary bg-accent text-primary' : 'border-border bg-card text-muted-foreground'}`}
                        >
                          {t(day)}
                        </button>
                      )
                    })}
                  </div>
                  {errors.workingDays && <p className="mt-1.5 text-[11px] font-semibold text-destructive">{errors.workingDays}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="working-from" className="field-label">{t('Working from')}</Label>
                    <Input id="working-from" type="time" value={form.workingFrom} onChange={(event) => { update({ workingFrom: event.target.value }); clearError('hours') }} className="mt-2 h-10 rounded-xl text-[12px]" />
                  </div>
                  <div>
                    <Label htmlFor="working-to" className="field-label">{t('Working until')}</Label>
                    <Input id="working-to" type="time" value={form.workingTo} onChange={(event) => { update({ workingTo: event.target.value }); clearError('hours') }} className="mt-2 h-10 rounded-xl text-[12px]" />
                  </div>
                </div>
                {errors.hours && <p className="text-[11px] font-semibold text-destructive">{errors.hours}</p>}

                <div>
                  <Label className="field-label">{t('Languages spoken')}</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {languageOptions.map((language) => {
                      const selected = form.languages.includes(language)
                      return (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleArrayValue('languages', language)}
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold ${selected ? 'border-primary bg-accent text-primary' : 'border-border bg-card text-muted-foreground'}`}
                        >
                          {t(language)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 6 && (
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl">{t('Your profile, ready')}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{t('This is what brides will see when they open your link.')}</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-primary">{profileUrl(form.username || 'yourname')}</span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border/70">
                <div className="relative h-36">
                  <img src={form.portfolio[0]?.url || '/images/hero.jpg'} alt={t('Cover')} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="font-display text-2xl text-white">{form.fullName || t('Your name')}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                      {form.city || t('Your city')} · {form.languages.map((language) => t(language)).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="bg-card p-4">
                  <p className="line-clamp-3 text-[12px] leading-relaxed text-muted-foreground">{form.bio || t('Your bio will appear here.')}</p>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {form.portfolio.slice(0, 3).map((photo) => (
                      <img key={photo.id} src={photo.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {form.services.filter((service) => service.visible).slice(0, 4).map((service) => (
                      <span key={service.id} className="rounded-full border border-border bg-secondary/50 px-2 py-1 text-[9px] font-semibold">
                        {service.name || t('Service')} · {service.priceType === 'custom_quote' ? t('Quote') : inr(service.price)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-[10px] text-muted-foreground">
                    <span>{form.workingDays.map((day) => t(day)).join(' · ') || t('Working days')}</span>
                    <span>{formatTime(form.workingFrom)} – {formatTime(form.workingTo)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-primary/10 bg-accent/40 px-3.5 py-3 text-[11px] leading-relaxed text-foreground/70">
                <Wand2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {t('Once published, brides can send requests and you will see each one with a short summary and a WhatsApp opener. You can edit everything later.')}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Button className="h-11 flex-1 rounded-full text-[12px]" onClick={publish} disabled={saving}>
                  <Sparkles className="size-4" /> {saving ? t('Publishing…') : t('Publish my profile')}
                </Button>
                <Button variant="outline" className="h-11 rounded-full text-[12px]" onClick={() => copyLink(form.username)}>
                  <Copy className="size-3.5" /> {t('Copy link')}
                </Button>
              </div>
            </section>
          )}

          <div className="mt-7 flex items-center gap-3 border-t border-border/60 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => void goBack()}
              disabled={step === 1 || saving}
              className="h-11 rounded-full px-4 text-[12px]"
            >
              <ArrowLeft className="size-4" /> {t('Back')}
            </Button>
            <div className="flex-1" />
            {step < 6 ? (
              <Button type="button" onClick={goNext} className="h-11 min-w-[9.5rem] rounded-full px-6 text-[12px]" disabled={saving}>
                {t('Continue')} <ArrowRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {hasBackend
            ? form.published && !form.paused
              ? t('Your profile is live — changes appear as soon as you save.')
              : form.published
                ? t('Your profile is paused — saved changes will appear when you make it live.')
                : t('Saved to your account · nothing is public until you publish')
            : t('Preview mode · this profile saves in your browser')}
        </p>
      </main>
    </div>
  )
}
