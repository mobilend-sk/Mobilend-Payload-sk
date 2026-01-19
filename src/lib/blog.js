// src/lib/blog.js
// Серверні утиліти для роботи з блогом через Payload CMS (textarea version)
import 'dotenv/config'
import { marked } from 'marked'

// ✅ ВИПРАВЛЕНО: Правильний URL для Vercel
const getBaseUrl = () => {
	if (process.env.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL
	}
	return 'http://localhost:3000'
}

const PAYLOAD_API_URL = getBaseUrl()
const API_ENDPOINT = `${PAYLOAD_API_URL}/api/blog`

console.log('🔧 Blog API URL:', API_ENDPOINT)

// ============================================
// HELPER: Обробка image з Payload
// ============================================
function processImageField(imageField) {
	if (!imageField) return ''

	// Якщо це string
	if (typeof imageField === 'string') {
		// Перевіряємо чи це валідний URL або шлях
		if (imageField.includes('/') || imageField.startsWith('http')) {
			return imageField
		}
		// Якщо це просто slug - ігноруємо
		console.warn(`⚠️ Image є slug, не URL: ${imageField}`)
		return ''
	}

	// Якщо це об'єкт
	if (typeof imageField === 'object' && imageField !== null) {
		// Спробуємо різні поля
		let url = imageField.url || imageField.filename || imageField.src || ''
		
		// Додаємо базовий URL якщо потрібно
		if (url && !url.startsWith('http') && !url.startsWith('/')) {
			url = `${PAYLOAD_API_URL}/${url}`
		} else if (url && url.startsWith('/')) {
			url = `${PAYLOAD_API_URL}${url}`
		}
		
		return url
	}

	return ''
}

// ============================================
// УТИЛІТИ
// ============================================

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

export function createExcerpt(content, maxLength = 150) {
	if (!content) return ''

	const plainText = content
		.replace(/#{1,6}\s+/g, '')
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/\*(.*?)\*/g, '$1')
		.replace(/\[(.*?)\]\(.*?\)/g, '$1')
		.replace(/<[^>]*>/g, '')
		.trim()

	if (plainText.length <= maxLength) return plainText

	const truncated = plainText.substring(0, maxLength)
	const lastSpace = truncated.lastIndexOf(' ')

	return lastSpace > 0
		? truncated.substring(0, lastSpace) + '...'
		: truncated + '...'
}

export function markdownToHtml(markdown) {
	if (!markdown) return ''

	try {
		if (typeof markdown !== 'string') {
			console.error('❌ markdownToHtml: markdown не є string:', typeof markdown)
			return ''
		}

		const html = marked(markdown)
		return html
	} catch (error) {
		console.error('❌ Ошибка рендера markdown:', error)
		return typeof markdown === 'string' ? markdown : ''
	}
}

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

async function fetchFromPayload(url) {
	try {
		console.log('🔍 Fetching from Payload:', url)

		const response = await fetch(url, {
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
			signal: AbortSignal.timeout(10000)
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`❌ HTTP error! status: ${response.status}`, errorText)
			return { docs: [], totalDocs: 0 }
		}

		const data = await response.json()
		console.log('✅ Дані отримано:', data?.docs?.length || 0, 'постів')

		return data
	} catch (error) {
		console.error('❌ Помилка завантаження з Payload:', error.message)
		return { docs: [], totalDocs: 0 }
	}
}

// ============================================
// ПУБЛІЧНІ ФУНКЦІЇ
// ============================================

export async function getAllBlogFiles() {
	try {
		const data = await fetchFromPayload(`${API_ENDPOINT}?limit=1000`)

		if (!data || !data.docs || !Array.isArray(data.docs)) {
			console.warn('⚠️ Некоректна відповідь від Payload')
			return []
		}

		return data.docs.map(post => `${post.slug}.md`)
	} catch (error) {
		console.error('Ошибка получения списка постов:', error)
		return []
	}
}

export async function getBlogPost(filename) {
	try {
		const slug = filename.replace('.md', '')

		const data = await fetchFromPayload(
			`${API_ENDPOINT}?where[slug][equals]=${slug}&limit=1`
		)

		if (!data || !data.docs || data.docs.length === 0) {
			console.warn(`⚠️ Пост не найден: ${filename}`)
			return null
		}

		const post = data.docs[0]

		if (!post.title || !post.slug) {
			console.warn(`⚠️ Отсутствуют обязательные поля в ${filename}`)
			return null
		}

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

		// ✅ Використовуємо helper функцію
		const imageUrl = processImageField(post.image)

		return {
			title: post.title,
			slug: post.slug,
			date: post.date,
			description: post.description || '',
			content: contentText,
			author: post.author || '',
			category: categoryValue,
			tags: tagsArray,
			categories: categoriesArray,
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

		if (!Array.isArray(posts)) {
			console.error('❌ posts не є масивом!')
			return []
		}

		posts.sort((a, b) => {
			const dateA = new Date(a.date || 0)
			const dateB = new Date(b.date || 0)
			return dateB - dateA
		})

		const result = limit ? posts.slice(0, limit) : posts

		console.log('✅ getAllBlogPosts повертає:', result.length, 'постів')

		return result
	} catch (error) {
		console.error('❌ Помилка в getAllBlogPosts:', error)
		return []
	}
}

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

export async function getRelatedBlogPosts(currentSlug, limit = 4) {
	const allPosts = await getAllBlogPosts()
	const relatedPosts = allPosts.filter(post => post.slug !== currentSlug)
	return relatedPosts.slice(0, limit)
}

// ============================================
// ОПТИМІЗОВАНІ ФУНКЦІЇ
// ============================================

export async function getBlogPostBySlugDirect(slug) {
	try {
		const data = await fetchFromPayload(
			`${API_ENDPOINT}?where[slug][equals]=${slug}&limit=1`
		)

		if (!data || !data.docs || data.docs.length === 0) {
			return null
		}

		const post = data.docs[0]
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

		const imageUrl = processImageField(post.image)

		const processedPost = {
			...post,
			content: contentText,
			category: categoryValue,
			tags: tagsArray,
			categories: categoriesArray,
			coverImage: imageUrl,
			image: imageUrl
		}

		return processPostForComponents(processedPost)
	} catch (error) {
		console.error('Помилка отримання поста:', error)
		return null
	}
}

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

			const imageUrl = processImageField(post.image)

			const processedPost = {
				...post,
				content: contentText,
				category: categoryValue,
				tags: tagsArray,
				categories: categoriesArray,
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