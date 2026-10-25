export type PriceType = 'fixed' | 'starting_from' | 'custom_quote'
export type LeadStatus = 'new' | 'replied' | 'quote_sent' | 'confirmed' | 'lost' | 'archived'
export type FitLabel = 'good_fit' | 'needs_review' | 'not_a_fit' | 'unreviewed'

export interface Service {
  id: string
  name: string
  description: string
  priceType: PriceType
  price: number | null
  visible: boolean
}

export interface PortfolioItem {
  id: string
  url: string
  tag: string
}

export interface MuaProfile {
  id: string
  published: boolean
  isDemo?: boolean
  fullName: string
  username: string
  city: string
  whatsapp: string
  email: string
  bio: string
  profilePhoto: string
  services: Service[]
  portfolio: PortfolioItem[]
  serviceCities: string[]
  travelAvailable: boolean
  workingDays: string[]
  workingFrom: string
  workingTo: string
  languages: string[]
}

export interface Lead {
  id: string
  brideName: string
  brideWhatsapp: string
  occasion: string
  services: string[]
  familyCount: number
  eventDate: string
  readyBy: string
  venue: string
  budget: string
  notes: string
  inspirationPhoto?: string
  status: LeadStatus
  unread: boolean
  createdAt: string
  aiSummary: string
  fitLabel: FitLabel
  fitReason: string
  whatsappOpener: string
}

export interface EnquiryDraft {
  brideName: string
  brideWhatsapp: string
  occasion: string
  services: string[]
  familyCount: number
  eventDate: string
  readyBy: string
  venue: string
  budget: string
  notes: string
  inspirationPhoto?: string
}
