// src/app/(frontend)/sitemap.js
// Автоматическая генерация sitemap.xml
import 'dotenv/config'

// Получаем все посты блога из Payload API
async function getAllBlogSlugs() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
		console.log('🔍 Fetching blog posts from:', `${baseUrl}/api/blog?limit=1000&depth=0`)
		
		const response = await fetch(`${baseUrl}/api/blog?limit=1000&depth=0`, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			}
		})
		
		if (!response.ok) {
			console.warn('❌ Failed to fetch blog posts:', response.status)
			return []
		}
		
		const data = await response.json()
		
		// Возвращаем массив slug-ов
		const slugs = data.docs?.map(post => post.slug).filter(Boolean) || []
		console.log('✅ Blog posts fetched:', slugs.length)
		
		return slugs
	} catch (error) {
		console.warn('❌ Error fetching blog posts:', error.message)
		return []
	}
}

// Получаем все продукты
async function getAllProductSlugs() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
		console.log('🔍 Fetching products from:', `${baseUrl}/api/products?limit=1000&depth=0`)
		
		const response = await fetch(`${baseUrl}/api/products?limit=1000&depth=0`, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			}
		})
		
		if (!response.ok) {
			console.warn('❌ Failed to fetch products:', response.status)
			return []
		}
		
		const data = await response.json()
		
		// ВАЖЛИВО: У Products поле називається productLink, а не slug!
		const slugs = data.docs?.map(product => product.productLink).filter(Boolean) || []
		console.log('✅ Products fetched:', slugs.length)
		console.log('📦 Sample product slugs:', slugs.slice(0, 3))
		
		return slugs
	} catch (error) {
		console.warn('❌ Error fetching products:', error.message)
		return []
	}
}

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	// Получаем данные
	const blogSlugs = await getAllBlogSlugs()
	const productSlugs = await getAllProductSlugs()

	console.log('📊 Slugs retrieved:', { 
		blog: blogSlugs.length, 
		products: productSlugs.length 
	})

	// Базовые страницы (статические)
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		},
		{
			url: `${baseUrl}/katalog`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.9,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/caste-otazky`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: `${baseUrl}/o-nas`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: `${baseUrl}/kontakt`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.6,
		},
	]

	// Страницы блога (динамические)
	const blogPages = blogSlugs.map((slug) => ({
		url: `${baseUrl}/blog/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.7,
	}))

	// Страницы товаров (динамические)
	const productPages = productSlugs.map((slug) => ({
		url: `${baseUrl}/katalog/${slug}`,
		lastModified: new Date(),
		changeFrequency: 'weekly',
		priority: 0.8,
	}))

	// Объединяем все страницы
	const allPages = [
		...staticPages,
		...blogPages,
		...productPages,
	]

	console.log(`📋 Sitemap generated with ${allPages.length} pages:`)
	console.log(`   📄 Static: ${staticPages.length}`)
	console.log(`   📝 Blog: ${blogPages.length}`)
	console.log(`   📱 Products: ${productPages.length}`)

	return allPages
}

// Конфигурация для ISR (обновляется каждый час)
export const revalidate = 3600