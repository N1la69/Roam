import {defineType, defineField} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

export const policy = defineType({
  name: 'policy',
  type: 'document',
  icon: DocumentTextIcon,
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
      name: 'policyType',
      type: 'string',
      title: 'Policy Type',
      options: {
        list: [
          {title: 'Cancellation', value: 'cancellation'},
          {title: 'House Rules', value: 'house_rules'},
          {title: 'Check-In & Check-Out', value: 'check_in'},
          {title: 'Safety & Property', value: 'safety'},
          {title: 'Pet Policy', value: 'pet_policy'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'string',
      description: 'Concise 1-2 sentence overview for cards and badges',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      type: 'text',
      rows: 6,
      description: 'Exact policy text used word-for-word in policy Q&A and stay details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Icon identifier (e.g. shield, file-text, clock, paw, alert-circle)',
      initialValue: 'file-text',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      policyType: 'policyType',
    },
    prepare({title, policyType}) {
      return {
        title,
        subtitle: policyType ? policyType.replace('_', ' ').toUpperCase() : 'POLICY',
      }
    },
  },
})
