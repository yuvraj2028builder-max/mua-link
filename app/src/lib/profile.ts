import type { MuaProfile } from '../types'
import { slugify } from './site'

export const DEFAULT_WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function newProfile(id: string, fullName = '', email = '', username = ''): MuaProfile {
  return {
    id,
    published: false,
    paused: false,
    fullName,
    username: username || slugify(fullName),
    city: '',
    whatsapp: '',
    email,
    bio: '',
    profilePhoto: '',
    services: [],
    portfolio: [],
    serviceCities: [],
    travelAvailable: true,
    workingDays: [...DEFAULT_WORKING_DAYS],
    workingFrom: '09:00',
    workingTo: '21:00',
    languages: ['Hindi', 'English'],
  }
}
