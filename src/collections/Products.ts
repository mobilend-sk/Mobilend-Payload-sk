import type { CollectionConfig } from 'payload'

// Функція для генерації slug
const generateSlug = (phone: string, model: string, memory: string): string => {
  const combined = `${phone} ${model} ${memory}`
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'model',
    defaultColumns: ['model', 'price', 'color', 'memory', 'discount'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Автогенерація productLink (slug)
        if (operation === 'create' || !data.productLink) {
          if (data.phone && data.model && data.memory) {
            data.productLink = generateSlug(data.phone, data.model, data.memory)
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
      required: true,
      admin: {
        description: 'Назва телефону (напр. Apple iPhone 14)',
      },
    },
    {
      name: 'model',
      type: 'text',
      required: true,
      admin: {
        description: 'Повна назва моделі з характеристиками',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Phone', value: 'phone' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Laptop', value: 'laptop' },
      ],
      defaultValue: 'phone',
    },
    {
      name: 'modelGroup',
      type: 'text',
      required: true,
      admin: {
        description: 'Група моделі (напр. iPhone)',
      },
    },
    {
      name: 'color',
      type: 'text',
      required: true,
      admin: {
        description: 'HEX код кольору',
      },
    },
    {
      name: 'memory',
      type: 'text',
      required: true,
      admin: {
        description: "Об'єм пам'яті (напр. 128 GB)",
      },
    },
    {
      name: 'price',
      type: 'number',
      required: false,
      admin: {
        description: 'Ціна продукту (може бути null для недоступних)',
      },
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'EUR',
    },
    {
      name: 'currencyLabel',
      type: 'text',
      defaultValue: '€',
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Знижка у відсотках',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'productLink',
      type: 'text',
      unique: true,
      admin: {
        description: 'URL slug для продукту (автогенерується)',
        readOnly: true,
      },
    },
    {
      name: 'shortInfo',
      type: 'textarea',
      admin: {
        description: 'Короткий опис продукту',
      },
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Головне зображення продукту',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description: 'Додаткові зображення продукту',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'mainCharacteristics',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'display',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'dimensions',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'camera',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'battery',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'hardware',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'connectivity',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
    {
      name: 'energy',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'value',
          type: 'text',
        },
        {
          name: 'key',
          type: 'text',
        },
      ],
    },
  ],
}