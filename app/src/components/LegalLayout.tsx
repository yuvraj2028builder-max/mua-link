import type { ReactNode } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import { useI18n } from '../i18n'
import { usePageMeta } from '../lib/seo'

export default function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string
  title: string
  updated: string
  children: ReactNode
}) {
  const { lang, t } = useI18n()
  usePageMeta({ title: `${title} · MUALink` })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="page-shell max-w-3xl py-12 sm:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {t('Last updated {date}', { date: updated })}
        </p>

        {lang === 'hinglish' && (
          <p className="mt-5 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
            {t('Legal text is kept in English for accuracy. The rest of the app and all forms work in Hinglish.')}
          </p>
        )}

        <div className="mt-8 space-y-7 text-[13px] leading-relaxed text-foreground/80 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-foreground [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
