import {defineType, defineField} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

export const location = defineType({
  name: 'location',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'city',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stateOrProvince',
      type: 'string',
      title: 'State / Province',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      type: 'string',
      initialValue: 'USA',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayAddress',
      type: 'string',
      title: 'Display Address',
      description: 'Human-friendly location string (e.g. Lake Arrowhead, CA)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      type: 'object',
      title: 'Coordinates',
      fields: [
        defineField({
          name: 'lat',
          type: 'number',
          title: 'Latitude',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'lng',
          type: 'number',
          title: 'Longitude',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
})
