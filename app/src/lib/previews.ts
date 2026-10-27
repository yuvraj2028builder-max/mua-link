import type { MuaProfile, PortfolioItem, Service } from '../types'
import { normaliseUsername } from './site'

type PreviewOverride = Partial<Omit<MuaProfile, 'id' | 'username'>>

// Supplied previews: real artist details and photos. Any key left out falls
// back to the sample profile below.
export const SUPPLIED_PREVIEWS: Record<string, PreviewOverride> = {
  malachopra_makeupstudio: {
    fullName: 'Mala Chopra',
    city: 'Faridabad',
    bio: 'Bridal makeup artist based in Faridabad, working with brides across Delhi NCR and beyond. Soft, luminous skin and looks that still feel like you — with a calm, unhurried morning. DM for bookings and collaborations.',
    profilePhoto: '/images/artists/malachopra_makeupstudio-1.png',
    services: [
      { id: 's1', name: 'Signature Bridal', description: 'HD makeup, hairstyling, draping & lashes', priceType: 'starting_from', price: 35000, visible: true },
      { id: 's2', name: 'Engagement & Sangeet', description: 'Glam makeup with hair & draping', priceType: 'starting_from', price: 20000, visible: true },
      { id: 's3', name: 'Party & Cocktail', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 8000, visible: true },
      { id: 's4', name: 'Family & Guests', description: 'Occasion makeup for your favourite people', priceType: 'starting_from', price: 4000, visible: true },
      { id: 's5', name: 'Destination Wedding', description: 'Travel across India and abroad for your day', priceType: 'custom_quote', price: null, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/malachopra_makeupstudio-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/malachopra_makeupstudio-2.png', tag: 'HD' },
      { id: 'p3', url: '/images/artists/malachopra_makeupstudio-3.png', tag: 'Kit' },
    ],
    serviceCities: ['Faridabad', 'Delhi', 'Gurgaon', 'Noida'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
  anjali_shreesthamakeover: {
    fullName: 'Anjali Shreestha',
    city: 'Faridabad',
    bio: 'Flawless makeup for brides and occasions — airbrush, HD and party glam. Faridabad based and happy to travel for work. Om sai ram 🙏',
    profilePhoto: '/images/artists/anjali_shreesthamakeover-1.png',
    services: [
      { id: 's1', name: 'Airbrush Bridal', description: 'Airbrush base with hairstyling, draping & lashes', priceType: 'starting_from', price: 30000, visible: true },
      { id: 's2', name: 'HD Bridal', description: 'Flawless HD makeup for the big day', priceType: 'starting_from', price: 25000, visible: true },
      { id: 's3', name: 'Engagement & Reception', description: 'Polished glam with hair & draping', priceType: 'starting_from', price: 18000, visible: true },
      { id: 's4', name: 'Party Glam', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 7000, visible: true },
      { id: 's5', name: 'Family Makeup', description: 'Occasion makeup for family & friends', priceType: 'starting_from', price: 3500, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/anjali_shreesthamakeover-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/anjali_shreesthamakeover-2.png', tag: 'Reception' },
      { id: 'p3', url: '/images/artists/anjali_shreesthamakeover-3.png', tag: 'Engagement' },
    ],
    serviceCities: ['Faridabad', 'Delhi', 'Gurgaon', 'Noida'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
  makeupby_megha29: {
    fullName: 'Megha Sharma',
    city: 'Gurgaon',
    bio: 'For the brides who love elegance ✨ Soft, radiant and timeless makeup. Based in NCR and available for destination weddings.',
    profilePhoto: '/images/artists/makeupby_megha29-1.png',
    services: [
      { id: 's1', name: 'Bridal Elegance', description: 'Soft, radiant bridal makeup with hair & draping', priceType: 'starting_from', price: 40000, visible: true },
      { id: 's2', name: 'Engagement & Roka', description: 'Elegant makeup with hairstyling', priceType: 'starting_from', price: 22000, visible: true },
      { id: 's3', name: 'Reception & Cocktail', description: 'Radiant glam with lashes', priceType: 'starting_from', price: 20000, visible: true },
      { id: 's4', name: 'Party & Family', description: 'Occasion makeup for your favourite people', priceType: 'fixed', price: 8000, visible: true },
      { id: 's5', name: 'Destination Wedding', description: 'NCR and destination brides, travel included', priceType: 'custom_quote', price: null, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/makeupby_megha29-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/makeupby_megha29-2.png', tag: 'Bridal' },
      { id: 'p3', url: '/images/artists/makeupby_megha29-3.png', tag: 'Reception' },
    ],
    serviceCities: ['Gurgaon', 'Delhi', 'Noida'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
  priyankachaprana_makeup_studio: {
    fullName: 'Priyanka Chaprana',
    city: 'Faridabad',
    bio: 'Professional makeup artist with 5+ years of experience. Faridabad based and working globally. Also runs makeup batches for aspiring artists. ✨',
    profilePhoto: '/images/artists/priyankachaprana_makeup_studio-1.png',
    services: [
      { id: 's1', name: 'Signature Bridal', description: 'HD makeup, hairstyling, draping & lashes', priceType: 'starting_from', price: 28000, visible: true },
      { id: 's2', name: 'Engagement & Reception', description: 'Professional glam with hair & draping', priceType: 'starting_from', price: 16000, visible: true },
      { id: 's3', name: 'Party Makeup', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 6500, visible: true },
      { id: 's4', name: 'Family Makeup', description: 'Occasion makeup for family & friends', priceType: 'starting_from', price: 3500, visible: true },
      { id: 's5', name: 'Makeup Course', description: 'Personal training batch for aspiring artists', priceType: 'custom_quote', price: null, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/priyankachaprana_makeup_studio-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/priyankachaprana_makeup_studio-2.png', tag: 'Bridal' },
      { id: 'p3', url: '/images/artists/priyankachaprana_makeup_studio-3.png', tag: 'Reception' },
    ],
    serviceCities: ['Faridabad', 'Delhi', 'Gurgaon'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
  makeup_by_nidaaa: {
    fullName: 'Nida Raza',
    city: 'Delhi',
    bio: 'Certified makeup artist working across Delhi, Gurgaon, Lucknow and Ayodhya. Soft, camera-ready bridal looks with a calm, unhurried morning. Available for bookings and collaborations.',
    profilePhoto: '/images/artists/makeup_by_nidaaa-1.png',
    services: [
      { id: 's1', name: 'Signature Bridal', description: 'HD makeup, hairstyling, draping & lashes', priceType: 'starting_from', price: 30000, visible: true },
      { id: 's2', name: 'Engagement & Reception', description: 'Polished glam with hair & draping', priceType: 'starting_from', price: 18000, visible: true },
      { id: 's3', name: 'Party Makeup', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 7000, visible: true },
      { id: 's4', name: 'Family Makeup', description: 'Occasion makeup for family & friends', priceType: 'starting_from', price: 3500, visible: true },
      { id: 's5', name: 'Destination Wedding', description: 'Delhi NCR, Lucknow & Ayodhya — travel included', priceType: 'custom_quote', price: null, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/makeup_by_nidaaa-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/makeup_by_nidaaa-2.png', tag: 'Bridal' },
      { id: 'p3', url: '/images/artists/makeup_by_nidaaa-3.png', tag: 'Engagement' },
    ],
    serviceCities: ['Delhi', 'Gurgaon', 'Lucknow', 'Ayodhya'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
  realmakeupbysonia: {
    fullName: 'Sonia Chaudhary',
    city: 'Faridabad',
    bio: 'Makeup artist, educator and freelancer with 17 years of experience. Bridal looks, facials and hair, from Sector 15, Faridabad.',
    profilePhoto: '/images/artists/realmakeupbysonia-1.png',
    services: [
      { id: 's1', name: 'Bridal Makeup', description: 'Signature bridal look with hairstyling & draping', priceType: 'starting_from', price: 30000, visible: true },
      { id: 's2', name: 'Engagement & Reception', description: 'Polished glam with hair & draping', priceType: 'starting_from', price: 18000, visible: true },
      { id: 's3', name: 'Party & Guest Makeup', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 7000, visible: true },
      { id: 's4', name: 'Facials & Skin Prep', description: 'Pre-bridal facial and skin preparation', priceType: 'starting_from', price: 4500, visible: true },
      { id: 's5', name: 'Hairstyling', description: 'Occasion hairstyling and draping', priceType: 'starting_from', price: 3000, visible: true },
    ],
    portfolio: [
      { id: 'p1', url: '/images/artists/realmakeupbysonia-1.png', tag: 'Bridal' },
      { id: 'p2', url: '/images/artists/realmakeupbysonia-2.png', tag: 'Engagement' },
      { id: 'p3', url: '/images/artists/realmakeupbysonia-3.png', tag: 'Bridal' },
    ],
    serviceCities: ['Faridabad', 'Delhi', 'Gurgaon', 'Noida'],
    travelAvailable: true,
    languages: ['Hindi', 'English'],
  },
}

const samplePortfolio: PortfolioItem[] = [
  { id: 'p1', url: '/images/hero.jpg', tag: 'Bridal' },
  { id: 'p2', url: '/images/look1.jpg', tag: 'Party' },
  { id: 'p3', url: '/images/look2.jpg', tag: 'HD' },
  { id: 'p4', url: '/images/look3.jpg', tag: 'Engagement' },
  { id: 'p5', url: '/images/look4.jpg', tag: 'Hair' },
]

const sampleServices: Service[] = [
  { id: 's1', name: 'Signature Bridal', description: 'HD makeup, hairstyling, draping & lashes', priceType: 'starting_from', price: 25000, visible: true },
  { id: 's2', name: 'Engagement & Reception', description: 'A polished look with hair & draping', priceType: 'starting_from', price: 15000, visible: true },
  { id: 's3', name: 'Party Makeup', description: 'Soft glam or bold makeup with lashes', priceType: 'fixed', price: 6500, visible: true },
  { id: 's4', name: 'Family Makeup', description: 'Occasion makeup for your favourite people', priceType: 'starting_from', price: 3500, visible: true },
  { id: 's5', name: 'Pre-wedding Shoot', description: 'Camera-ready makeup, tailored to your concept', priceType: 'custom_quote', price: null, visible: true },
]

function nameFromUsername(username: string) {
  const cleaned = username
    .replace(/^(makeup_?by_?|mua_)/, '')
    .replace(/(_?makeup|_?mua|_?artist|_?studio|_?artistry)$/, '')
    .replace(/[._-]+/g, ' ')
    .trim()
  const source = cleaned || username.replace(/[._-]+/g, ' ')

  return source
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || 'Makeup Artist'
}

export function previewProfile(username: string): MuaProfile {
  const slug = normaliseUsername(username)
  const override = SUPPLIED_PREVIEWS[slug] || {}

  return {
    id: `preview-${slug}`,
    published: false,
    paused: false,
    fullName: nameFromUsername(slug),
    username: slug,
    city: 'Delhi NCR',
    whatsapp: '',
    email: '',
    bio: 'Bridal and occasion makeup across Delhi NCR. Soft, luminous skin and looks that still feel like you — with a calm, unhurried morning.',
    profilePhoto: '/images/look1.jpg',
    services: sampleServices.map((service) => ({ ...service })),
    portfolio: samplePortfolio.map((item) => ({ ...item })),
    serviceCities: ['Delhi', 'Gurgaon', 'Noida'],
    travelAvailable: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    workingFrom: '07:00',
    workingTo: '21:00',
    languages: ['Hindi', 'English', 'Punjabi'],
    ...override,
  }
}
