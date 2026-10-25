import { Languages } from 'lucide-react'
import { useI18n } from '../i18n'

export default function LanguageToggle({
  tone = 'default',
  className = '',
}: {
  tone?: 'default' | 'light'
  className?: string
}) {
  const { lang, toggle, t } = useI18n()
  const label = lang === 'en' ? 'Hinglish' : 'English'
  const aria = lang === 'en' ? t('Switch to Hinglish') : t('Switch to English')

  const styles = tone === 'light'
    ? 'border-white/25 bg-black/25 text-white hover:bg-black/40'
    : 'border-border/80 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={aria}
      title={aria}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[10px] font-bold uppercase tracking-[0.1em] backdrop-blur transition-colors ${styles} ${className}`}
    >
      <Languages className="size-3.5" />
      {label}
    </button>
  )
}
