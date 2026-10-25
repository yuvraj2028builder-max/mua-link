import type { EnquiryDraft, Lead, MuaProfile } from './types'

export const demoProfile: MuaProfile = {
  id: 'demo-priyanka',
  published: true,
  paused: false,
  isDemo: true,
  fullName: 'Priyanka Sharma',
  username: 'priyanka',
  city: 'New Delhi',
  whatsapp: '9876543210',
  email: 'hello@priyankamua.in',
  bio: 'Soft glam, luminous skin, and looks that still feel like you. I specialise in modern bridal and occasion makeup across Delhi NCR, with a calm, unhurried experience on your big day.',
  profilePhoto: '/images/look1.jpg',
  services: [
    { id: 's1', name: 'Signature Bridal', description: 'HD makeup, hairstyling, draping & lashes', priceType: 'starting_from', price: 25000, visible: true },
    { id: 's2', name: 'Engagement & Reception', description: 'A polished look with hair & draping', priceType: 'starting_from', price: 15000, visible: true },
    { id: 's3', name: 'Party Makeup', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 6500, visible: true },
    { id: 's4', name: 'Family Makeup', description: 'Occasion makeup for your favourite people', priceType: 'starting_from', price: 3500, visible: true },
    { id: 's5', name: 'Pre-wedding Shoot', description: 'Camera-ready makeup, tailored to your concept', priceType: 'custom_quote', price: null, visible: true },
  ],
  portfolio: [
    { id: 'p1', url: '/images/hero.jpg', tag: 'Bridal' },
    { id: 'p2', url: '/images/look1.jpg', tag: 'Party' },
    { id: 'p3', url: '/images/look2.jpg', tag: 'HD' },
    { id: 'p4', url: '/images/look3.jpg', tag: 'Engagement' },
    { id: 'p5', url: '/images/look4.jpg', tag: 'Hair' },
  ],
  serviceCities: ['Delhi', 'Gurgaon', 'Noida', 'Faridabad'],
  travelAvailable: true,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  workingFrom: '07:00',
  workingTo: '21:00',
  languages: ['Hindi', 'English', 'Punjabi'],
}

export const initialLeads: Lead[] = [
  {
    id: 'lead-1', brideName: 'Sneha Kapoor', brideWhatsapp: '9812345678', occasion: 'Bridal (Main Wedding)',
    services: ['Signature Bridal', 'Family Makeup'], familyCount: 4, eventDate: '2026-12-12', readyBy: '15:30',
    venue: 'The Leela, Gurgaon', budget: '₹20K+', notes: 'I love a natural base and soft brown eyes. I will share my outfit photos soon.',
    status: 'new', unread: true, createdAt: '2026-10-25T12:40:00',
    aiSummary: 'Sneha is planning a December wedding in Gurgaon and needs bridal makeup plus services for four family members. Her soft-glam preferences align well with your signature style.',
    fitLabel: 'good_fit', fitReason: 'The venue is in your service area, the date falls on a working day, and all requested services match your profile.',
    whatsappOpener: 'Hi Sneha! Priyanka here ✨ Thank you for sharing all the lovely details. I’m available on 12 December and would love to create a soft glam look for you. Can we hop on a quick call to discuss your outfit and timing?',
  },
  {
    id: 'lead-2', brideName: 'Aisha Malhotra', brideWhatsapp: '9898989898', occasion: 'Engagement',
    services: ['Engagement & Reception'], familyCount: 0, eventDate: '2026-11-22', readyBy: '17:00',
    venue: 'Chattarpur, Delhi', budget: '₹10–20K', notes: 'Pastel lehenga, looking for minimal shimmer.',
    status: 'new', unread: true, createdAt: '2026-10-25T10:15:00',
    aiSummary: 'Aisha needs engagement makeup in Chattarpur for a 5 PM ready time. She prefers minimal shimmer to complement a pastel lehenga.',
    fitLabel: 'good_fit', fitReason: 'This is a local request for one of your core services with enough notice.',
    whatsappOpener: 'Hi Aisha, congratulations on your engagement! 💍 Your pastel lehenga and minimal shimmer direction sounds beautiful. I’d love to share a few looks and check if I’m the right fit for you.',
  },
  {
    id: 'lead-3', brideName: 'Ritika Sethi', brideWhatsapp: '9811112222', occasion: 'Reception',
    services: ['Engagement & Reception'], familyCount: 0, eventDate: '2026-11-08', readyBy: '18:00',
    venue: 'Noida', budget: '₹10–20K', notes: 'Reception at home, need hairstyling too.',
    status: 'replied', unread: false, createdAt: '2026-10-23T08:30:00',
    aiSummary: 'Ritika needs reception makeup and hairstyling at home in Noida.', fitLabel: 'good_fit',
    fitReason: 'The requested service and location match your profile.',
    whatsappOpener: 'Hi Ritika! Thanks for your enquiry. Yes, hairstyling is included — I’d love to hear more about your reception look.',
  },
  {
    id: 'lead-4', brideName: 'Meher Arora', brideWhatsapp: '9822223333', occasion: 'Pre-Wedding Shoot',
    services: ['Pre-wedding Shoot'], familyCount: 0, eventDate: '2026-11-03', readyBy: '06:30',
    venue: 'Lodhi Garden, Delhi', budget: 'Prefer not to say', notes: 'Two outfit changes, sunrise shoot.',
    status: 'confirmed', unread: false, createdAt: '2026-10-19T16:20:00',
    aiSummary: 'Meher has booked a sunrise pre-wedding shoot with two outfit changes.', fitLabel: 'needs_review',
    fitReason: 'The early ready time may require a travel and timing adjustment.',
    whatsappOpener: 'Hi Meher! Your sunrise shoot sounds lovely. I can plan a long-wear base and a quick touch-up between outfits.',
  },
  {
    id: 'lead-5', brideName: 'Tanya Bhatia', brideWhatsapp: '9833334444', occasion: 'Party / Function',
    services: ['Party Makeup'], familyCount: 0, eventDate: '2026-10-18', readyBy: '16:00',
    venue: 'Saket, Delhi', budget: '₹5–10K', notes: '', status: 'archived', unread: false, createdAt: '2026-10-12T09:00:00',
    aiSummary: 'Tanya requested party makeup in Saket.', fitLabel: 'good_fit', fitReason: 'Service and location match.',
    whatsappOpener: 'Hi Tanya! Thank you for your enquiry.',
  },
]

export const emptyEnquiry: EnquiryDraft = {
  brideName: '', brideWhatsapp: '', occasion: '', services: [], familyCount: 0,
  eventDate: '', readyBy: '', venue: '', budget: '', notes: '',
}

export const occasions = ['Bridal (Main Wedding)', 'Engagement', 'Pre-Wedding Shoot', 'Reception', 'Party / Function', 'Other']
export const budgets = ['Under ₹5,000', '₹5–10K', '₹10–20K', '₹20K+', 'Prefer not to say']
export const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
