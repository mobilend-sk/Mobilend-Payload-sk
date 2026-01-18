// src/app/sitemap.js
// Автоматическая генерация sitemap.xml

import { getAllBlogSlugs } from '@/lib/blog'

// Получаем все продукты (если есть сервис)
async function getAllProductLinks() {
	try {
		// Импортируем динамически чтобы избежать ошибок если сервиса нет
		const productService = await import('@/services/productServer.service')
		return await productService.default.getAllProductLinks()
	} catch (error) {
		console.warn('Product service not found, skipping products in sitemap')
		return []
	}
}

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	// Получаем данные
	const blogSlugs = getAllBlogSlugs()
	const productLinks = await getAllProductLinks()

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
	const productPages = productLinks.map((productLink) => ({
		url: `${baseUrl}/katalog/${productLink}`,
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