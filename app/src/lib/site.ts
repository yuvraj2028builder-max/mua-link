import { differenceInCalendarDays, format, parseISO } from 'date-fns'
import type { FitLabel, Lead, LeadStatus } from '../types'

export const SITE_URL = 'https://mualink.vercel.app'

export function siteOrigin() {
  if (typeof window === 'undefined') return SITE_URL
  const { origin } = window.location
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin) ? SITE_URL : origin
}

export const RESERVED_USERNAMES = [
  'admin', 'support', 'api', 'login', 'signup', 'dashboard', 'help', 'mualink', 'www',
  'p', 'profile', 'onboarding', 'settings', 'about', 'terms', 'privacy',
]

export const occasions = [
  'Bridal (Main Wedding)',
  'Engagement',
  'Pre-Wedding Shoot',
  'Reception',
  'Party / Function',
  'Other',
]

export const budgets = [
  'Under ₹5,000',
  '₹5–10K',
  '₹10–20K',
  '₹20K+',
  'Prefer not to say',
]

export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const languages = ['Hindi', 'English', 'Punjabi', 'Urdu', 'Bengali', 'Other']

export const portfolioTags = ['Bridal', 'Engagement', 'Party', 'HD', 'Airbrush', 'Hair', 'Other']

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_\s]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 30)
}

export function profilePath(username: string) {
  return `/p/${username}`
}

export function profileUrl(username: string) {
  return `${siteOrigin()}${profilePath(username)}`
}

export function profileDisplayUrl(username: string) {
  return profileUrl(username).replace(/^https?:\/\//, '')
}

export function formatVenue(city: string, venue: string) {
  const cleanCity = city.trim()
  const cleanVenue = venue.trim()
  if (!cleanCity) return cleanVenue
  if (!cleanVenue) return cleanCity
  if (cleanVenue.toLowerCase() === cleanCity.toLowerCase()) return cleanCity
  if (cleanVenue.toLowerCase().startsWith(`${cleanCity.toLowerCase()} · `)) return cleanVenue
  return `${cleanCity} · ${cleanVenue}`
}

export function normaliseWhatsApp(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  return digits
}

export function waLink(number: string, message: string) {
  return `https://wa.me/${normaliseWhatsApp(number)}?text=${encodeURIComponent(message)}`
}

export function isValidIndianMobile(value: string) {
  return /^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))
}

export function formatEventDate(iso: string, pattern = 'd MMM yyyy') {
  if (!iso) return 'Date not set'
  try {
    return format(parseISO(`${iso}T12:00:00`), pattern)
  } catch {
    return iso
  }
}

export function formatEventDateLong(iso: string) {
  return formatEventDate(iso, 'EEEE, d MMMM yyyy')
}

export function formatTime(value: string) {
  if (!value) return 'Not specified'
  const [hour, minute] = value.split(':').map(Number)
  if (Number.isNaN(hour)) return value
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${h}:${String(minute || 0).padStart(2, '0')} ${suffix}`
}

export function inr(value: number | null) {
  if (value == null) return 'Custom quote'
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function daysUntil(iso: string) {
  if (!iso) return 0
  return differenceInCalendarDays(parseISO(`${iso}T12:00:00`), new Date())
}

export const fitMeta: Record<FitLabel, { label: string; chip: string; dot: string }> = {
  good_fit: {
    label: 'Good fit',
    chip: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  needs_review: {
    label: 'Needs review',
    chip: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  not_a_fit: {
    label: 'Not a fit',
    chip: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  unreviewed: {
    label: 'Review pending',
    chip: 'border-stone-200 bg-stone-100 text-stone-600',
    dot: 'bg-stone-400',
  },
}

export const statusMeta: Record<LeadStatus, { label: string; chip: string }> = {
  new: { label: 'New', chip: 'border-primary/20 bg-accent text-primary' },
  replied: { label: 'Replied', chip: 'border-sky-200 bg-sky-50 text-sky-700' },
  quote_sent: { label: 'Quote sent', chip: 'border-violet-200 bg-violet-50 text-violet-700' },
  confirmed: { label: 'Confirmed', chip: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  lost: { label: 'Lost', chip: 'border-stone-200 bg-stone-100 text-stone-600' },
  archived: { label: 'Archived', chip: 'border-stone-200 bg-stone-100 text-stone-500' },
}

export function leadReminderMessage(lead: Lead, username: string, city = '') {
  return [
    '🔔 New Booking Request!',
    `From: ${lead.brideName}`,
    `Occasion: ${lead.occasion}`,
    `Date: ${formatEventDate(lead.eventDate)}`,
    `Location: ${formatVenue(city, lead.venue) || 'Not shared'}`,
    `Budget: ${lead.budget || 'Not shared'}`,
    `Your MUALink profile: ${profileUrl(username)}`,
    `Open your MUALink dashboard to see full details and reply: ${siteOrigin()}/dashboard`,
  ].join('\n')
}

export function newLeadNotification(profileName: string) {
  return `Hi! I just sent a booking request to ${profileName} through MUALink. Looking forward to hearing back ✨`
}
