import type { EnquiryDraft, Lead, LeadStatus, MuaProfile } from '../types'
import type { LeadReview } from './review'
import { requireSupabase } from './supabase'

export class AppError extends Error {}

function message(error: { message?: string } | null | undefined, fallback: string) {
  const raw = error?.message?.trim()
  if (!raw) return fallback
  if (raw.includes('duplicate key') && raw.includes('artists_username')) {
    return 'That profile link is already taken. Try another username.'
  }
  if (raw.includes('This profile is not accepting requests')) {
    return 'This artist is not accepting requests right now.'
  }
  if (raw.includes('Too many requests')) return raw
  return raw
}

interface ArtistRow {
  id: string
  owner_id?: string | null
  username: string
  full_name: string
  city: string
  whatsapp?: string
  email?: string | null
  bio: string
  profile_photo: string
  services: MuaProfile['services']
  portfolio: MuaProfile['portfolio']
  service_cities: string[]
  travel_available: boolean
  working_days: string[]
  working_from: string
  working_to: string
  languages: string[]
  published: boolean
  paused: boolean
  is_demo: boolean
}

interface EnquiryRow {
  id: string
  bride_name: string
  bride_whatsapp: string
  occasion: string
  services: string[]
  family_count: number
  event_date: string | null
  ready_by: string | null
  venue: string
  budget: string
  notes: string
  inspiration_photo: string | null
  status: LeadStatus
  unread: boolean
  created_at: string
  summary: string
  fit_label: Lead['fitLabel']
  fit_reason: string
  whatsapp_opener: string
}

export function rowToProfile(row: ArtistRow): MuaProfile {
  return {
    id: row.id,
    published: row.published,
    paused: row.paused,
    isDemo: row.is_demo,
    fullName: row.full_name,
    username: row.username,
    city: row.city,
    whatsapp: row.whatsapp || '',
    email: row.email || '',
    bio: row.bio,
    profilePhoto: row.profile_photo,
    services: Array.isArray(row.services) ? row.services : [],
    portfolio: Array.isArray(row.portfolio) ? row.portfolio : [],
    serviceCities: Array.isArray(row.service_cities) ? row.service_cities : [],
    travelAvailable: row.travel_available,
    workingDays: Array.isArray(row.working_days) ? row.working_days : [],
    workingFrom: row.working_from,
    workingTo: row.working_to,
    languages: Array.isArray(row.languages) ? row.languages : [],
  }
}

function profileToRow(profile: MuaProfile, userId: string) {
  return {
    id: profile.id,
    owner_id: userId,
    username: profile.username.toLowerCase(),
    full_name: profile.fullName,
    city: profile.city,
    whatsapp: profile.whatsapp,
    email: profile.email || null,
    bio: profile.bio,
    profile_photo: profile.profilePhoto,
    services: profile.services,
    portfolio: profile.portfolio,
    service_cities: profile.serviceCities,
    travel_available: profile.travelAvailable,
    working_days: profile.workingDays,
    working_from: profile.workingFrom,
    working_to: profile.workingTo,
    languages: profile.languages,
    published: profile.published,
    paused: profile.paused,
  }
}

export function rowToLead(row: EnquiryRow): Lead {
  return {
    id: row.id,
    brideName: row.bride_name,
    brideWhatsapp: row.bride_whatsapp,
    occasion: row.occasion,
    services: Array.isArray(row.services) ? row.services : [],
    familyCount: row.family_count,
    eventDate: row.event_date || '',
    readyBy: row.ready_by || '',
    venue: row.venue,
    budget: row.budget,
    notes: row.notes,
    inspirationPhoto: row.inspiration_photo || undefined,
    status: row.status,
    unread: row.unread,
    createdAt: row.created_at,
    aiSummary: row.summary,
    fitLabel: row.fit_label,
    fitReason: row.fit_reason,
    whatsappOpener: row.whatsapp_opener,
  }
}

export async function fetchPublicArtist(username: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('public_artists')
    .select('id,username,full_name,city,bio,profile_photo,services,portfolio,service_cities,travel_available,working_days,working_from,working_to,languages,published,paused,is_demo')
    .eq('username', username.toLowerCase())
    .maybeSingle<ArtistRow>()

  if (error) throw new AppError(message(error, 'Could not load this profile.'))
  if (!data) return { artist: null, unavailableDates: [] as string[] }

  const { data: dates, error: datesError } = await db
    .from('unavailable_dates')
    .select('date')
    .eq('artist_id', data.id)
    .order('date')

  if (datesError) throw new AppError(message(datesError, 'Could not load availability.'))

  return {
    artist: rowToProfile(data),
    unavailableDates: (dates || []).map((item: { date: string }) => item.date),
  }
}

