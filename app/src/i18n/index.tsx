import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { hinglish } from './hinglish'

export type Language = 'en' | 'hinglish'

const STORAGE_KEY = 'mualink-language'

interface I18nValue {
  lang: Language
  setLang: (lang: Language) => void
  toggle: () => void
  t: (english: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function storedLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'hinglish' ? 'hinglish' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(storedLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // private mode — the toggle still works for this session
    }
    document.documentElement.lang = lang === 'hinglish' ? 'hi-Latn' : 'en'
  }, [lang])

  const t = useCallback((english: string, vars?: Record<string, string | number>) => {
    let value = lang === 'hinglish' ? hinglish[english] ?? english : english
    if (vars) {
      for (const [key, replacement] of Object.entries(vars)) {
        value = value.split(`{${key}}`).join(String(replacement))
      }
    }
    return value
  }, [lang])

  const value = useMemo<I18nValue>(() => ({
    lang,
    setLang,
    toggle: () => setLang((current) => (current === 'en' ? 'hinglish' : 'en')),
    t,
  }), [lang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within LanguageProvider')
  return value
}
