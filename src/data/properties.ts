export type PropertyCategory = "All" | "Cabins" | "Beach" | "City" | "Villas";

export interface Property {
  id: string;
  title: string;
  location: string;
  category: "Cabins" | "Beach" | "City" | "Villas";
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  amenities: string[];
  description: string;
  tags: string[];
  isFeatured?: boolean;
}

export const CATEGORIES: { id: PropertyCategory; label: string; icon: string }[] = [
  { id: "All", label: "All Stays", icon: "home" },
  { id: "Cabins", label: "Cabins", icon: "tree" },
  { id: "Beach", label: "Beach", icon: "water" },
  { id: "City", label: "City", icon: "briefcase" },
  { id: "Villas", label: "Villas", icon: "sun" },
];

export const PROPERTIES: Property[] = [
  {
    id: "stay-1",
    title: "Modern Cabin with Hot Tub",
    location: "Lake Arrowhead, CA",
    category: "Cabins",
    pricePerNight: 280,
    rating: 4.9,
    reviewsCount: 342,
    imageUrl:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Hot Tub", "Pet Friendly", "Fire Pit", "Fast WiFi"],
    description:
      "A serene architectural timber cabin nestled amidst mature pines, featuring a cedar hot tub, wrap-around deck, and cozy stone hearth.",
    tags: [
      "quiet",
      "pet friendly",
      "cabin",
      "hot tub",
      "lake arrowhead",
      "california",
      "forest",
      "fireplace",
    ],
    isFeatured: true,
  },
  {
    id: "stay-2",
    title: "Secluded Glass Villa & Sauna",
    location: "Whistler, BC",
    category: "Villas",
    pricePerNight: 420,
    rating: 4.95,
    reviewsCount: 188,
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Hot Tub", "Sauna", "Mountain View", "Private Deck"],
    description:
      "Contemporary cliffside villa with floor-to-ceiling glass windows overlooking panoramic alpine vistas and tranquil glacial lakes.",
    tags: [
      "quiet",
      "villa",
      "whistler",
      "hot tub",
      "sauna",
      "mountain view",
      "luxury",
      "secluded",
    ],
    isFeatured: false,
  },
  {
    id: "stay-3",
    title: "Coastal Driftwood Cottage",
    location: "Malibu, CA",
    category: "Beach",
    pricePerNight: 360,
    rating: 4.88,
    reviewsCount: 215,
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Oceanfront", "Pet Friendly", "Private Beach Access", "Outdoor Shower"],
    description:
      "Chic oceanside hideaway with direct sand access, natural linen interiors, and sunset terrace listening to ocean waves.",
    tags: [
      "beach",
      "pet friendly",
      "oceanfront",
      "malibu",
      "california",
      "coastal",
      "sunset",
    ],
    isFeatured: false,
  },
  {
    id: "stay-4",
    title: "Nordic Pine Haven & Spa",
    location: "Olympic Valley, CA",
    category: "Cabins",
    pricePerNight: 295,
    rating: 4.92,
    reviewsCount: 164,
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Hot Tub", "Pet Friendly", "Wood Stove", "Ski-in/Ski-out"],
    description:
      "Scandinavian-inspired wooden retreat surrounded by snow-capped peaks and quiet evergreen trails.",
    tags: [
      "cabin",
      "quiet",
      "pet friendly",
      "hot tub",
      "nordic",
      "snow",
      "tahoe",
      "olympic valley",
    ],
    isFeatured: false,
  },
  {
    id: "stay-5",
    title: "Architectural Skyline Loft",
    location: "Seattle, WA",
    category: "City",
    pricePerNight: 210,
    rating: 4.86,
    reviewsCount: 298,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
    amenities: ["City Skyline", "Dedicated Workspace", "EV Charger", "Gym Access"],
    description:
      "High-ceiling loft with exposed brickwork, custom walnut carpentry, and sweeping views of Puget Sound.",
    tags: [
      "city",
      "workspace",
      "loft",
      "seattle",
      "modern",
      "downtown",
      "fast wifi",
    ],
    isFeatured: false,
  },
  {
    id: "stay-6",
    title: "Desert Stargazer Oasis",
    location: "Joshua Tree, CA",
    category: "Villas",
    pricePerNight: 245,
    rating: 4.93,
    reviewsCount: 275,
    imageUrl:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Hot Tub", "Pet Friendly", "Stargazing Deck", "Fire Pit"],
    description:
      "Minimalist desert sanctuary engineered for dark sky stargazing, complete with sunken hot tub and outdoor cinema.",
    tags: [
      "quiet",
      "pet friendly",
      "hot tub",
      "desert",
      "joshua tree",
      "stargazing",
      "villa",
    ],
    isFeatured: false,
  },
];

export function filterProperties(
  query: string = "",
  category: PropertyCategory = "All"
): Property[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = normalizedQuery
    ? normalizedQuery.split(/\s+/).filter(Boolean)
    : [];

  return PROPERTIES.filter((property) => {
    // 1. Category match
    if (category !== "All" && property.category !== category) {
      return false;
    }

    // 2. Query match (if any)
    if (queryTokens.length === 0) {
      return true;
    }

    const searchableText = [
      property.title,
      property.location,
      property.description,
      ...property.tags,
      ...property.amenities,
    ]
      .join(" ")
      .toLowerCase();

    // Require all query tokens to match or partial match
    return queryTokens.every((token) => searchableText.includes(token));
  });
}
