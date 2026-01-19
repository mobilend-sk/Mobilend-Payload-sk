import { CollectionConfig } from 'payload'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'date', 'featured'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nadpis',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Popis',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Dátum',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'text',
      required: true,
      label: 'Hlavný obrázok (URL)',
    },
    {
      name: 'categories',
      type: 'array',
      required: true,
      label: 'Kategórie',
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Zvýraznený článok',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Obsah článku',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta nadpis',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta popis',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Kľúčové slová',
        },
      ],
    },
  ],
  timestamps: true,
}

export default Blog