import { Link } from 'react-router'
import Logo from './Logo'
import { useI18n } from '../i18n'

export default function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-border/70 bg-[hsl(24_30%_95%)]">
      <div className="page-shell grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-[1.6fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t('A calmer way for Indian makeup artists to receive and book enquiries.')}
          </p>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">
            {t('Delhi NCR · Made in India')}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('Product')}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link to="/signin" className="link-underline text-foreground/80">{t('Create a profile')}</Link></li>
            <li><Link to="/p/priyanka" className="link-underline text-foreground/80">{t('Sample profile')}</Link></li>
            <li><Link to="/p/priyanka/request" className="link-underline text-foreground/80">{t('Bride request form')}</Link></li>
            <li><Link to="/dashboard" className="link-underline text-foreground/80">{t('MUA dashboard')}</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{t('Support')}</p>
          <ul className="mt-4 space-y-3 text-sm text-foreground/80">
            <li><a href="mailto:hello@mualink.in" className="link-underline">hello@mualink.in</a></li>
            <li><Link to="/privacy" className="link-underline">{t('Privacy Policy')}</Link></li>
            <li><Link to="/terms" className="link-underline">{t('Terms of Use')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="page-shell flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MUALink. {t('Made for the artists who make weddings feel cinematic.')}</p>
          <p>{t('Free in V1 · No commission · Your number stays private')}</p>
        </div>
      </div>
    </footer>
  )
}
