// app/katalog/[productLink]/page.js
// Сторінка товару з ISR

import { notFound } from 'next/navigation'
import ProductPage from "@/pages/ProductPage/ProductPage"
import productServiceServer from "@/services/productServer.service"

// Генерація статичних путей для популярних товарів
export async function generateStaticParams() {
  try {
    console.log('🔄 Генерація статичних шляхів для популярних товарів...')

    // Отримуємо популярні товари для першої генерації
    const popularProducts = await productServiceServer.getPopularProducts(50)
    
    console.log(`✅ Згенеровано ${popularProducts.length} статичних шляхів`)

    return popularProducts.map(product => ({
      productLink: product.productLink
    }))
  } catch (error) {
    console.error('❌ Помилка генерації статичних шляхів:', error)
    return []
  }
}

// ISR налаштування
export const revalidate = 3600 // Ревалідація кожну годину
export const dynamicParams = true // Дозволяємо динамічну генерацію нових сторінок

// Генерація мета-даних
export async function generateMetadata({ params }) {
  try {
    const { productLink } = await params

    const product = await productServiceServer.getProductInfo(productLink)

    if (!product) {
      return {
        title: 'Produkt sa nenašiel - Mobilend.sk',
        description: 'Požadovaný produkt sa nenašiel v našom katalógu.'
      }
    }

    // Розрахунок ціни зі знижкою
    const price = product.discount && product.price
      ? (product.price * (1 - product.discount / 100)).toFixed(0)
      : product.price?.toFixed(0) || 'Уточнити'

    // Визначення зображення
    let ogImage = null
    if (product.mainImage && product.baseImageUrl) {
      ogImage = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}${product.baseImageUrl}/${product.mainImage}`
    }

    const title = `${product.model} ${product.memory ? `${product.memory}` : ''} - €${price} | Mobilend.sk`
    const description = `${product.model} ${product.memory ? `s ${product.memory} pamäťou` : ''} za €${price}. ${product.shortInfo || 'Kvalitný mobilný telefón s rýchlym doručením.'}`

    return {
      title,
      description,

      keywords: [
        product.model,
        product.modelGroup,
        product.phone,
        product.memory,
        product.color,
        'mobilný telefón',
        'kúpiť online',
        'slovensko'
      ].filter(Boolean),

      openGraph: {
        title: `${product.model} - €${price}`,
        description,
        type: 'website',
        images: ogImage ? [{
          url: ogImage,
          width: 800,
          height: 800,
          alt: product.model
        }] : [],
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/katalog/${productLink}`,
        siteName: 'Mobilend',
        locale: 'sk_SK'
      },

      twitter: {
        card: 'summary_large_image',
        title: `${product.model} - €${price}`,
        description,
        images: ogImage ? [ogImage] : []
      },

      // Structured data для Google Shopping
      other: {
        'product:price:amount': price,
        'product:price:currency': product.currency || 'EUR',
        'product:availability': product.price ? 'in stock' : 'out of stock',
        'product:condition': 'new'
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      },

      alternates: {
        canonical: `https://mobilend.sk/katalog/${productLink}`
      }
    }
  } catch (error) {
    console.error('❌ Помилка генерації метаданих:', error)
    return {
      title: 'Chyba načítania produktu - Mobilend.sk',
      description: 'Produkt sa nenašiel alebo došlo k chybe.'
    }
  }
}

// Головний компонент
export default async function KatalogProductPage({ params }) {
  try {
    const { productLink } = await params

    console.log(`📦 Завантаження товару: ${productLink}`)

    // Отримуємо дані на сервері
    const product = await productServiceServer.getProductInfo(productLink)

    if (!product) {
      console.warn(`⚠️ Товар "${productLink}" не знайдено`)
      notFound()
    }

    console.log(`✅ Товар завантажено: ${product.model}`)

    // Передаємо дані в компонент
    return <ProductPage product={product} productLink={productLink} />

  } catch (error) {
    console.error('❌ Помилка завантаження сторінки товару:', error)
    notFound()
  }
}