import { Link, useNavigate } from 'react-router'
import { ArrowUpRight, LayoutDashboard, LogOut, Pencil, UserRound } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { useStore } from '../store'
import { useI18n } from '../i18n'
import { initials } from '../lib/site'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UserMenu() {
  const { user, signOut, configured } = useAuth()
  const { profile } = useStore()
  const { t } = useI18n()
  const navigate = useNavigate()

  if (!configured) return null

  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link to="/signin">{t('Sign in')}</Link>
      </Button>
    )
  }

  const name = profile?.fullName || (user.user_metadata?.full_name as string | undefined) || user.email || 'Artist'
  const avatar = profile?.profilePhoto || (user.user_metadata?.avatar_url as string | undefined)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-primary font-display text-sm text-primary-foreground outline-none ring-primary/30 transition-shadow focus-visible:ring-2"
          aria-label={t('Account menu')}
        >
          {avatar
            ? <img src={avatar} alt="" className="size-full object-cover" />
            : initials(name)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-[13px] font-bold">{name}</p>
          <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer text-[12px] font-semibold">
            <LayoutDashboard className="size-4" /> {t('Dashboard')}
          </Link>
        </DropdownMenuItem>
        {profile && (
          <DropdownMenuItem asChild>
            <Link to={`/p/${profile.username}`} className="cursor-pointer text-[12px] font-semibold">
              <UserRound className="size-4" /> {t('View public profile')}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link to="/onboarding" className="cursor-pointer text-[12px] font-semibold">
            <Pencil className="size-4" /> {t('Edit profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer text-[12px] font-semibold">
            <ArrowUpRight className="size-4" /> {t('Account & privacy')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-[12px] font-semibold text-destructive focus:text-destructive"
          onClick={async () => {
            await signOut()
            navigate('/')
          }}
        >
          <LogOut className="size-4" /> {t('Sign out')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
