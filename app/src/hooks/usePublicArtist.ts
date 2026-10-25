import { useEffect, useState } from 'react'
import { demoProfile } from '../data'
import { fetchPublicArtist } from '../lib/api'
import { hasBackend } from '../lib/supabase'
import { useOptionalStore } from '../store'
import type { MuaProfile } from '../types'

interface PublicArtistState {
  artist: MuaProfile | null
  unavailableDates: string[]
  loading: boolean
  error: string | null
}

const EMPTY: PublicArtistState = {
  artist: null,
  unavailableDates: [],
  loading: false,
  error: null,
}

export function usePublicArtist(username: string | undefined): PublicArtistState {
  const store = useOptionalStore()
  const [remote, setRemote] = useState<{ username: string; state: PublicArtistState } | null>(null)

  useEffect(() => {
    if (!hasBackend || !username) return
    let active = true

    fetchPublicArtist(username)
      .then(({ artist, unavailableDates }) => {
        if (active) setRemote({ username, state: { artist, unavailableDates, loading: false, error: null } })
      })
      .catch((error: unknown) => {
        if (!active) return
        setRemote({
          username,
          state: {
            artist: null,
            unavailableDates: [],
            loading: false,
            error: error instanceof Error ? error.message : 'Could not load this profile.',
          },
        })
      })

    return () => { active = false }
  }, [username])

  if (!hasBackend) {
    const local = store?.profile && store.profile.username === username
      ? store.profile
      : username === demoProfile.username
        ? demoProfile
        : null
    return {
      artist: local,
      unavailableDates: local && store?.profile?.username === username ? store?.unavailableDates ?? [] : [],
      loading: false,
      error: null,
    }
  }

  if (!username) return EMPTY
  if (!remote || remote.username !== username) return { ...EMPTY, loading: true }
  return remote.state
}
