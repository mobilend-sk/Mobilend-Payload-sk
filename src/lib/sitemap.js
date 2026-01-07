// src/lib/sitemap.js
// Утилиты для работы с sitemap

// Функция для определения приоритета страницы
export function getPagePriority(url) {
	if (url === '/') return 1.0
	if (url.includes('/katalog/')) return 0.8
	if (url === '/katalog') return 0.9
	if (url === '/blog') return 0.8
	if (url.includes('/blog/')) return 0.7
	if (url === '/caste-otazky') return 0.7
	return 0.6
}

// Функция для определения частоты обновления
export function getChangeFrequency(url) {
	if (url === '/') return 'daily'
	if (url.includes('/katalog')) return 'daily'
	if (url.includes('/blog')) return 'weekly'
	if (url === '/caste-otazky') return 'monthly'
	return 'monthly'
}

// Функция для создания sitemap entry
export function createSitemapEntry(url, baseUrl, lastModified = new Date()) {
	return {
		url: `${baseUrl}${url}`,
		lastModified,
		changeFrequency: getChangeFrequency(url),
		priority: getPagePriority(url),
	}
}

// Функция для валидации URL
export function isValidUrl(url) {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

// Функция для логирования статистики sitemap
export function logSitemapStats(pages) {
	const stats = {
		total: pages.length,
		static: pages.filter(p => !p.url.includes('/katalog/') && !p.url.includes('/blog/')).length,
		products: pages.filter(p => p.url.includes('/katalog/')).length,
		blog: pages.filter(p => p.url.includes('/blog/')).length,
	}

	console.log('📊 Sitemap Statistics:')
	console.log(`   📄 Total pages: ${stats.total}`)
	console.log(`   🏠 Static pages: ${stats.static}`)
	console.log(`   📱 Product pages: ${stats.products}`)
	console.log(`   📝 Blog pages: ${stats.blog}`)

	return stats
}