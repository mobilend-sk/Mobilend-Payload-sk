// app/katalog/page.js
// Сторінка каталогу з ISR та SSR

import CatalogList from '@/pages/CatalogPage/CatalogList/CatalogList'
import productServiceServer from '@/services/productServer.service'

// ISR налаштування
export const revalidate = 3600 // Кешувати на 1 годину
export const dynamic = 'force-static'

// Генерація метаданих
export async function generateMetadata() {
  return {
    title: 'Katalóg mobilných telefónov - Mobilend.sk | iPhone, Samsung',
    description: 'Kompletný katalóg mobilných telefónov. iPhone, Samsung Galaxy a ďalšie značky za najlepšie ceny s doručením zadarmo.',
    
    keywords: [
      'katalóg telefónov',
      'mobilné telefóny',
      'iPhone katalóg',
      'Samsung katalóg',
      'porovnanie cien'
    ],

    openGraph: {
      title: 'Katalóg telefónov - Mobilend',
      description: 'Kompletný katalóg mobilných telefónov za najlepšie ceny',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/katalog`,
      siteName: 'Mobilend',
      locale: 'sk_SK',
      images: [{
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og-catalog.jpg`,
        width: 1200,
        height: 630,
        alt: 'Katalóg mobilných telefónov'
      }]
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Katalóg telefónov - Mobilend',
      description: 'Kompletný výber mobilných telefónov',
      images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og-catalog.jpg`]
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    alternates: {
      canonical: 'https://mobilend.sk/katalog'
    }
  }
}

// Головний компонент - SSR з передачею даних
export default async function KatalogPage({ searchParams }) {
  try {
    // Розпаковуємо searchParams (Next.js 15)
    const params = await searchParams
    const initialSearchTerm = params?.search || ''

    // Завантажуємо продукти на сервері
    const products = await productServiceServer.getAllProducts()

    console.log(`📦 Завантажено ${products.length} продуктів для каталогу`)

    // Передаємо дані в клієнтський компонент
    return (
      <CatalogList
        showFilters={true}
        initialSearchTerm={initialSearchTerm}
        initialProducts={products}
      />
    )
  } catch (error) {
    console.error('❌ Помилка завантаження каталогу:', error)
    
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>Chyba načítania katalógu</h1>
        <p>Skúste prosím obnoviť stránku</p>
      </div>
    )
  }
}