import { Link, useNavigate } from 'react-router'
import { ArrowUpRight, Check, Copy, Globe2, LogOut, Pencil, ShieldCheck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'
import { hasBackend } from '../lib/supabase'
import Logo from '../components/Logo'
import LanguageToggle from '../components/LanguageToggle'
import UserMenu from '../components/UserMenu'
import { FullPageLoader } from '../components/RequireAuth'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { initials, profilePath, profileUrl } from '../lib/site'

export default function Settings() {
  const { user, signOut, configured } = useAuth()
  const { profile, loading, saveProfile } = useStore()
  const { lang, setLang, t } = useI18n()
  const navigate = useNavigate()

  usePageMeta({ title: t('Account & privacy') + ' · MUALink', noindex: true })

  if (loading) return <FullPageLoader label={t('Opening your account…')} />

  const name = profile?.fullName || (user?.user_metadata?.full_name as string | undefined) || user?.email || t('Artist')
  const avatar = profile?.profilePhoto || (user?.user_metadata?.avatar_url as string | undefined)
  const link = profile?.username ? profileUrl(profile.username) : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast.success(t('Profile link copied'))
    } catch {
      toast.error(t('Could not copy the link'))
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const togglePaused = async (paused: boolean) => {
    if (!profile) return
    try {
      await saveProfile({ ...profile, paused })
      toast.success(paused ? t('Your profile is paused') : t('Your profile is live'))
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : t('Could not update profile visibility'))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              {t('Account')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Button asChild variant="ghost" size="sm" className="rounded-full text-[11px]">
              <Link to="/dashboard">{t('Back to dashboard')}</Link>
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="page-shell max-w-3xl py-8 sm:py-12">
        <p className="eyebrow">{t('Settings')}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{t('Account & privacy')}</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          {t('Control how you sign in, what is public, and the language you use across MUALink.')}
        </p>

        <section className="mt-7 rounded-[1.4rem] border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-primary font-display text-base text-primary-foreground">
                {avatar ? <img src={avatar} alt="" className="size-full object-cover" /> : initials(name)}
              </span>
              <div>
                <p className="text-[15px] font-bold leading-tight">{name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{user?.email || t('Preview mode — no account connected')}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[10px] font-bold text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              {configured ? t('Signed in with Google') : t('Preview mode')}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button asChild variant="outline" size="sm" className="h-9 rounded-full text-[11px]">
              <Link to="/onboarding">
                <Pencil className="size-3.5" /> {t('Edit my profile')}
              </Link>
            </Button>
            {profile?.published && (
              <Button asChild variant="outline" size="sm" className="h-9 rounded-full text-[11px]">
                <Link to={profilePath(profile.username)}>
                  <UserRound className="size-3.5" /> {t('View public profile')}
                </Link>
              </Button>
            )}
            {configured && (
              <Button variant="ghost" size="sm" className="h-9 rounded-full text-[11px] text-destructive hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="size-3.5" /> {t('Sign out')}
              </Button>
            )}
          </div>
        </section>

        {profile?.username && (
          <section className="mt-4 rounded-[1.4rem] border border-border/70 bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg">{t('Your public link')}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {profile.published
                    ? profile.paused
                      ? t('Your profile is paused — saved changes will appear when you make it live.')
                      : t('This profile is live and can be shared.')
                    : t('This profile is private until you publish it.')}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${
                profile.published && !profile.paused ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {profile.published ? profile.paused ? t('Paused') : t('Live') : t('Draft')}
              </span>
            </div>
            {profile.published && (
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <div>
                  <p className="text-[12px] font-bold">{t('Profile visibility')}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{profile.paused ? t('Paused') : t('Live')}</p>
                </div>
                <Switch
                  checked={!profile.paused}
                  onCheckedChange={(live) => void togglePaused(!live)}
                  aria-label={t('Profile visibility')}
                />
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-secondary/50 p-1.5 pl-3">
              <p className="min-w-0 flex-1 truncate text-[11px] font-semibold">{link}</p>
              <Button size="sm" className="h-8 rounded-full text-[10px]" onClick={copyLink}>
                <Copy className="size-3" /> {t('Copy')}
              </Button>
            </div>
          </section>
        )}

        <section className="mt-4 rounded-[1.4rem] border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-primary" />
            <h2 className="text-lg">{t('Language')}</h2>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            {t('Choose the language for buttons, forms and guidance. Your profile text stays exactly as you wrote it.')}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { key: 'en' as const, label: 'English', hint: t('Default') },
              { key: 'hinglish' as const, label: 'Hinglish', hint: t('Hindi in English letters') },
            ].map((option) => {
              const active = lang === option.key
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setLang(option.key)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    active ? 'border-primary bg-accent' : 'border-border bg-background hover:border-primary/30'
                  }`}
                >
                  <span>
                    <span className="block text-[13px] font-bold">{option.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{option.hint}</span>
                  </span>
                  <span className={`flex size-5 items-center justify-center rounded-full border ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                    {active && <Check className="size-3" />}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 rounded-[1.4rem] border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h2 className="text-lg">{t('Your privacy')}</h2>
          </div>
          <ul className="mt-3 space-y-2.5 text-[12px] leading-relaxed text-foreground/80">
            {[
              t('Your WhatsApp number is never shown on your public profile.'),
              t('Brides send enquiries without creating an account. Their details are visible only to you.'),
              t('Your photos are stored in your own folder and can be replaced or removed at any time.'),
              t('We do not sell your data, and there is no commission on your bookings.'),
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button asChild variant="outline" size="sm" className="h-9 rounded-full text-[11px]">
              <Link to="/privacy">{t('Read the Privacy Policy')} <ArrowUpRight className="size-3" /></Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="h-9 rounded-full text-[11px]">
              <a href="mailto:hello@mualink.in">{t('Ask us to delete my data')}</a>
            </Button>
          </div>
        </section>

        {!hasBackend && (
          <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-relaxed text-amber-900">
            {t('Preview mode: accounts and Google sign-in are disabled until Supabase keys are configured. Your profile and requests are saved in this browser only.')}
          </p>
        )}

        <p className="mt-8 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t('MUALink · made for artists in India')}
        </p>
      </main>
    </div>
  )
}
