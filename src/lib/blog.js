// src/lib/blog.js
// Серверні утиліти для роботи з блогом через Payload CMS (textarea version)
// Повна сумісність зі старим API на файлах!

import { marked } from 'marked'

// Payload API URL - ВАЖЛИВО: використовуємо абсолютний URL для серверних запитів
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_ENDPOINT = `${PAYLOAD_API_URL}/api/blog` // назва вашої колекції

// ============================================
// УТИЛІТИ (як раніше)
// ============================================

// Форматирование даты для отображения
export function formatBlogDate(dateString, locale = 'sk-SK') {
	if (!dateString) return ''

	try {
		const date = new Date(dateString)
		return date.toLocaleDateString(locale, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	} catch (error) {
		console.error('Ошибка форматирования даты:', error)
		return dateString
	}
}

// Создать excerpt (краткое описание) из контента
export function createExcerpt(content, maxLength = 150) {
	if (!content) return ''

	// Убираем markdown разметку и HTML теги
	const plainText = content
		.replace(/#{1,6}\s+/g, '') // заголовки
		.replace(/\*\*(.*?)\*\*/g, '$1') // жирный текст
		.replace(/\*(.*?)\*/g, '$1') // курсив
		.replace(/\[(.*?)\]\(.*?\)/g, '$1') // ссылки
		.replace(/<[^>]*>/g, '') // HTML теги
		.trim()

	// Обрезаем до нужной длины
	if (plainText.length <= maxLength) return plainText

	const truncated = plainText.substring(0, maxLength)
	const lastSpace = truncated.lastIndexOf(' ')

	return lastSpace > 0
		? truncated.substring(0, lastSpace) + '...'
		: truncated + '...'
}

// Рендер markdown в HTML
export function markdownToHtml(markdown) {
	if (!markdown) return ''

	try {
		// Перевіряємо що це string
		if (typeof markdown !== 'string') {
			console.error('❌ markdownToHtml: markdown не є string:', typeof markdown, markdown)
			return ''
		}

		const html = marked(markdown)
		console.log('✅ markdownToHtml успішно:', html.substring(0, 100) + '...')
		return html
	} catch (error) {
		console.error('❌ Ошибка рендера markdown:', error)
		return typeof markdown === 'string' ? markdown : ''
	}
}

// Предобработка поста для компонентов (як раніше!)
function processPostForComponents(post) {
	if (!post) return null

	return {
		...post,
		formattedDate: formatBlogDate(post.date),
		excerpt: post.description || createExcerpt(post.content, 120),
		htmlContent: markdownToHtml(post.content)
	}
}

// ============================================
// PAYLOAD API FUNCTIONS
// ============================================

// Внутрішня функція для fetch з Payload
async function fetchFromPayload(url) {
	try {
		console.log('🔍 Fetching from Payload:', url)
		
		const response = await fetch(url, {
			cache: 'no-store', // або 'force-cache' для статичної генерації
			headers: {
				'Content-Type': 'application/json',
			}
		})

		if (!response.ok) {
			console.error(`❌ HTTP error! status: ${response.status}`)
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		console.log('✅ Дані отримано:', data?.docs?.length || 0, 'постів')
		
		return data
	} catch (error) {
		console.error('❌ Помилка завантаження з Payload:', error)
		return { docs: [] } // Повертаємо порожній масив замість null
	}
}

// ============================================
// ПУБЛІЧНІ ФУНКЦІЇ (сумісні зі старим API!)
// ============================================

// Получить все MD файлы из папки блога (тепер з Payload)
export async function getAllBlogFiles() {
	try {
		const data = await fetchFromPayload(`${API_ENDPOINT}?limit=1000`)
		
		if (!data || !data.docs || !Array.isArray(data.docs)) {
			console.warn('⚠️ Некоректна відповідь від Payload')
			return []
		}

		// Повертаємо масив "файлів" (slug.md для сумісності)
		return data.docs.map(post => `${post.slug}.md`)
	} catch (error) {
		console.error('Ошибка получения списка постов:', error)
		return []
	}
}

// Получить содержимое MD файла (тепер з Payload по slug)
export async function getBlogPost(filename) {
	try {
		// Витягуємо slug з filename (example-post.md -> example-post)
		const slug = filename.replace('.md', '')

		const data = await fetchFromPayload(
			`${API_ENDPOINT}?where[slug][equals]=${slug}&limit=1`
		)

		if (!data || !data.docs || data.docs.length === 0) {
			console.warn(`⚠️ Пост не найден: ${filename}`)
			return null
		}

		const post = data.docs[0]

		// Проверяем обязательные поля
		if (!post.title || !post.slug) {
			console.warn(`⚠️ Отсутствуют обязательные поля в ${filename}`)
			return null
		}

		// Обробка content (з textarea це вже string)
		const contentText = post.content || ''

		// Обробка categories (якщо це масив об'єктів)
		let categoryValue = ''
		let tagsArray = []
		let categoriesArray = [] // Масив рядків для categories
		
		if (post.categories && Array.isArray(post.categories)) {
			// Витягуємо текст з кожної категорії
			categoriesArray = post.categories.map(cat => {
				if (typeof cat === 'string') return cat
				if (typeof cat === 'object' && cat !== null) {
					return cat.category || cat.name || ''
				}
				return ''
			}).filter(Boolean)
			
			// Перша категорія як основна
			categoryValue = categoriesArray[0] || ''
			
			// Всі категорії як теги
			tagsArray = [...categoriesArray]
		}

		// Обробка image
		let imageUrl = post.image || ''
		if (typeof imageUrl === 'object' && imageUrl !== null) {
			imageUrl = imageUrl.url || imageUrl.filename || ''
		}

		// Повертаємо в старому форматі!
		return {
			title: post.title,
			slug: post.slug,
			date: post.date,
			description: post.description || '',
			content: contentText, // З textarea це вже string
			author: post.author || '',
			category: categoryValue, // Перша категорія як string
			tags: tagsArray, // Всі категорії як array of strings
			categories: categoriesArray, // Масив рядків категорій
			featured: post.featured || false,
			coverImage: imageUrl,
			image: imageUrl,
			filename: filename,
			id: post.id
		}
	} catch (error) {
		console.error(`Ошибка чтения поста ${filename}:`, error)
		return null
	}
}

// Получить статью по slug (с предобработкой) - БЕЗ ЗМІН!
export async function getBlogPostBySlug(slug) {
	const files = await getAllBlogFiles()

	for (const file of files) {
		const post = await getBlogPost(file)
		if (post && post.slug === slug) {
			return processPostForComponents(post)
		}
	}

	return null
}

// Получить все статьи с сортировкой по дате (с предобработкой) - БЕЗ ЗМІН!
export async function getAllBlogPosts(limit = null) {
	try {
		const files = await getAllBlogFiles()
		
		if (!Array.isArray(files) || files.length === 0) {
			console.warn('⚠️ Немає постів для обробки')
			return []
		}

		const posts = []

		for (const file of files) {
			const post = await getBlogPost(file)
			if (post) {
				posts.push(processPostForComponents(post))
			}
		}

		// Перевіряємо чи posts це масив
		if (!Array.isArray(posts)) {
			console.error('❌ posts не є масивом!')
			return []
		}

		// Сортируем по дате (новые сверху)
		posts.sort((a, b) => {
			const dateA = new Date(a.date || 0)
			const dateB = new Date(b.date || 0)
			return dateB - dateA
		})

		// Ограничиваем количество если нужно
		const result = limit ? posts.slice(0, limit) : posts
		
		console.log('✅ getAllBlogPosts повертає:', result.length, 'постів')
		
		return result
	} catch (error) {
		console.error('❌ Помилка в getAllBlogPosts:', error)
		return []
	}
}

// Получить все slug для generateStaticParams - БЕЗ ЗМІН!
export async function getAllBlogSlugs() {
	try {
		const posts = await getAllBlogPosts()
		
		if (!Array.isArray(posts)) {
			console.error('❌ getAllBlogSlugs: posts не є масивом')
			return []
		}
		
		const slugs = posts.map(post => post.slug).filter(Boolean)
		console.log('✅ getAllBlogSlugs повертає:', slugs.length, 'slugs')
		
		return slugs
	} catch (error) {
		console.error('❌ Помилка в getAllBlogSlugs:', error)
		return []
	}
}

// Получить рекомендуемые статьи (исключая текущую) - БЕЗ ЗМІН!
export async function getRelatedBlogPosts(currentSlug, limit = 4) {
	const allPosts = await getAllBlogPosts()

	// Исключаем текущую статью
	const relatedPosts = allPosts.filter(post => post.slug !== currentSlug)

	// Возвращаем ограниченное количество
	return relatedPosts.slice(0, limit)
}

// ============================================
// ДОДАТКОВІ ОПТИМІЗОВАНІ ФУНКЦІЇ (швидше!)
// ============================================

// Прямий запит до Payload (швидше ніж через getAllBlogFiles)
export async function getBlogPostBySlugDirect(slug) {
	try {
		const data = await fetchFromPayload(
			`${API_ENDPOINT}?where[slug][equals]=${slug}&limit=1`
		)

		if (!data || !data.docs || data.docs.length === 0) {
			return null
		}

		const post = data.docs[0]

		// Обробка як у getBlogPost
		const contentText = post.content || ''

		let categoryValue = ''
		let tagsArray = []
		let categoriesArray = []
		
		if (post.categories && Array.isArray(post.categories)) {
			categoriesArray = post.categories.map(cat => {
				if (typeof cat === 'string') return cat
				if (typeof cat === 'object' && cat !== null) {
					return cat.category || cat.name || ''
				}
				return ''
			}).filter(Boolean)
			
			categoryValue = categoriesArray[0] || ''
			tagsArray = [...categoriesArray]
		}

		let imageUrl = post.image || ''
		if (typeof imageUrl === 'object' && imageUrl !== null) {
			imageUrl = imageUrl.url || imageUrl.filename || ''
		}

		const processedPost = {
			...post,
			content: contentText,
			category: categoryValue,
			tags: tagsArray,
			categories: categoriesArray, // Масив рядків
			coverImage: imageUrl,
			image: imageUrl
		}

		return processPostForComponents(processedPost)
	} catch (error) {
		console.error('Помилка отримання поста:', error)
		return null
	}
}

// Прямий запит всіх постів (швидше)
export async function getAllBlogPostsDirect(limit = null) {
	try {
		const limitParam = limit ? `&limit=${limit}` : '&limit=1000'
		const data = await fetchFromPayload(
			`${API_ENDPOINT}?sort=-date${limitParam}`
		)

		if (!data || !data.docs) return []

		return data.docs.map(post => {
			const contentText = post.content || ''

			let categoryValue = ''
			let tagsArray = []
			let categoriesArray = []
			
			if (post.categories && Array.isArray(post.categories)) {
				categoriesArray = post.categories.map(cat => {
					if (typeof cat === 'string') return cat
					if (typeof cat === 'object' && cat !== null) {
						return cat.category || cat.name || ''
					}
					return ''
				}).filter(Boolean)
				
				categoryValue = categoriesArray[0] || ''
				tagsArray = [...categoriesArray]
			}

			let imageUrl = post.image || ''
			if (typeof imageUrl === 'object' && imageUrl !== null) {
				imageUrl = imageUrl.url || imageUrl.filename || ''
			}

			const processedPost = {
				...post,
				content: contentText,
				category: categoryValue,
				tags: tagsArray,
				categories: categoriesArray, // Масив рядків
				coverImage: imageUrl,
				image: imageUrl
			}

			return processPostForComponents(processedPost)
		})
	} catch (error) {
		console.error('Помилка завантаження постів:', error)
		return []
	}
}

// Прямий запит slug (швидше для generateStaticParams)
export async function getAllBlogSlugsDirect() {
	try {
		const data = await fetchFromPayload(
			`${API_ENDPOINT}?limit=1000`
		)

		if (!data || !data.docs) return []

		return data.docs.map(post => post.slug).filter(Boolean)
	} catch (error) {
		console.error('Помилка отримання slugs:', error)
		return []
	}
}