export async function fetchMyArtist(userId: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('artists')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle<ArtistRow>()

  if (error) throw new AppError(message(error, 'Could not load your profile.'))
  return data ? rowToProfile(data) : null
}

export async function fetchEnquiries(artistId: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('enquiries')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false })

  if (error) throw new AppError(message(error, 'Could not load your requests.'))
  return (data as EnquiryRow[]).map(rowToLead)
}

export async function fetchUnavailableDates(artistId: string) {
  const db = requireSupabase()
  const { data, error } = await db
    .from('unavailable_dates')
    .select('date')
    .eq('artist_id', artistId)
    .order('date')

  if (error) throw new AppError(message(error, 'Could not load availability.'))
  return (data || []).map((item: { date: string }) => item.date)
}

async function uploadPhoto(dataUrl: string, userId: string, folder: string) {
  if (!dataUrl.startsWith('data:')) return dataUrl
  const db = requireSupabase()
  const blob = await (await fetch(dataUrl)).blob()
  const extension = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg'
  const path = `${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`
  const { error } = await db.storage.from('media').upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new AppError(message(error, 'Could not upload that photo. Try a smaller image.'))
  const { data } = db.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

export async function saveArtist(profile: MuaProfile, userId: string) {
  const db = requireSupabase()
  const profilePhoto = profile.profilePhoto
    ? await uploadPhoto(profile.profilePhoto, userId, 'profile')
    : ''
  const portfolio = []
  for (const item of profile.portfolio) {
    portfolio.push({ ...item, url: await uploadPhoto(item.url, userId, 'portfolio') })
  }

  const row = profileToRow({ ...profile, profilePhoto, portfolio }, userId)
  const { error } = await db.from('artists').upsert(row, { onConflict: 'id' })
  if (error) throw new AppError(message(error, 'Could not save your profile.'))

  return { ...profile, profilePhoto, portfolio }
}

export async function isUsernameTaken(username: string) {
  const db = requireSupabase()
  const { data, error } = await db.rpc('username_taken', { candidate: username })
  if (error) throw new AppError(message(error, 'Could not check that link right now.'))
  return Boolean(data)
}

export async function createEnquiry(artistId: string, draft: EnquiryDraft, review: LeadReview) {
  const db = requireSupabase()
  const { error } = await db.from('enquiries').insert({
    artist_id: artistId,
    bride_name: draft.brideName.trim(),
    bride_whatsapp: draft.brideWhatsapp,
    occasion: draft.occasion,
    services: draft.services,
    family_count: draft.familyCount,
    event_date: draft.eventDate || null,
    ready_by: draft.readyBy || null,
    venue: draft.venue.trim(),
    budget: draft.budget || 'Prefer not to say',
    notes: draft.notes.trim(),
    inspiration_photo: draft.inspirationPhoto || null,
    summary: review.aiSummary,
    fit_label: review.fitLabel,
    fit_reason: review.fitReason,
    whatsapp_opener: review.whatsappOpener,
  })

  if (error) throw new AppError(message(error, 'Could not send your request. Please try again.'))
}

export async function setEnquiryStatus(id: string, status: LeadStatus) {
  const db = requireSupabase()
  const { error } = await db.from('enquiries').update({ status, unread: false }).eq('id', id)
  if (error) throw new AppError(message(error, 'Could not update this request.'))
}

export async function markEnquiryRead(id: string) {
  const db = requireSupabase()
  const { error } = await db.from('enquiries').update({ unread: false }).eq('id', id)
  if (error) throw new AppError(message(error, 'Could not update this request.'))
}

export async function setDateAvailability(artistId: string, date: string, blocked: boolean) {
  const db = requireSupabase()
  const { error } = blocked
    ? await db.from('unavailable_dates').insert({ artist_id: artistId, date })
    : await db.from('unavailable_dates').delete().eq('artist_id', artistId).eq('date', date)
  if (error) throw new AppError(message(error, 'Could not update that date.'))
}
