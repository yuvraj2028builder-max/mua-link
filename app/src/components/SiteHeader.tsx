import { Link } from 'react-router'
import { ArrowUpRight, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import LanguageToggle from './LanguageToggle'
import UserMenu from './UserMenu'
import { Button } from '@/components/ui/button'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { profilePath } from '../lib/site'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { configured, user } = useAuth()
  const { profile } = useStore()
  const { t } = useI18n()

  const navItems = [
    { label: t('How it works'), href: '#how-it-works' },
    { label: t('Your page'), href: '#profile' },
    { label: t('Pricing'), href: '#pricing' },
  ]

  const createPath = configured ? (user ? '/onboarding' : '/signin') : '/onboarding'

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.href.startsWith('#') ? (
              <a key={item.label} href={item.href} className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.href} className="whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle className="hidden sm:inline-flex" />

          <Link
            to={profilePath('priyanka')}
            className="hidden items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
          >
            {t('For brides')}
            <ArrowUpRight className="size-3.5" />
          </Link>

          {configured && user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden rounded-full lg:inline-flex">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  {t('Dashboard')}
                </Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              {configured && (
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/signin">{t('Sign in')}</Link>
                </Button>
              )}
              <Button asChild size="sm" className="rounded-full pl-4 pr-3">
                <Link to={createPath}>
                  {t('Create my profile')}
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}

          <Button asChild size="sm" className="rounded-full pl-3.5 pr-2.5 lg:hidden">
            <Link to={user ? '/dashboard' : createPath}>
              {user ? t('Dashboard') : t('Create link')}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
            aria-label={open ? t('Close menu') : t('Open menu')}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background px-5 pb-5 pt-2 lg:hidden">
          <nav className="flex flex-col">
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="border-b border-border/50 py-3 text-sm font-medium">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.href} onClick={() => setOpen(false)} className="border-b border-border/50 py-3 text-sm font-medium">
                  {item.label}
                </Link>
              ),
            )}
            <Link to={profilePath('priyanka')} onClick={() => setOpen(false)} className="border-b border-border/50 py-3 text-sm font-medium">
              {t('For brides')}
            </Link>
            {configured && user && profile && (
              <Link to={profilePath(profile.username)} onClick={() => setOpen(false)} className="border-b border-border/50 py-3 text-sm font-medium">
                {t('My public profile')}
              </Link>
            )}
            {configured && !user && (
              <Link to="/signin" onClick={() => setOpen(false)} className="border-b border-border/50 py-3 text-sm font-medium">
                {t('Sign in')}
              </Link>
            )}
          </nav>

          <div className="mt-4 flex items-center justify-between gap-2">
            <LanguageToggle />
            <Button asChild className="rounded-full">
              <Link to={createPath} onClick={() => setOpen(false)}>
                {user ? t('Edit my profile') : t('Create my free profile')}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
