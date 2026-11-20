import {getCliClient} from 'sanity/cli'

interface PolicySeed {
  slug: string
  title: string
  policyType: 'cancellation' | 'house_rules' | 'check_in' | 'safety' | 'pet_policy'
  summary: string
  content: string
  icon: string
}

interface HostSeed {
  slug: string
  name: string
  avatarUrl: string
  bio: string
  isSuperhost: boolean
  rating: number
  reviewsCount: number
  responseRate: string
  responseTime: string
  joinedDate: string
}

interface PropertySeed {
  slug: string
  title: string
  tagline: string
  category: 'Cabins' | 'Beach' | 'City' | 'Villas'
  pricePerNight: number
  cleaningFee: number
  rating: number
  reviewsCount: number
  isFeatured?: boolean
  maxGuests: number
  bedrooms: number
  beds: number
  baths: number
  petFriendly: boolean
  amenities: string[]
  location: {
    city: string
    stateOrProvince: string
    country: string
    displayAddress: string
    coordinates: {lat: number; lng: number}
  }
  description: string
  neighborhoodOverview: string
  tags: string[]
  checkInTime: string
  checkOutTime: string
  imageUrl: string
  galleryUrls: string[]
  hostSlug: string
  policySlugs: string[]
  staySpecificRules: string[]
}

const POLICIES: PolicySeed[] = [
  {
    slug: 'cancellation-flexible',
    title: 'Flexible Cancellation',
    policyType: 'cancellation',
    summary: 'Full refund up to 24 hours before check-in.',
    content:
      'Guests may cancel up to 24 hours before check-in for a full refund of all nightly rates and cleaning fees. Cancellations made within 24 hours of check-in are non-refundable for the first night, with remaining nights refunded at 50%.',
    icon: 'shield',
  },
  {
    slug: 'cancellation-moderate',
    title: 'Moderate Cancellation',
    policyType: 'cancellation',
    summary: 'Full refund up to 5 days before check-in.',
    content:
      'Cancel up to 5 days before check-in for a 100% refund. If cancelled between 5 days and 24 hours before check-in, the first night plus 50% of all subsequent nights are charged. Cleaning fees are fully refunded if the guest has not checked in.',
    icon: 'shield',
  },
  {
    slug: 'cancellation-strict',
    title: 'Strict Cancellation',
    policyType: 'cancellation',
    summary: 'Full refund if cancelled within 48 hours of booking and at least 14 days before check-in.',
    content:
      'Full refund only if cancelled within 48 hours of booking confirmation and at least 14 days prior to check-in. Cancellations between 7 and 14 days prior receive a 50% refund. No refund for cancellations made within 7 days of arrival.',
    icon: 'shield',
  },
  {
    slug: 'house-rules-standard',
    title: 'Standard House Rules',
    policyType: 'house_rules',
    summary: 'Quiet hours 10 PM - 8 AM. No parties, unregistered guests, or commercial photography.',
    content:
      'We respect our neighbors and natural surroundings. Quiet hours are strictly enforced between 10:00 PM and 8:00 AM. Parties, events, amplified outdoor sound, and unregistered overnight guests are strictly prohibited. Violations may result in immediate eviction without refund.',
    icon: 'file-text',
  },
  {
    slug: 'pet-guidelines',
    title: 'Pet Friendly Guidelines',
    policyType: 'pet_policy',
    summary: 'Up to 2 well-behaved dogs welcome. Paws must be wiped; pets kept off bedding.',
    content:
      'Up to two trained dogs are welcome. Pets must be leashed when outdoors in shared areas. Please wipe paws before entering and keep pets off soft furnishings and beds. Never leave pets unattended inside or on decks unless crated. Waste must be bagged and disposed of in outdoor bins.',
    icon: 'paw',
  },
  {
    slug: 'check-in-self-keyless',
    title: 'Self Check-In & Access',
    policyType: 'check_in',
    summary: 'Keyless smart lock entry. Access code transmitted 24 hours before arrival.',
    content:
      'Check-in is automated via a secure digital keypad. Your personalized entry code is activated at 3:00 PM on the day of arrival and expires at 11:00 AM on departure day. Please test your code upon arrival and contact host support immediately if you experience difficulties.',
    icon: 'clock',
  },
]

const HOSTS: HostSeed[] = [
  {
    slug: 'elena-vance',
    name: 'Elena Vance',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'Interior architect and alpine enthusiast. I design mountain cabins that honor nature and provide tranquil spaces for city dwellers to recharge.',
    isSuperhost: true,
    rating: 4.98,
    reviewsCount: 412,
    responseRate: '100%',
    responseTime: 'within an hour',
    joinedDate: 'October 2020',
  },
  {
    slug: 'marcus-chen',
    name: 'Marcus Chen',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Former ski instructor turned property curator in the Coast Mountains. Dedicated to sustainable architecture and quiet luxury.',
    isSuperhost: true,
    rating: 4.96,
    reviewsCount: 280,
    responseRate: '99%',
    responseTime: 'within an hour',
    joinedDate: 'January 2019',
  },
  {
    slug: 'claire-montgomery',
    name: 'Claire Montgomery',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
    bio: 'Coastal California native and ceramist. I love sharing peaceful oceanside properties where guests fall asleep to the rhythm of Pacific waves.',
    isSuperhost: true,
    rating: 4.94,
    reviewsCount: 345,
    responseRate: '98%',
    responseTime: 'within a few hours',
    joinedDate: 'May 2018',
  },
  {
    slug: 'mateo-morales',
    name: 'Mateo Morales',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'Urban designer focusing on historic loft restorations in Seattle and Vancouver. Passionate about walkable neighborhoods, espresso, and high ceilings.',
    isSuperhost: false,
    rating: 4.89,
    reviewsCount: 195,
    responseRate: '100%',
    responseTime: 'within an hour',
    joinedDate: 'August 2021',
  },
  {
    slug: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    bio: 'Astronomer and desert dweller. My properties in Joshua Tree and Sedona are built to maximize dark sky stargazing and total tranquility.',
    isSuperhost: true,
    rating: 4.97,
    reviewsCount: 510,
    responseRate: '100%',
    responseTime: 'within an hour',
    joinedDate: 'April 2017',
  },
  {
    slug: 'david-thorne',
    name: 'David Thorne',
    avatarUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600&auto=format&fit=crop',
    bio: 'Avid mountaineer and historic preservationist managing premier mountain lodges across the Colorado Rockies and Cascades.',
    isSuperhost: true,
    rating: 4.95,
    reviewsCount: 230,
    responseRate: '97%',
    responseTime: 'within an hour',
    joinedDate: 'November 2019',
  },
]

