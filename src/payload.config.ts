import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Blog } from './collections/Blog'
import { Orders } from './collections/Orders'
import { Transactions } from './collections/Transactions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Blog, Orders, Transactions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ['products', 'blog'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => doc?.title || 'Mobilend.sk',
      generateURL: ({ doc, collectionConfig }: any) => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

        if (collectionConfig?.slug === 'products') {
          return `${baseUrl}/katalog/${doc.slug}`
        }
        if (collectionConfig?.slug === 'blog') {
          return `${baseUrl}/blog/${doc.slug}`
        }
        return baseUrl
      },
    }),
  ],
})