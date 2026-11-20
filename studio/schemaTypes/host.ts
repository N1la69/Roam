import {defineType, defineField} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export const host = defineType({
  name: 'host',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatarUrl',
      type: 'url',
      title: 'Avatar URL',
      description: 'Public profile picture URL for mobile display',
    }),
    defineField({
      name: 'avatar',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'isSuperhost',
      type: 'boolean',
      title: 'Superhost',
      initialValue: false,
    }),
    defineField({
      name: 'rating',
      type: 'number',
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
      name: 'responseRate',
      type: 'string',
      title: 'Response Rate',
      description: 'e.g. 100%',
    }),
    defineField({
      name: 'responseTime',
      type: 'string',
      title: 'Response Time',
      description: 'e.g. within an hour',
    }),
    defineField({
      name: 'joinedDate',
      type: 'string',
      title: 'Joined Date',
      description: 'e.g. March 2021',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      isSuperhost: 'isSuperhost',
      media: 'avatar',
    },
    prepare({title, isSuperhost, media}) {
      return {
        title,
        subtitle: isSuperhost ? 'Superhost' : 'Host',
        media,
      }
    },
  },
})