const PROPERTIES: PropertySeed[] = [
  // --- CABINS (9) ---
  {
    slug: 'modern-cabin-hot-tub-lake-arrowhead',
    title: 'Modern Cabin with Hot Tub',
    tagline: 'Serene timber cabin with cedar hot tub under mature California pines',
    category: 'Cabins',
    pricePerNight: 280,
    cleaningFee: 95,
    rating: 4.9,
    reviewsCount: 342,
    isFeatured: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Pet Friendly',
      'Fast WiFi',
      'Fire Pit',
      'Fireplace',
      'Mountain View',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Lake Arrowhead',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Lake Arrowhead, CA',
      coordinates: {lat: 34.2486, lng: -117.1895},
    },
    description:
      'A serene architectural timber cabin nestled amidst mature pines, featuring a cedar hot tub, wrap-around deck, and cozy stone hearth. Floor-to-ceiling glass captures the golden canopy light while radiant heating and organic linen bedding ensure absolute comfort on cool mountain evenings.',
    neighborhoodOverview:
      'Quiet wooded community minutes from Lake Arrowhead Village, scenic lake trails, and secluded forest lookouts.',
    tags: [
      'quiet',
      'pet friendly',
      'cabin',
      'hot tub',
      'lake arrowhead',
      'california',
      'forest',
      'fireplace',
      'cozy',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: [
      'Hot tub lid must be secured after every use',
      'No outdoor wood-burning fires during dry season warnings',
    ],
  },
  {
    slug: 'nordic-pine-haven-olympic-valley',
    title: 'Nordic Pine Haven & Spa',
    tagline: 'Scandinavian-inspired wooden retreat with barrel sauna and ski access',
    category: 'Cabins',
    pricePerNight: 295,
    cleaningFee: 110,
    rating: 4.92,
    reviewsCount: 164,
    isFeatured: false,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Sauna',
      'Pet Friendly',
      'Ski-in / Ski-out',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Olympic Valley',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Olympic Valley, CA',
      coordinates: {lat: 39.197, lng: -120.2357},
    },
    description:
      'Scandinavian-inspired wooden retreat surrounded by snow-capped peaks and quiet evergreen trails. Features an authentic outdoor cedar barrel sauna, deep soaking hot tub, and minimalist Nordic furnishings crafted from local white pine.',
    neighborhoodOverview:
      'Situated directly on mountain access trails in Palisades Tahoe valley, peaceful and private yet 5 minutes from ski lifts.',
    tags: [
      'cabin',
      'quiet',
      'pet friendly',
      'hot tub',
      'nordic',
      'snow',
      'tahoe',
      'olympic valley',
      'sauna',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Ski boots must be removed in mudroom heated entry'],
  },
  {
    slug: 'whispering-pines-timber-chalet-aspen',
    title: 'Whispering Pines Timber Chalet',
    tagline: 'Handcrafted timber chalet with panoramic Roaring Fork Valley views',
    category: 'Cabins',
    pricePerNight: 350,
    cleaningFee: 125,
    rating: 4.96,
    reviewsCount: 210,
    isFeatured: false,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2.5,
    petFriendly: false,
    amenities: [
      'Hot Tub',
      'Fireplace',
      'Mountain View',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
      'EV Charger',
    ],
    location: {
      city: 'Aspen',
      stateOrProvince: 'CO',
      country: 'USA',
      displayAddress: 'Aspen, CO',
      coordinates: {lat: 39.1911, lng: -106.8175},
    },
    description:
      'Hand-hewn timber frame home combining rustic Colorado warmth with modern amenities. Soak in the outdoor hot tub under aspen canopies or curl up beside the two-story river rock fireplace with a vintage vinyl record playing.',
    neighborhoodOverview:
      'Perched on Red Mountain slope overlooking Aspen town lights and mountain silhouettes.',
    tags: ['aspen', 'chalet', 'cabin', 'mountain view', 'hot tub', 'luxury', 'ski', 'fireplace', 'quiet'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'david-thorne',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Strictly no pets allowed due to host severe allergies'],
  },
  {
    slug: 'blue-ridge-glass-cabin-asheville',
    title: 'Blue Ridge Glass Cabin',
    tagline: 'Architectural cantilevered glass cabin hovering above mist-covered ridges',
    category: 'Cabins',
    pricePerNight: 235,
    cleaningFee: 75,
    rating: 4.91,
    reviewsCount: 148,
    isFeatured: false,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Pet Friendly',
      'Mountain View',
      'Fire Pit',
      'Fast WiFi',
      'Dedicated Workspace',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Asheville',
      stateOrProvince: 'NC',
      country: 'USA',
      displayAddress: 'Asheville, NC',
      coordinates: {lat: 35.5951, lng: -82.5515},
    },
    description:
      'Modern glass sanctuary perched 3,000 feet up in the Blue Ridge Mountains. Floor-to-ceiling glass walls invite sweeping sunrises, passing cloud inversions, and quiet starry nights directly into the open-concept living pavilion.',
    neighborhoodOverview:
      'Private 10-acre mountain parcel 20 minutes outside downtown Asheville arts district.',
    tags: ['cabin', 'glass house', 'asheville', 'blue ridge', 'mountain view', 'romantic', 'quiet', 'hot tub'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Driveway requires AWD/4WD during winter snow conditions'],
  },
  {
    slug: 'great-smoky-riverfront-lodge-gatlinburg',
    title: 'Great Smoky Riverfront Lodge',
    tagline: 'Expansive cedar lodge directly beside rushing mountain trout stream',
    category: 'Cabins',
    pricePerNight: 310,
    cleaningFee: 120,
    rating: 4.88,
    reviewsCount: 198,
    isFeatured: false,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Pet Friendly',
      'Fire Pit',
      'Fireplace',
      'Full Kitchen',
      'Private Patio / Deck',
      'Fast WiFi',
    ],
    location: {
      city: 'Gatlinburg',
      stateOrProvince: 'TN',
      country: 'USA',
      displayAddress: 'Gatlinburg, TN',
      coordinates: {lat: 35.7143, lng: -83.5102},
    },
    description:
      'Sprawling timber lodge with sound of cascading water filling every room. Step directly onto the river boulder bank for fly fishing or relax on the screened porch hot tub watching mist drift through the Smoky Mountain canopy.',
    neighborhoodOverview:
      'Secluded wooded creek bend borders Great Smoky Mountains National Park.',
    tags: ['cabin', 'smoky mountains', 'riverfront', 'hot tub', 'family', 'pet friendly', 'quiet', 'stream'],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'david-thorne',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Bear country safety: keep all trash in locked steel outdoor bear bin'],
  },
  {
    slug: 'cedar-peak-a-frame-mount-rainier',
    title: 'Cedar Peak A-Frame Hideaway',
    tagline: 'Classic 1970s architectural A-frame restored with cedar tub and mossy trail access',
    category: 'Cabins',
    pricePerNight: 240,
    cleaningFee: 85,
    rating: 4.94,
    reviewsCount: 228,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Pet Friendly',
      'Fireplace',
      'Fast WiFi',
      'Dedicated Workspace',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Ashford',
      stateOrProvince: 'WA',
      country: 'USA',
      displayAddress: 'Ashford, WA',
      coordinates: {lat: 46.7587, lng: -121.9845},
    },
    description:
      'Impeccably restored cedar A-frame nestled deep inside Pacific Northwest old-growth cedar and hemlock forest. Features vintage wood stove, skylit loft bedroom, and sunken cedar hot tub surrounded by lush sword ferns.',
    neighborhoodOverview:
      'Five minutes to the Nisqually Entrance of Mount Rainier National Park, ideal for hikers and nature photographers.',
    tags: ['a-frame', 'cabin', 'mount rainier', 'washington', 'forest', 'quiet', 'hot tub', 'cozy', 'hiking'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Ensure wood stove door is securely latched before sleeping'],
  },
  {
    slug: 'catskills-forest-sanctuary-woodstock',
    title: 'Catskills Forest Sanctuary',
    tagline: 'Sleek black timber cabin surrounded by 15 private woodland acres',
    category: 'Cabins',
    pricePerNight: 275,
    cleaningFee: 90,
    rating: 4.93,
    reviewsCount: 176,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1.5,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Pet Friendly',
      'Fire Pit',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'EV Charger',
    ],
    location: {
      city: 'Woodstock',
      stateOrProvince: 'NY',
      country: 'USA',
      displayAddress: 'Woodstock, NY',
      coordinates: {lat: 42.0409, lng: -74.1182},
    },
    description:
      'Minimalist charred cedar cabin nestled on 15 secluded wooded acres. Clean lines, radiant oak flooring, custom ceramics, and an outdoor stone fire pit make this upstate retreat a favorite for writers and artists.',
    neighborhoodOverview:
      'Peaceful Catskill woodlands ten minutes from Woodstock artisan cafes, bakeries, and farmers markets.',
    tags: ['catskills', 'new york', 'woodstock', 'cabin', 'quiet', 'design', 'fire pit', 'hot tub', 'secluded'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['No outdoor amplified sound at any time'],
  },
  {
    slug: 'lake-tahoe-shoreline-cabin',
    title: 'Lake Tahoe Shoreline Cabin',
    tagline: 'Waterfront timber cottage with private pier and sunset panoramic deck',
    category: 'Cabins',
    pricePerNight: 390,
    cleaningFee: 140,
    rating: 4.97,
    reviewsCount: 310,
    isFeatured: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    petFriendly: false,
    amenities: [
      'Lake Access',
      'Hot Tub',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
      'Mountain View',
    ],
    location: {
      city: 'South Lake Tahoe',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'South Lake Tahoe, CA',
      coordinates: {lat: 38.9399, lng: -119.9772},
    },
    description:
      'Authentic lakefront timber home with direct sandy beach access and private boat pier. Floor-to-ceiling windows look across crystalline cobalt waters toward Sierra Nevada peaks.',
    neighborhoodOverview:
      'Prestigious quiet shoreline lane away from casino traffic, steps from bike paths and state park beaches.',
    tags: ['lake tahoe', 'cabin', 'lakefront', 'hot tub', 'beach', 'sunset', 'california', 'pier', 'luxury'],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'elena-vance',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Pier use at own risk; life jackets available in boat house'],
  },
  {
    slug: 'white-mountains-alpine-retreat',
    title: 'White Mountains Alpine Retreat',
    tagline: 'Cozy log cabin nestled beneath granite ledges with private forest sauna',
    category: 'Cabins',
    pricePerNight: 215,
    cleaningFee: 70,
    rating: 4.89,
    reviewsCount: 132,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    petFriendly: true,
    amenities: [
      'Sauna',
      'Fire Pit',
      'Fireplace',
      'Pet Friendly',
      'Fast WiFi',
      'Full Kitchen',
      'Mountain View',
    ],
    location: {
      city: 'North Conway',
      stateOrProvince: 'NH',
      country: 'USA',
      displayAddress: 'North Conway, NH',
      coordinates: {lat: 44.0537, lng: -71.1284},
    },
    description:
      'Traditional handcrafted white pine log lodge featuring a wood-fired sauna, native granite hearth, and private path leading to national forest hiking and cross-country ski trails.',
    neighborhoodOverview:
      'Tucked under Cathedral Ledge rock face with direct wilderness trail connections.',
    tags: ['white mountains', 'cabin', 'sauna', 'quiet', 'hiking', 'pet friendly', 'new hampshire', 'cozy'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'david-thorne',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Wood-fired sauna must be supervised while lit'],
  },

  // --- BEACH (7) ---
  {
    slug: 'coastal-driftwood-cottage-malibu',
    title: 'Coastal Driftwood Cottage',
    tagline: 'Chic oceanside hideaway with direct sand access and sunset terrace',
    category: 'Beach',
    pricePerNight: 360,
    cleaningFee: 130,
    rating: 4.88,
    reviewsCount: 215,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1.5,
    petFriendly: true,
    amenities: [
      'Oceanfront',
      'Pet Friendly',
      'Private Patio / Deck',
      'Outdoor Shower',
      'Fast WiFi',
      'Full Kitchen',
      'Air Conditioning',
    ],
    location: {
      city: 'Malibu',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Malibu, CA',
      coordinates: {lat: 34.0259, lng: -118.7798},
    },
    description:
      'Chic oceanside hideaway with direct sand access, natural linen interiors, and sunset terrace listening to ocean waves. Reclaimed teak accents, whitewashed walls, and panoramic glass sliders create effortless indoor-outdoor coastal living.',
    neighborhoodOverview:
      'Exclusive Malibu cove beach minutes from legendary surf breaks and seafood dining.',
    tags: ['beach', 'pet friendly', 'oceanfront', 'malibu', 'california', 'coastal', 'sunset', 'quiet'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Rinse sand at outdoor cedar shower before entering'],
  },
  {
    slug: 'sunset-cliffs-ocean-villa-carmel',
    title: 'Sunset Cliffs Ocean Villa',
    tagline: 'Dramatic oceanfront villa perched above Carmel rocky bluffs and cypress groves',
    category: 'Beach',
    pricePerNight: 480,
    cleaningFee: 160,
    rating: 4.96,
    reviewsCount: 182,
    isFeatured: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 3,
    petFriendly: false,
    amenities: [
      'Oceanfront',
      'Hot Tub',
      'Fire Pit',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
      'EV Charger',
    ],
    location: {
      city: 'Carmel-by-the-Sea',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Carmel-by-the-Sea, CA',
      coordinates: {lat: 36.5552, lng: -121.9233},
    },
    description:
      'Architectural masterpiece cantilevered above Carmel coastline. Watch migrating whales from the cliffside hot tub or relax beside the outdoor fire pit with 180-degree unobstructed Pacific ocean vistas.',
    neighborhoodOverview:
      'Private coastal enclave nestled among sculpted Monterey cypress trees along 17-Mile Drive corridor.',
    tags: ['carmel', 'beach', 'oceanfront', 'cliffside', 'luxury', 'hot tub', 'sunset', 'california', 'quiet'],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Children must be accompanied by adults near cliffside railings'],
  },
  {
    slug: 'pacific-dunes-beach-house-cannon-beach',
    title: 'Pacific Dunes Beach House',
    tagline: 'Modern cedar beach house with sweeping views of the Oregon coast dunes',
    category: 'Beach',
    pricePerNight: 290,
    cleaningFee: 100,
    rating: 4.92,
    reviewsCount: 168,
    isFeatured: false,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Oceanfront',
      'Pet Friendly',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Cannon Beach',
      stateOrProvince: 'OR',
      country: 'USA',
      displayAddress: 'Cannon Beach, OR',
      coordinates: {lat: 45.8918, lng: -123.9615},
    },
    description:
      'Contemporary cedar home tucked behind golden sea grass dunes. Walk straight down the private sand boardwalk to miles of uncrowded Pacific surf, tide pools, and iconic sea stacks.',
    neighborhoodOverview:
      'Quiet coastal neighborhood south of Haystack Rock with uninterrupted beach walking paths.',
    tags: ['cannon beach', 'oregon', 'beach', 'pet friendly', 'oceanfront', 'dunes', 'quiet', 'fireplace'],
    checkInTime: '4:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Please wipe down sandy dogs in covered entry bay'],
  },
  {
    slug: 'hawaiian-palms-oceanfront-lanai-maui',
    title: 'Hawaiian Palms Oceanfront Lanai',
    tagline: 'Tropical villa steps from pristine turtle bay with private sunset lanai',
    category: 'Beach',
    pricePerNight: 520,
    cleaningFee: 180,
    rating: 4.98,
    reviewsCount: 290,
    isFeatured: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: false,
    amenities: [
      'Oceanfront',
      'Pool',
      'Air Conditioning',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
      'Outdoor Shower',
    ],
    location: {
      city: 'Lahaina',
      stateOrProvince: 'HI',
      country: 'USA',
      displayAddress: 'Maui, HI',
      coordinates: {lat: 20.8863, lng: -156.6825},
    },
    description:
      'Private beachfront paradise where tropical trade winds and sea turtle sightings are part of daily life. Features a lava rock outdoor shower, plunge pool, and spacious teak lanai directly overlooking the ocean channel.',
    neighborhoodOverview:
      'Exclusive oceanfront enclave on West Maui coastline, protected from trade wind swells.',
    tags: ['maui', 'hawaii', 'beach', 'oceanfront', 'pool', 'lanai', 'luxury', 'tropical', 'sunset'],
    checkInTime: '3:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Reef-safe sunscreen mandatory; sea turtles strictly protected'],
  },
  {
    slug: 'big-sur-coastal-cliff-house',
    title: 'Big Sur Coastal Cliff House',
    tagline: 'Off-grid redwood sanctuary perched 800 feet above churning Pacific breakers',
    category: 'Beach',
    pricePerNight: 610,
    cleaningFee: 195,
    rating: 4.99,
    reviewsCount: 142,
    isFeatured: true,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    petFriendly: false,
    amenities: [
      'Oceanfront',
      'Hot Tub',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Big Sur',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Big Sur, CA',
      coordinates: {lat: 36.2704, lng: -121.8081},
    },
    description:
      'Unmatched architectural retreat built from native redwood and stone along the wildest stretch of California coast. Soak in a cliff-edge copper hot tub gazing upon infinite horizon and listening to barking sea lions far below.',
    neighborhoodOverview:
      'Completely secluded private 40-acre headland with no neighbors in sight.',
    tags: ['big sur', 'beach', 'oceanfront', 'cliffside', 'luxury', 'hot tub', 'romantic', 'secluded', 'quiet'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Strictly no smoking or open flames outdoors anywhere on the headland'],
  },
  {
    slug: 'outer-banks-dunes-haven',
    title: 'Outer Banks Dunes Haven',
    tagline: 'Spacious coastal home perched on the high dunes with wraparound ocean porches',
    category: 'Beach',
    pricePerNight: 320,
    cleaningFee: 115,
    rating: 4.87,
    reviewsCount: 156,
    isFeatured: false,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3,
    petFriendly: true,
    amenities: [
      'Oceanfront',
      'Pet Friendly',
      'Private Patio / Deck',
      'Outdoor Shower',
      'Fast WiFi',
      'Full Kitchen',
      'Air Conditioning',
    ],
    location: {
      city: 'Nags Head',
      stateOrProvince: 'NC',
      country: 'USA',
      displayAddress: 'Outer Banks, NC',
      coordinates: {lat: 35.9574, lng: -75.6241},
    },
    description:
      'Classic cedar-shingle beach cottage modernized with open floor plans and expansive sea-facing decks. Private dune path delivers you directly into the warm Atlantic surf and endless sandy barrier island shores.',
    neighborhoodOverview:
      'Low-density historic cottage row surrounded by maritime oaks and sea oats.',
    tags: ['outer banks', 'north carolina', 'beach', 'oceanfront', 'pet friendly', 'family', 'surf'],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Respect sea turtle nests marked with regulatory fencing'],
  },
  {
    slug: 'key-west-turquoise-cottage',
    title: 'Key West Turquoise Cottage',
    tagline: 'Historic conch cottage with private plunge pool and lush palm courtyard',
    category: 'Beach',
    pricePerNight: 340,
    cleaningFee: 110,
    rating: 4.91,
    reviewsCount: 224,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Pool',
      'Pet Friendly',
      'Air Conditioning',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
      'Outdoor Shower',
    ],
    location: {
      city: 'Key West',
      stateOrProvince: 'FL',
      country: 'USA',
      displayAddress: 'Key West, FL',
      coordinates: {lat: 24.5551, lng: -81.78},
    },
    description:
      'Charming 19th-century conch cottage restored with white tongue-and-groove ceilings, tropical hardwood floors, and secluded courtyard pool wrapped in frangipani and bird of paradise blossoms.',
    neighborhoodOverview:
      'Peaceful Old Town Key West residential lane within easy cycling distance to Fort Zachary Taylor Beach.',
    tags: ['key west', 'florida', 'beach', 'pool', 'pet friendly', 'cottage', 'tropical', 'historic'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Quiet hours in pool courtyard after 10 PM'],
  },

  // --- CITY (7) ---
  {
    slug: 'architectural-skyline-loft-seattle',
    title: 'Architectural Skyline Loft',
    tagline: 'High-ceiling industrial loft overlooking Puget Sound and Seattle waterfront',
    category: 'City',
    pricePerNight: 210,
    cleaningFee: 80,
    rating: 4.86,
    reviewsCount: 298,
    isFeatured: false,
    maxGuests: 3,
    bedrooms: 1,
    beds: 1,
    baths: 1.5,
    petFriendly: false,
    amenities: [
      'Fast WiFi',
      'Dedicated Workspace',
      'EV Charger',
      'Air Conditioning',
      'Full Kitchen',
    ],
    location: {
      city: 'Seattle',
      stateOrProvince: 'WA',
      country: 'USA',
      displayAddress: 'Seattle, WA',
      coordinates: {lat: 47.6062, lng: -122.3321},
    },
    description:
      'High-ceiling loft with exposed timber beams, custom walnut carpentry, and sweeping views of Puget Sound ferry lanes. Equipped with fiber internet, dual monitor standing desk, and curated vinyl collection.',
    neighborhoodOverview:
      'Pioneer Square arts district steps from artisanal roasteries, galleries, and light rail.',
    tags: ['city', 'workspace', 'loft', 'seattle', 'modern', 'downtown', 'fast wifi', 'design'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Building lobby security requires registration of all guests'],
  },
  {
    slug: 'modern-pacific-heights-penthouse-sf',
    title: 'Modern Pacific Heights Penthouse',
    tagline: 'Light-filled residence with private roof garden overlooking the Golden Gate',
    category: 'City',
    pricePerNight: 395,
    cleaningFee: 140,
    rating: 4.95,
    reviewsCount: 184,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: false,
    amenities: [
      'Fast WiFi',
      'Dedicated Workspace',
      'Fireplace',
      'Private Patio / Deck',
      'Full Kitchen',
      'Air Conditioning',
    ],
    location: {
      city: 'San Francisco',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'San Francisco, CA',
      coordinates: {lat: 37.7925, lng: -122.4382},
    },
    description:
      'Full-floor Victorian penthouse transformed into a minimalist modern sanctuary. Expansive roof terrace provides 360-degree views of the Golden Gate Bridge, Alcatraz, and bay sailing regattas.',
    neighborhoodOverview:
      'Prestigious and quiet residential Pacific Heights, two blocks from Fillmore Street boutiques and dining.',
    tags: ['san francisco', 'penthouse', 'city', 'golden gate', 'workspace', 'luxury', 'roof deck'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['No high heels on custom white oak floors'],
  },
  {
    slug: 'gastown-exposed-brick-studio-vancouver',
    title: 'Gastown Exposed Brick Studio',
    tagline: 'Heritage converted warehouse space in Vancouver creative district',
    category: 'City',
    pricePerNight: 195,
    cleaningFee: 75,
    rating: 4.89,
    reviewsCount: 165,
    isFeatured: false,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    petFriendly: true,
    amenities: [
      'Fast WiFi',
      'Dedicated Workspace',
      'Pet Friendly',
      'Full Kitchen',
    ],
    location: {
      city: 'Vancouver',
      stateOrProvince: 'BC',
      country: 'Canada',
      displayAddress: 'Vancouver, BC',
      coordinates: {lat: 49.2827, lng: -123.1207},
    },
    description:
      'Historic 1910 warehouse loft featuring 12-foot fir timber columns, exposed red brick masonry, steel sash windows, and curated mid-century Danish furniture.',
    neighborhoodOverview:
      'Cobblestone streets of Gastown surrounded by independent coffee houses, fashion ateliers, and waterfront parks.',
    tags: ['vancouver', 'gastown', 'loft', 'city', 'brick', 'pet friendly', 'workspace', 'design'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Pets must be registered with building concierge upon arrival'],
  },
  {
    slug: 'south-congress-creative-loft-austin',
    title: 'South Congress Creative Loft',
    tagline: 'Vibrant modern loft with private pool and shaded pecan tree deck',
    category: 'City',
    pricePerNight: 230,
    cleaningFee: 85,
    rating: 4.93,
    reviewsCount: 205,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Pool',
      'Pet Friendly',
      'Fast WiFi',
      'Air Conditioning',
      'Dedicated Workspace',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Austin',
      stateOrProvince: 'TX',
      country: 'USA',
      displayAddress: 'Austin, TX',
      coordinates: {lat: 30.2502, lng: -97.7497},
    },
    description:
      'Warm architectural home featuring polished concrete floors, steel casement windows, and a tranquil private cocktail pool tucked beneath heritage Texas pecan trees.',
    neighborhoodOverview:
      'Walkable Travis Heights neighborhood three blocks from South Congress music venues and culinary hotspots.',
    tags: ['austin', 'texas', 'city', 'pool', 'pet friendly', 'south congress', 'modern', 'workspace'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['No glass containers in pool deck area'],
  },
  {
    slug: 'tribeca-sunlit-industrial-flat-nyc',
    title: 'Tribeca Sunlit Industrial Flat',
    tagline: 'Cast-iron architectural loft with private keyed elevator and south-facing light',
    category: 'City',
    pricePerNight: 450,
    cleaningFee: 160,
    rating: 4.97,
    reviewsCount: 240,
    isFeatured: true,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: false,
    amenities: [
      'Fast WiFi',
      'Dedicated Workspace',
      'Air Conditioning',
      'Full Kitchen',
    ],
    location: {
      city: 'New York',
      stateOrProvince: 'NY',
      country: 'USA',
      displayAddress: 'New York, NY',
      coordinates: {lat: 40.7163, lng: -74.0086},
    },
    description:
      'Iconic Tribeca loft featuring soaring 13-foot ceilings, authentic Corinthian cast-iron columns, museum-grade art walls, and south-facing arched windows flooding the interior with natural daylight.',
    neighborhoodOverview:
      'Quiet historic cobblestone lane in lower Manhattan close to Hudson River Park.',
    tags: ['new york', 'tribeca', 'loft', 'city', 'luxury', 'workspace', 'design', 'quiet'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Keyed elevator operates via security keycard provided'],
  },
  {
    slug: 'old-town-historic-brownstone-chicago',
    title: 'Old Town Historic Brownstone',
    tagline: 'Restored 1890s limestone flat with ivy courtyard in tree-lined Old Town',
    category: 'City',
    pricePerNight: 225,
    cleaningFee: 85,
    rating: 4.88,
    reviewsCount: 178,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1.5,
    petFriendly: true,
    amenities: [
      'Fast WiFi',
      'Pet Friendly',
      'Fireplace',
      'Dedicated Workspace',
      'Full Kitchen',
      'Air Conditioning',
    ],
    location: {
      city: 'Chicago',
      stateOrProvince: 'IL',
      country: 'USA',
      displayAddress: 'Chicago, IL',
      coordinates: {lat: 41.9103, lng: -84.6369},
    },
    description:
      'Sunlit garden-level home in an 1890 Victorian brownstone. High ceilings, decorative fireplace mantels, modern Italian kitchen, and a private back patio framed by historic brick walls and mature climbing ivy.',
    neighborhoodOverview:
      'Picturesque tree-lined residential street moments from Wells Street bistros and Lake Michigan parklands.',
    tags: ['chicago', 'brownstone', 'city', 'pet friendly', 'historic', 'quiet', 'workspace'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Courtyard quiet hours observed after 10 PM'],
  },
  {
    slug: 'mile-high-glass-residence-denver',
    title: 'Mile High Glass Residence',
    tagline: 'Contemporary corner flat with unobstructed views of the Front Range Rockies',
    category: 'City',
    pricePerNight: 240,
    cleaningFee: 90,
    rating: 4.91,
    reviewsCount: 145,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: false,
    amenities: [
      'Fast WiFi',
      'Dedicated Workspace',
      'EV Charger',
      'Air Conditioning',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Denver',
      stateOrProvince: 'CO',
      country: 'USA',
      displayAddress: 'Denver, CO',
      coordinates: {lat: 39.7392, lng: -104.9903},
    },
    description:
      'Modern corner flat in the heart of Denver with wrap-around glass walls facing west toward snow-dusted Continental Divide peaks. Features chef kitchen, smart lighting, and sunset cocktail balcony.',
    neighborhoodOverview:
      'RiNo Arts District known for breweries, murals, contemporary galleries, and light rail connection.',
    tags: ['denver', 'colorado', 'city', 'mountain view', 'workspace', 'modern', 'balcony'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'mateo-morales',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Reserved garage parking space #204 included'],
  },

  // --- VILLAS (7) ---
  {
    slug: 'secluded-glass-villa-sauna-whistler',
    title: 'Secluded Glass Villa & Sauna',
    tagline: 'Contemporary cliffside villa with panoramic alpine vistas and glacial lakes',
    category: 'Villas',
    pricePerNight: 420,
    cleaningFee: 160,
    rating: 4.95,
    reviewsCount: 188,
    isFeatured: false,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 3.5,
    petFriendly: false,
    amenities: [
      'Hot Tub',
      'Sauna',
      'Mountain View',
      'Private Patio / Deck',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'EV Charger',
    ],
    location: {
      city: 'Whistler',
      stateOrProvince: 'BC',
      country: 'Canada',
      displayAddress: 'Whistler, BC',
      coordinates: {lat: 50.1163, lng: -122.9574},
    },
    description:
      'Contemporary cliffside villa with floor-to-ceiling glass windows overlooking panoramic alpine vistas and tranquil glacial lakes. Relax in the cedar sauna, outdoor infinity hot tub, and sunken lounge with architectural suspended fireplace.',
    neighborhoodOverview:
      'Exclusive gated alpine community perched above Alta Lake, 7 minutes to Whistler Village gondolas.',
    tags: [
      'quiet',
      'villa',
      'whistler',
      'hot tub',
      'sauna',
      'mountain view',
      'luxury',
      'secluded',
      'ski',
    ],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'marcus-chen',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Heated boot warmers and ski storage in lower garage level'],
  },
  {
    slug: 'desert-stargazer-oasis-joshua-tree',
    title: 'Desert Stargazer Oasis',
    tagline: 'Minimalist desert sanctuary engineered for dark sky stargazing and tranquility',
    category: 'Villas',
    pricePerNight: 245,
    cleaningFee: 90,
    rating: 4.93,
    reviewsCount: 275,
    isFeatured: false,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly: true,
    amenities: [
      'Hot Tub',
      'Stargazing Deck',
      'Pet Friendly',
      'Fire Pit',
      'Fast WiFi',
      'Air Conditioning',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Joshua Tree',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Joshua Tree, CA',
      coordinates: {lat: 34.1347, lng: -116.3131},
    },
    description:
      'Minimalist desert sanctuary engineered for dark sky stargazing, complete with sunken hot tub, outdoor cinema projector, and viewing platform. Watch the Milky Way rise over jagged granite boulder formations.',
    neighborhoodOverview:
      'Five serene desert acres bordering protected national park conservation land.',
    tags: [
      'quiet',
      'pet friendly',
      'hot tub',
      'desert',
      'joshua tree',
      'stargazing',
      'villa',
      'design',
      'secluded',
    ],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'sarah-jenkins',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['No outdoor white lights during designated dark sky hours (after 9 PM)'],
  },
  {
    slug: 'mid-century-desert-estate-palm-springs',
    title: 'Mid-Century Desert Estate & Pool',
    tagline: 'Restored 1962 Alexander architectural estate with mountain backdrop pool',
    category: 'Villas',
    pricePerNight: 380,
    cleaningFee: 140,
    rating: 4.96,
    reviewsCount: 320,
    isFeatured: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 3,
    petFriendly: true,
    amenities: [
      'Pool',
      'Hot Tub',
      'Pet Friendly',
      'Fire Pit',
      'Mountain View',
      'Air Conditioning',
      'Fast WiFi',
      'Full Kitchen',
    ],
    location: {
      city: 'Palm Springs',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Palm Springs, CA',
      coordinates: {lat: 33.8303, lng: -116.5453},
    },
    description:
      'Classic mid-century post-and-beam architecture framed by the dramatic rise of the San Jacinto Mountains. Features a turquoise swimming pool, integrated spa, fire pit lounge, and indoor gas fireplace.',
    neighborhoodOverview:
      'Quiet Historic Tennis Club neighborhood walking distance to Palm Canyon drive restaurants.',
    tags: ['palm springs', 'mid-century', 'villa', 'pool', 'hot tub', 'pet friendly', 'mountain view', 'california'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'sarah-jenkins',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['City of Palm Springs strict noise ordinance: outdoor music prohibited at all hours'],
  },
  {
    slug: 'red-rock-sunset-sanctuary-sedona',
    title: 'Red Rock Sunset Sanctuary',
    tagline: 'Southwest modern villa with unobstructed views of Cathedral Rock',
    category: 'Villas',
    pricePerNight: 395,
    cleaningFee: 135,
    rating: 4.97,
    reviewsCount: 195,
    isFeatured: false,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 2.5,
    petFriendly: false,
    amenities: [
      'Hot Tub',
      'Fire Pit',
      'Mountain View',
      'Fast WiFi',
      'Dedicated Workspace',
      'Full Kitchen',
      'Air Conditioning',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Sedona',
      stateOrProvince: 'AZ',
      country: 'USA',
      displayAddress: 'Sedona, AZ',
      coordinates: {lat: 34.8697, lng: -111.761},
    },
    description:
      'Custom rammed-earth villa positioned directly facing illuminated red rock canyon formations. Soak in the rooftop spa under crimson desert sunsets or meditate in the private zen courtyard.',
    neighborhoodOverview:
      'Peaceful cul-de-sac adjacent to Coconino National Forest trailheads.',
    tags: ['sedona', 'arizona', 'villa', 'red rocks', 'hot tub', 'views', 'quiet', 'meditation', 'luxury'],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'sarah-jenkins',
    policySlugs: ['cancellation-moderate', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Please stay on marked gravel pathways to protect fragile cryptobiotic soil'],
  },
  {
    slug: 'napa-valley-vineyard-estate',
    title: 'Napa Valley Vineyard Estate',
    tagline: 'Private modern estate surrounded by rolling Cabernet Sauvignon vines',
    category: 'Villas',
    pricePerNight: 580,
    cleaningFee: 190,
    rating: 4.98,
    reviewsCount: 160,
    isFeatured: true,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 3.5,
    petFriendly: false,
    amenities: [
      'Pool',
      'Hot Tub',
      'Fire Pit',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'EV Charger',
      'Private Patio / Deck',
    ],
    location: {
      city: 'St. Helena',
      stateOrProvince: 'CA',
      country: 'USA',
      displayAddress: 'Napa Valley, CA',
      coordinates: {lat: 38.5052, lng: -122.4704},
    },
    description:
      'Exclusive wine country villa featuring infinity edge pool looking across emerald vine rows to Mayacamas Mountain ridges. Includes professional outdoor pizza oven, bocce ball court, and private wine cellar tasting room.',
    neighborhoodOverview:
      'Gated private vineyard lane between St. Helena and Calistoga, minutes from world-class wineries.',
    tags: ['napa valley', 'wine country', 'villa', 'pool', 'vineyard', 'hot tub', 'luxury', 'california'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'claire-montgomery',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Vineyard rows are operational farm areas; please remain on designated paths'],
  },
  {
    slug: 'grand-teton-modern-chalet-jackson',
    title: 'Grand Teton Modern Chalet',
    tagline: 'Glass-and-steel alpine villa with sweeping views of the Teton Range',
    category: 'Villas',
    pricePerNight: 650,
    cleaningFee: 220,
    rating: 4.99,
    reviewsCount: 174,
    isFeatured: true,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    petFriendly: false,
    amenities: [
      'Hot Tub',
      'Sauna',
      'Mountain View',
      'Fireplace',
      'Fast WiFi',
      'Full Kitchen',
      'EV Charger',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Jackson Hole',
      stateOrProvince: 'WY',
      country: 'USA',
      displayAddress: 'Jackson Hole, WY',
      coordinates: {lat: 43.4799, lng: -110.7624},
    },
    description:
      'World-class modern architecture framing the jagged peaks of the Grand Tetons. Includes radiant heated stone floors, steam shower, outdoor cedar hot tub, and glass-enclosed wine room.',
    neighborhoodOverview:
      'Private wooded ridge minutes from Jackson town square and Jackson Hole Mountain Resort.',
    tags: ['jackson hole', 'wyoming', 'tetons', 'villa', 'mountain view', 'hot tub', 'luxury', 'ski', 'sauna'],
    checkInTime: '4:00 PM',
    checkOutTime: '10:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'marcus-chen',
    policySlugs: ['cancellation-strict', 'house-rules-standard', 'check-in-self-keyless'],
    staySpecificRules: ['Bear spray canisters provided; leave on kitchen counter when checking out'],
  },
  {
    slug: 'sonoran-desert-courtyard-villa-scottsdale',
    title: 'Sonoran Desert Courtyard Villa',
    tagline: 'Modern adobe retreat with heated lap pool and private saguaro cactus garden',
    category: 'Villas',
    pricePerNight: 340,
    cleaningFee: 120,
    rating: 4.92,
    reviewsCount: 212,
    isFeatured: false,
    maxGuests: 6,
    bedrooms: 3,
    beds: 3,
    baths: 3,
    petFriendly: true,
    amenities: [
      'Pool',
      'Hot Tub',
      'Pet Friendly',
      'Fire Pit',
      'Air Conditioning',
      'Fast WiFi',
      'Full Kitchen',
      'Private Patio / Deck',
    ],
    location: {
      city: 'Scottsdale',
      stateOrProvince: 'AZ',
      country: 'USA',
      displayAddress: 'Scottsdale, AZ',
      coordinates: {lat: 33.4942, lng: -111.9261},
    },
    description:
      'Spacious modern desert villa built around a central open-air courtyard with fountain, heated lap pool, and integrated spa. Floor-to-ceiling glass reveals towering century-old saguaro cacti and Pinnacle Peak silhouettes.',
    neighborhoodOverview:
      'Serene North Scottsdale desert community bordering McDowell Sonoran Preserve trails.',
    tags: ['scottsdale', 'arizona', 'desert', 'pool', 'villa', 'hot tub', 'pet friendly', 'sunshine'],
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM',
    imageUrl:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
    ],
    hostSlug: 'sarah-jenkins',
    policySlugs: ['cancellation-flexible', 'house-rules-standard', 'pet-guidelines', 'check-in-self-keyless'],
    staySpecificRules: ['Pool heating available upon advance request'],
  },
]

async function seed() {
  const client = getCliClient({apiVersion: '2025-08-15'})
  console.log('🚀 Starting idempotent seed of Sanity dataset...')

  // 1. Seed Policies
  console.log('\n📄 Seeding Policies...')
  const policyIdMap = new Map<string, string>()

  for (const pol of POLICIES) {
    const existing = await client.fetch<string | null>(
      '*[_type == "policy" && slug.current == $slug][0]._id',
      {slug: pol.slug}
    )

    const doc = {
      _type: 'policy',
      title: pol.title,
      slug: {_type: 'slug', current: pol.slug},
      policyType: pol.policyType,
      summary: pol.summary,
      content: pol.content,
      icon: pol.icon,
    }

    if (existing) {
      console.log(`  Updating policy: ${pol.title} (${existing})`)
      await client.patch(existing).set(doc).commit()
      policyIdMap.set(pol.slug, existing)
    } else {
      console.log(`  Creating policy: ${pol.title}`)
      const created = await client.create(doc)
      policyIdMap.set(pol.slug, created._id)
    }
  }

  // 2. Seed Hosts
  console.log('\n👤 Seeding Hosts...')
  const hostIdMap = new Map<string, string>()

  for (const h of HOSTS) {
    const existing = await client.fetch<string | null>(
      '*[_type == "host" && slug.current == $slug][0]._id',
      {slug: h.slug}
    )

    const doc = {
      _type: 'host',
      name: h.name,
      slug: {_type: 'slug', current: h.slug},
      avatarUrl: h.avatarUrl,
      bio: h.bio,
      isSuperhost: h.isSuperhost,
      rating: h.rating,
      reviewsCount: h.reviewsCount,
      responseRate: h.responseRate,
      responseTime: h.responseTime,
      joinedDate: h.joinedDate,
    }

    if (existing) {
      console.log(`  Updating host: ${h.name} (${existing})`)
      await client.patch(existing).set(doc).commit()
      hostIdMap.set(h.slug, existing)
    } else {
      console.log(`  Creating host: ${h.name}`)
      const created = await client.create(doc)
      hostIdMap.set(h.slug, created._id)
    }
  }

  // 3. Seed Properties
  console.log('\n🏡 Seeding Properties...')
  let createdCount = 0
  let updatedCount = 0

  for (const prop of PROPERTIES) {
    const hostId = hostIdMap.get(prop.hostSlug)
    if (!hostId) {
      throw new Error(`Host slug not found: ${prop.hostSlug}`)
    }

    const policyRefs = prop.policySlugs
      .map((slug) => {
        const id = policyIdMap.get(slug)
        if (!id) return null
        return {
          _type: 'reference',
          _ref: id,
          _key: `policy-${slug}`,
        }
      })
      .filter(Boolean)

    const existing = await client.fetch<string | null>(
      '*[_type == "property" && slug.current == $slug][0]._id',
      {slug: prop.slug}
    )

    const doc = {
      _type: 'property',
      title: prop.title,
      slug: {_type: 'slug', current: prop.slug},
      tagline: prop.tagline,
      category: prop.category,
      pricePerNight: prop.pricePerNight,
      cleaningFee: prop.cleaningFee,
      rating: prop.rating,
      reviewsCount: prop.reviewsCount,
      isFeatured: prop.isFeatured ?? false,
      maxGuests: prop.maxGuests,
      bedrooms: prop.bedrooms,
      beds: prop.beds,
      baths: prop.baths,
      petFriendly: prop.petFriendly,
      amenities: prop.amenities,
      location: {
        _type: 'location',
        city: prop.location.city,
        stateOrProvince: prop.location.stateOrProvince,
        country: prop.location.country,
        displayAddress: prop.location.displayAddress,
        coordinates: prop.location.coordinates,
      },
      description: prop.description,
      neighborhoodOverview: prop.neighborhoodOverview,
      tags: prop.tags,
      checkInTime: prop.checkInTime,
      checkOutTime: prop.checkOutTime,
      imageUrl: prop.imageUrl,
      galleryUrls: prop.galleryUrls,
      host: {
        _type: 'reference',
        _ref: hostId,
      },
      policies: policyRefs,
      staySpecificRules: prop.staySpecificRules,
    }

    if (existing) {
      await client.patch(existing).set(doc).commit()
      updatedCount++
      console.log(`  [UPDATED] ${prop.title} ($${prop.pricePerNight}/nt)`)
    } else {
      await client.create(doc)
      createdCount++
      console.log(`  [CREATED] ${prop.title} ($${prop.pricePerNight}/nt)`)
    }
  }

  console.log(`\n✅ Seeding complete!`)
  console.log(`   Policies:   ${policyIdMap.size}`)
  console.log(`   Hosts:      ${hostIdMap.size}`)
  console.log(`   Properties: ${createdCount} created, ${updatedCount} updated (Total: ${PROPERTIES.length})`)

  // Verification counts
  const totalProps = await client.fetch<number>('count(*[_type == "property"])')
  const totalHosts = await client.fetch<number>('count(*[_type == "host"])')
  const totalPolicies = await client.fetch<number>('count(*[_type == "policy"])')

  console.log(`\n📊 Live Dataset Verification:`)
  console.log(`   *[_type == "property"]: ${totalProps}`)
  console.log(`   *[_type == "host"]:     ${totalHosts}`)
  console.log(`   *[_type == "policy"]:   ${totalPolicies}`)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
