import type { CollectionConfig } from 'payload'

// Колекція для управління папками
export const MediaFolders: CollectionConfig = {
  slug: 'media-folders',
  admin: {
    useAsTitle: 'name',
    description: 'Управління папками для медіафайлів',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Назва папки',
      admin: {
        description: 'Назва папки (напр. Products, Blog)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly назва (напр. products, blog)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис',
      admin: {
        description: 'Опціональний опис призначення папки',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Активна',
      admin: {
        description: 'Відображати папку в списку',
      },
    },
  ],
}