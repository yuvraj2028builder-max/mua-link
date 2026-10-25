import { format, parseISO } from 'date-fns'
import type { EnquiryDraft, FitLabel, Lead, MuaProfile } from '../types'
import { formatEventDateLong, formatVenue } from './site'

export interface LeadReview {
  aiSummary: string
  fitLabel: FitLabel
  fitReason: string
  whatsappOpener: string
}

function familyLine(count: number, hinglish: boolean) {
  if (!count) return ''
  return hinglish
    ? ` Family ke ${count} logon ke liye bhi makeup chahiye.`
    : ` She also needs makeup for ${count} family member${count > 1 ? 's' : ''}.`
}

export function leadSummary(lead: Lead, lang: 'en' | 'hinglish', city = '') {
  const hinglish = lang === 'hinglish'
  const dateLabel = lead.eventDate ? formatEventDateLong(lead.eventDate) : hinglish ? 'date abhi tay nahi hui' : 'a date to be confirmed'
  const venue = formatVenue(city, lead.venue)
  const includesFamily = lead.services.some((service) => service.toLowerCase().includes('family'))
  const family = includesFamily ? familyLine(lead.familyCount, hinglish) : ''
  const note = lead.notes
    ? hinglish
      ? ` Unka note: “${lead.notes}”`
      : ` Her note: “${lead.notes}”`
    : ''
  return hinglish
    ? `${lead.brideName} ${dateLabel} ko ${venue || 'venue'} mein ${lead.occasion} ke liye booking chahti hain. Unhone ${lead.services.join(', ')} maanga hai.${family}${note}`
    : `${lead.brideName} is planning ${lead.occasion.toLowerCase()} on ${dateLabel} at ${venue || 'a venue to be confirmed'}. She has requested ${lead.services.join(', ')}.${family}${note}`
}

export function leadFitReason(lead: Lead, lang: 'en' | 'hinglish') {
  if (lang === 'en' && lead.fitReason) return lead.fitReason
  if (lang === 'en') {
    switch (lead.fitLabel) {
      case 'good_fit':
        return 'The venue is in the service area, the date is a working day, and every requested service is offered.'
      case 'not_a_fit':
        return 'One or more requested services are not listed on this profile.'
      case 'needs_review':
        return 'The date, venue or timing needs a quick check before you reply.'
      default:
        return 'This request has not been reviewed yet.'
    }
  }
  switch (lead.fitLabel) {
    case 'good_fit':
      return 'Venue aapke service area mein hai, date aapke working day par hai, aur saari maangi gayi services aap deti hain.'
    case 'not_a_fit':
      return 'Kuch maangi gayi services aapki profile mein listed nahi hain.'
    case 'needs_review':
      return 'Date, venue ya timing check karni hogi — jawab dene se pehle confirm kar lein.'
    default:
      return 'Review abhi baaki hai.'
  }
}

export function leadOpener(lead: Lead, artistName: string, lang: 'en' | 'hinglish') {
  if (lang === 'en' && lead.whatsappOpener) return lead.whatsappOpener
  const firstName = artistName.split(' ')[0] || 'your artist'
  const dateLabel = lead.eventDate ? formatEventDateLong(lead.eventDate) : 'your date'
  if (lang === 'en') {
    return `Hi ${lead.brideName}! ${firstName} here ✨ Thank you for sharing your ${lead.occasion.toLowerCase()} details for ${dateLabel}. I’d love to hear a little more about the look you have in mind — shall we chat about it?`
  }
  return `Hi ${lead.brideName}! ${firstName} yahan ✨ ${dateLabel} ke liye aapki ${lead.occasion.toLowerCase()} details share karne ke liye thank you. Main aapke mann ka look aur jaanna chahungi — baat karein?`
}

// A deterministic first-pass review. It runs instantly on submit so the lead is
// never blocked on an external model, and the reason is always auditable.
export function buildLeadReview(
  draft: EnquiryDraft,
  profile: MuaProfile,
  unavailableDates: string[],
): LeadReview {
  const venue = draft.venue.toLowerCase()
  const local =
    profile.serviceCities.some((city) => venue.includes(city.toLowerCase())) ||
    venue.includes(profile.city.toLowerCase())
  const servicesMatch = draft.services.every((name) =>
    profile.services.some((service) => service.visible && service.name === name),
  )
  const blocked = unavailableDates.includes(draft.eventDate)
  const weekday = draft.eventDate ? format(parseISO(`${draft.eventDate}T12:00:00`), 'EEEE') : ''
  const workingDay = profile.workingDays.includes(weekday)
  const firstName = profile.fullName.split(' ')[0] || 'your artist'

  let fitLabel: FitLabel = 'needs_review'
  if (!servicesMatch) fitLabel = 'not_a_fit'
  else if (local && workingDay && !blocked) fitLabel = 'good_fit'

  const dateLabel = formatEventDateLong(draft.eventDate)
  const venueLabel = formatVenue(profile.city, draft.venue)
  const includesFamily = draft.services.some((service) => service.toLowerCase().includes('family'))
  const familyNote = includesFamily && draft.familyCount
    ? ` She also needs makeup for ${draft.familyCount} family member${draft.familyCount > 1 ? 's' : ''}.`
    : ''
  const notesNote = draft.notes ? ` Her note: “${draft.notes}”` : ''
  const summary = `${draft.brideName} is planning ${draft.occasion.toLowerCase()} on ${dateLabel} at ${venueLabel || 'a venue to be confirmed'}. She has requested ${draft.services.join(', ')}.${familyNote}${notesNote}`

  const fitReason = !servicesMatch
    ? 'One or more requested services are not listed on this profile.'
    : blocked
      ? 'The artist has marked this date unavailable — confirm before replying.'
      : !local
        ? 'The venue appears to be outside the listed service cities. Confirm travel before quoting.'
        : !workingDay
          ? `${weekday} is not one of the listed working days. Check if the booking is possible.`
          : 'The venue is in the service area, the date is a working day, and every requested service is offered.'

  const whatsappOpener = `Hi ${draft.brideName}! ${firstName} here ✨ Thank you for sharing your ${draft.occasion.toLowerCase()} details for ${dateLabel}. I’d love to hear a little more about the look you have in mind — shall we chat about it?`

  return { aiSummary: summary, fitLabel, fitReason, whatsappOpener }
}
