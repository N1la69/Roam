import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

export const property = defineType({
  name: 'property',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'One sentence hook (e.g. Modern timber cabin with cedar hot tub under the pines)',
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          {title: 'Cabins', value: 'Cabins'},
          {title: 'Beach', value: 'Beach'},
          {title: 'City', value: 'City'},
          {title: 'Villas', value: 'Villas'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pricePerNight',
      type: 'number',
      title: 'Price per night ($)',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'cleaningFee',
      type: 'number',
      title: 'Cleaning fee ($)',
      initialValue: 80,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'rating',
      type: 'number',
      initialValue: 4.9,
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewsCount',
      type: 'number',
      title: 'Reviews Count',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'isFeatured',
      type: 'boolean',
      title: 'Featured Stay',
      initialValue: false,
    }),

    // --- Typed Filter Fields (Exact hard constraints for GROQ) ---
    defineField({
      name: 'maxGuests',
      type: 'number',
      title: 'Max Guests',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'bedrooms',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'beds',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'baths',
      type: 'number',
      validation: (Rule) => Rule.required().min(0.5),
    }),
    defineField({
      name: 'petFriendly',
      type: 'boolean',
      title: 'Pets Allowed',
      initialValue: false,
    }),
    defineField({
      name: 'amenities',
      type: 'array',
      title: 'Amenities',
      description: 'Standard filterable amenities',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              {title: 'Hot Tub', value: 'Hot Tub'},
              {title: 'Pet Friendly', value: 'Pet Friendly'},
              {title: 'Fast WiFi', value: 'Fast WiFi'},
              {title: 'Fire Pit', value: 'Fire Pit'},
              {title: 'Fireplace', value: 'Fireplace'},
              {title: 'Pool', value: 'Pool'},
              {title: 'Sauna', value: 'Sauna'},
              {title: 'EV Charger', value: 'EV Charger'},
              {title: 'Dedicated Workspace', value: 'Dedicated Workspace'},
              {title: 'Mountain View', value: 'Mountain View'},
              {title: 'Oceanfront', value: 'Oceanfront'},
              {title: 'Lake Access', value: 'Lake Access'},
              {title: 'Ski-in / Ski-out', value: 'Ski-in / Ski-out'},
              {title: 'Outdoor Shower', value: 'Outdoor Shower'},
              {title: 'Air Conditioning', value: 'Air Conditioning'},
              {title: 'Full Kitchen', value: 'Full Kitchen'},
              {title: 'Private Patio / Deck', value: 'Private Patio / Deck'},
              {title: 'Stargazing Deck', value: 'Stargazing Deck'},
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // --- Location ---
    defineField({
      name: 'location',
      type: 'location',
      validation: (Rule) => Rule.required(),
    }),

    // --- Descriptive Fields for Dataset Embeddings (Semantic Search Ranking) ---
    defineField({
      name: 'description',
      type: 'text',
      rows: 6,
      description:
        'Complete property narrative for guest detail view and semantic embedding scoring.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'neighborhoodOverview',
      type: 'text',
      rows: 4,
      description: 'Details about the surroundings, privacy, and nearby natural attractions.',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      title: 'Semantic Tags',
      description:
        'Vibe and experiential tags (e.g. quiet, cozy, secluded, peaceful, modern, romantic)',
      of: [defineArrayMember({type: 'string'})],
      options: {
        layout: 'tags',
      },
    }),

    // --- Check-in / Check-out Hours ---
    defineField({
      name: 'checkInTime',
      type: 'string',
      title: 'Check-In Time',
      initialValue: '3:00 PM',
    }),
    defineField({
      name: 'checkOutTime',
      type: 'string',
      title: 'Check-Out Time',
      initialValue: '11:00 AM',
    }),

    // --- Media & Imagery ---
    defineField({
      name: 'imageUrl',
      type: 'url',
      title: 'Cover Image URL',
      description: 'Direct CDN/Unsplash URL for mobile clients',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Cover Image (Asset)',
      options: {hotspot: true},
    }),
    defineField({
      name: 'galleryUrls',
      type: 'array',
      title: 'Gallery Image URLs',
      of: [defineArrayMember({type: 'url'})],
      description: 'Additional high-resolution photo URLs for detail gallery view',
    }),

    // --- Shared Document References ---
    defineField({
      name: 'host',
      type: 'reference',
      to: [{type: 'host'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'policies',
      type: 'array',
      title: 'Applicable Policies',
      description: 'Shared policy documents linked to this stay',
      of: [defineArrayMember({type: 'reference', to: [{type: 'policy'}]})],
    }),
    defineField({
      name: 'staySpecificRules',
      type: 'array',
      title: 'Stay-Specific Rules',
      description: 'Unique house rules specific to this property (e.g. Hot tub closed after 10 PM)',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location.displayAddress',
      price: 'pricePerNight',
      media: 'mainImage',
      imageUrl: 'imageUrl',
    },
    prepare({title, subtitle, price, media}) {
      return {
        title,
        subtitle: `${subtitle ?? ''} • $${price ?? 0}/night`,
        media,
      }
    },
  },
})
