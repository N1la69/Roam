/**
 * Zero-dependency Sanity Content Lake client for Roam.
 * Uses native fetch() to query GROQ without adding bundle bloat.
 */

export const SANITY_CONFIG = {
  projectId: '2l8mxhsp',
  dataset: 'production',
  apiVersion: '2025-08-15',
  useCdn: true,
}

export interface SanityLocation {
  city: string
  stateOrProvince: string
  country: string
  displayAddress: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface SanityHost {
  name: string
  slug?: {current: string}
  avatarUrl?: string
  bio?: string
  isSuperhost?: boolean
  rating?: number
  reviewsCount?: number
  responseRate?: string
  responseTime?: string
  joinedDate?: string
}

export interface SanityPolicy {
  _id: string
  title: string
  slug?: {current: string}
  policyType: 'cancellation' | 'house_rules' | 'check_in' | 'safety' | 'pet_policy'
  summary: string
  content: string
  icon?: string
}

export interface SanityProperty {
  _id: string
  title: string
  slug?: {current: string}
  tagline?: string
  category: 'Cabins' | 'Beach' | 'City' | 'Villas'
  pricePerNight: number
  cleaningFee?: number
  rating: number
  reviewsCount: number
  isFeatured?: boolean
  maxGuests: number
  bedrooms: number
  beds: number
  baths: number
  petFriendly: boolean
  amenities: string[]
  location: SanityLocation
  description: string
  neighborhoodOverview?: string
  tags: string[]
  checkInTime?: string
  checkOutTime?: string
  imageUrl: string
  galleryUrls?: string[]
}

export interface SanityPropertyDetail extends SanityProperty {
  staySpecificRules?: string[]
  host?: SanityHost
  policies?: SanityPolicy[]
}

/**
 * Execute a GROQ query against Sanity Content Lake.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
  options?: {useCdn?: boolean}
): Promise<T> {
  const useCdn = options?.useCdn ?? SANITY_CONFIG.useCdn
  const host = useCdn ? 'apicdn.sanity.io' : 'api.sanity.io'

  // Build query URL with parameterized GROQ
  const url = new URL(
    `https://${SANITY_CONFIG.projectId}.${host}/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}`
  )

  url.searchParams.set('query', query)

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(`$${key}`, JSON.stringify(value))
    }
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Sanity query failed (${response.status} ${response.statusText}): ${errorText}`
    )
  }

  const data = await response.json()
  return data.result as T
}
