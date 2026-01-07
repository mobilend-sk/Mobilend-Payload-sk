// src/app/blog/[slug]/page.js
// Страница отдельной статьи блога с данными из Payload CMS

import { notFound } from 'next/navigation'
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog'
import ArticlePage from '@/pages/ArticlePage/ArticlePage'

// ISR - ревалідація кожну 1 годину
export const revalidate = 3600

// Генерація статичних шляхів для всіх статей
export async function generateStaticParams() {
	try {
		console.log('🔄 Генеруємо статичні шляхи для блог статей з Payload...')

		const slugs = await getAllBlogSlugs()

		if (!slugs || !Array.isArray(slugs)) {
			console.warn('⚠️ Некоректні slugs від Payload')
			return []
		}

		console.log(`✅ Знайдено ${slugs.length} блог статей для генерації`)

		return slugs.map((slug) => ({
			slug: slug,
		}))
	} catch (error) {
		console.error('❌ Помилка генерації статичних шляхів блога:', error)
		return []
	}
}

// Генерація мета-даних для кожної статті
export async function generateMetadata({ params }) {
	try {
		const { slug } = await params
		
		console.log(`🔄 Генеруємо metadata для slug: ${slug}`)
		
		const post = await getBlogPostBySlug(slug)

		if (!post) {
			console.warn(`⚠️ Пост не знайдено для metadata: ${slug}`)
			return {
				title: 'Článok sa nenašiel - Mobilend Blog',
				description: 'Požadovaný článok sa nenašiel v našom blogu.'
			}
		}

		// Визначаємо зображення для OpenGraph
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'
		const ogImage = post.image
			? (post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`)
			: `${baseUrl}/images/blog/default-blog.jpg`

		// Використовуємо SEO дані якщо є
		const metaTitle = post.seo?.metaTitle || `${post.title} | Mobilend Blog`
		const metaDescription = post.seo?.metaDescription || post.description || post.excerpt || post.title
		const keywords = post.seo?.keywords || (post.categories && Array.isArray(post.categories) ? post.categories.join(', ') : '')

		console.log(`✅ Metadata згенеровано для: ${post.title}`)

		return {
			title: metaTitle,
			description: metaDescription,
			keywords: keywords || post.categories || [],

			// Open Graph теги
			openGraph: {
				title: post.title,
				description: metaDescription,
				type: 'article',
				url: `${baseUrl}/blog/${slug}`,
				siteName: 'Mobilend',
				locale: 'sk_SK',
				images: [
					{
						url: ogImage,
						width: 1200,
						height: 630,
						alt: post.title,
					}
				],
				publishedTime: post.date,
				modifiedTime: post.updatedAt || post.date,
				authors: [post.author || 'Mobilend Team'],
				section: Array.isArray(post.categories) && post.categories.length > 0 
					? (typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0].category)
					: 'Technology',
				tags: post.categories || [],
			},

			// Twitter Card
			twitter: {
				card: 'summary_large_image',
				title: post.title,
				description: metaDescription,
				images: [ogImage],
				creator: '@mobilend_sk',
			},

			// Article теги
			other: {
				'article:published_time': post.date,
				'article:modified_time': post.updatedAt || post.date,
				'article:author': post.author || 'Mobilend Team',
				'article:section': Array.isArray(post.categories) && post.categories.length > 0 
					? (typeof post.categories[0] === 'string' ? post.categories[0] : post.categories[0].category)
					: 'Technology',
				'article:tag': Array.isArray(post.categories) ? post.categories.join(', ') : '',
			},

			// Robots
			robots: {
				index: true,
				follow: true,
				googleBot: {
					index: true,
					follow: true,
					'max-video-preview': -1,
					'max-image-preview': 'large',
					'max-snippet': -1,
				},
			},

			// Canonical URL
			alternates: {
				canonical: `${baseUrl}/blog/${slug}`,
			},
		}
	} catch (error) {
		console.error('❌ Помилка генерації метаданих для статті:', error)
		return {
			title: 'Chyba načítania článku - Mobilend Blog'
		}
	}
}

export default async function BlogPost({ params }) {
	try {
		const { slug } = await params

		console.log(`🔄 Завантаження статті з slug: ${slug}`)

		// Отримуємо статтю по slug з Payload CMS
		const post = await getBlogPostBySlug(slug)

		// Якщо стаття не знайдена - показуємо 404
		if (!post) {
			console.warn(`⚠️ Стаття з slug "${slug}" не знайдена`)
			notFound()
		}

		console.log(`✅ Стаття завантажена: ${post.title}`)

		// Отримуємо схожі статті (виключаємо поточну)
		const relatedPosts = await getRelatedBlogPosts(slug, 4)

		console.log(`✅ Знайдено ${relatedPosts.length} схожих статей`)

		// Передаємо дані в компонент
		return <ArticlePage post={post} relatedPosts={relatedPosts} />

	} catch (error) {
		console.error('❌ Помилка завантаження сторінки статті:', error)
		notFound()
	}
}