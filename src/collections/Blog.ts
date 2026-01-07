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
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Автогенерація slug з title
        if (operation === 'create' || !data.slug) {
          if (data.title) {
            data.slug = data.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
          }
        }
        return data
      },
    ],
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
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        position: 'sidebar',
        description: 'Automaticky generovaný z názvu',
        readOnly: true,
      },
    },
    // Головне зображення через upload
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Hlavný obrázok',
      admin: {
        description: 'Nahrajte hlavný obrázok článku',
      },
    },
    // Додаткові зображення в статті
    {
      name: 'gallery',
      type: 'array',
      label: 'Galéria obrázkov',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Popis obrázka',
        },
      ],
    },
    // Категорії через relationship
    {
      name: 'categories',
      type: 'text',
      hasMany: true,
      required: true,
      label: 'Kategórie',
      admin: {
        description: 'Vyberte jednu alebo viac kategórií',
      },
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
    // Rich text editor для контенту
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Obsah článku',
      admin: {
        description: 'Hlavný obsah článku s formátovaním',
      },
    },
    // Автор статті
    {
      name: 'author',
      type: 'group',
      label: 'Autor',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Meno autora',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          label: 'Avatar autora',
        },
        {
          name: 'bio',
          type: 'textarea',
          label: 'Bio autora',
        },
      ],
    },
    // Час читання
    {
      name: 'readTime',
      type: 'number',
      label: 'Čas čítania (minúty)',
      admin: {
        description: 'Odhadovaný čas potrebný na prečítanie',
      },
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
          admin: {
            description: 'Ak prázdne, použije sa hlavný nadpis',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta popis',
          admin: {
            description: 'Ak prázdny, použije sa hlavný popis',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Kľúčové slová',
          admin: {
            description: 'Oddelené čiarkami',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'OG obrázok',
          admin: {
            description: 'Pre sociálne siete (ak prázdne, použije sa hlavný obrázok)',
          },
        },
      ],
    },
  ],
  timestamps: true,
}

export default Blog