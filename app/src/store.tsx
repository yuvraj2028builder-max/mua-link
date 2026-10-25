import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { EnquiryDraft, Lead, LeadStatus, MuaProfile } from './types'
import { demoProfile, initialLeads } from './data'
import { buildLeadReview } from './lib/review'
import {
  fetchEnquiries,
  fetchMyArtist,
  fetchUnavailableDates,
  markEnquiryRead,
  saveArtist,
  setDateAvailability,
  setEnquiryStatus,
} from './lib/api'
import { hasBackend, supabase } from './lib/supabase'
import { useAuth } from './auth/AuthProvider'
import { useI18n } from './i18n'

interface StoreValue {
  profile: MuaProfile | null
  leads: Lead[]
  unavailableDates: string[]
  loading: boolean
  error: string | null
  demo: boolean
  saveProfile: (profile: MuaProfile) => Promise<MuaProfile>
  addLead: (draft: EnquiryDraft) => Lead
  setLeadStatus: (id: string, status: LeadStatus) => Promise<void>
  markLeadRead: (id: string) => Promise<void>
  toggleUnavailableDate: (date: string) => Promise<void>
  refresh: () => Promise<void>
}

const StoreContext = createContext<StoreValue | null>(null)

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<MuaProfile>(() => ({
    ...demoProfile,
    ...readStored<Partial<MuaProfile>>('mualink-profile', {}),
  }))
  const [leads, setLeads] = useState<Lead[]>(() => readStored('mualink-leads', initialLeads))
  const [unavailableDates, setUnavailableDates] = useState<string[]>(() => readStored('mualink-unavailable', []))

  useEffect(() => { localStorage.setItem('mualink-leads', JSON.stringify(leads)) }, [leads])
  useEffect(() => { localStorage.setItem('mualink-unavailable', JSON.stringify(unavailableDates)) }, [unavailableDates])

  const value = useMemo<StoreValue>(() => ({
    profile,
    leads,
    unavailableDates,
    loading: false,
    error: null,
    demo: true,
    async saveProfile(next) {
      const saved = { ...next, id: next.id || profile.id, isDemo: true }
      setProfile(saved)
      localStorage.setItem('mualink-profile', JSON.stringify(saved))
      return saved
    },
    addLead(draft) {
      const review = buildLeadReview(draft, profile, unavailableDates)
      const lead: Lead = {
        id: `lead-${Date.now()}`,
        brideName: draft.brideName,
        brideWhatsapp: draft.brideWhatsapp,
        occasion: draft.occasion,
        services: draft.services,
        familyCount: draft.familyCount,
        eventDate: draft.eventDate,
        readyBy: draft.readyBy,
        venue: draft.venue,
        budget: draft.budget || 'Not shared',
        notes: draft.notes,
        inspirationPhoto: draft.inspirationPhoto,
        status: 'new',
        unread: true,
        createdAt: new Date().toISOString(),
        ...review,
      }
      setLeads((current) => [lead, ...current])
      return lead
    },
    async setLeadStatus(id, status) {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, unread: false } : lead))
    },
    async markLeadRead(id) {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, unread: false } : lead))
    },
    async toggleUnavailableDate(date) {
      setUnavailableDates((current) =>
        current.includes(date) ? current.filter((item) => item !== date) : [...current, date].sort(),
      )
    },
    async refresh() {
      // Demo data is local; nothing to refetch.
    },
  }), [leads, profile, unavailableDates])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

function RemoteStoreProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { t } = useI18n()
  const [profile, setProfile] = useState<MuaProfile | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [unavailableDates, setUnavailableDates] = useState<string[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const loadedUserId = useRef<string | null>(null)

  useEffect(() => {
    const userId = user?.id
    if (!userId) {
      setProfile(null)
      setLeads([])
      setUnavailableDates([])
      setError(null)
      setDataLoading(false)
      loadedUserId.current = null
      return
    }

    let active = true
    if (loadedUserId.current !== userId) setDataLoading(true)
    setError(null)

    ;(async () => {
      try {
        const artist = await fetchMyArtist(userId)
        if (!active) return
        setProfile(artist)
        if (!artist) {
          setLeads([])
          setUnavailableDates([])
          return
        }
        const [artistLeads, dates] = await Promise.all([
          fetchEnquiries(artist.id),
          fetchUnavailableDates(artist.id),
        ])
        if (!active) return
        setLeads(artistLeads)
        setUnavailableDates(dates)
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load your studio.')
      } finally {
        if (active) {
          setDataLoading(false)
          loadedUserId.current = userId
        }
      }
    })()

    return () => { active = false }
  }, [reloadToken, user?.id])

  useEffect(() => {
    const userId = user?.id
    if (!userId || !profile?.id) return

    const refetch = () => setReloadToken((token) => token + 1)
    const channel = supabase?.channel(`artist-enquiries-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'enquiries',
          filter: `artist_id=eq.${profile.id}`,
        },
        refetch,
      )
      .subscribe()

    const poll = window.setInterval(refetch, 30_000)
    const onFocus = () => {
      if (document.visibilityState === 'visible') refetch()
    }
    window.addEventListener('focus', onFocus)

    return () => {
      window.clearInterval(poll)
      window.removeEventListener('focus', onFocus)
      if (channel) void supabase?.removeChannel(channel)
    }
  }, [profile?.id, user?.id])

  const refresh = useCallback(async () => {
    setReloadToken((token) => token + 1)
  }, [])

  const value = useMemo<StoreValue>(() => ({
    profile,
    leads,
    unavailableDates,
    loading: authLoading || dataLoading,
    error,
    demo: false,
    async saveProfile(next) {
      if (!user) throw new Error(t('Your session has expired. Please sign in again.'))
      const saved = await saveArtist({ ...next, id: next.id || user.id }, user.id)
      setProfile(saved)
      return saved
    },
    addLead() {
      throw new Error('Enquiries are submitted from the public booking page.')
    },
    async setLeadStatus(id, status) {
      const previous = leads
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status, unread: false } : lead))
      try {
        await setEnquiryStatus(id, status)
      } catch (updateError) {
        setLeads(previous)
        toast.error(updateError instanceof Error ? updateError.message : t('Could not update this request.'))
      }
    },
    async markLeadRead(id) {
      setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, unread: false } : lead))
      try {
        await markEnquiryRead(id)
      } catch {
        // A read receipt failing should never interrupt the artist.
      }
    },
    async toggleUnavailableDate(date) {
      if (!profile) return
      const wasBlocked = unavailableDates.includes(date)
      setUnavailableDates((current) =>
        wasBlocked ? current.filter((item) => item !== date) : [...current, date].sort(),
      )
      try {
        await setDateAvailability(profile.id, date, !wasBlocked)
      } catch (updateError) {
        setUnavailableDates((current) =>
          wasBlocked ? [...current, date].sort() : current.filter((item) => item !== date),
        )
        toast.error(updateError instanceof Error ? updateError.message : t('Could not update that date.'))
      }
    },
    refresh,
  }), [authLoading, dataLoading, error, leads, profile, refresh, t, unavailableDates, user])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return hasBackend
    ? <RemoteStoreProvider>{children}</RemoteStoreProvider>
    : <DemoStoreProvider>{children}</DemoStoreProvider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used within StoreProvider')
  return store
}

export function useOptionalStore() {
  return useContext(StoreContext)
}
