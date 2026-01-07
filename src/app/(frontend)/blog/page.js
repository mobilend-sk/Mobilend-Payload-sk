// src/app/blog/page.js
// Главная страница блога с данными из Payload CMS

import { getAllBlogPosts } from '@/lib/blog'
import BlogPage from '@/pages/BlogPage/BlogPage'

// ISR - ревалідація кожну 1 годину
export const revalidate = 3600

// Генерація мета-даних для SEO
export async function generateMetadata() {
	return {
		title: 'Blog - Mobilend | Novinky a tipy o mobilných telefónoch',
		description: 'Najnovšie články o mobilných telefónoch, recenzie, porovnania a tipy. Držte sa v obraze s najnovšími trendmi vo svete smartfónov.',

		keywords: [
			'blog mobilné telefóny',
			'recenzie smartfónov',
			'novinky telefóny',
			'tipy mobilné zariadenia',
			'porovnania telefónov',
			'technológie blog',
			'iPhone články',
			'Samsung blog'
		],

		// Open Graph
		openGraph: {
			title: 'Blog - Mobilend | Najnovšie o mobilných telefónoch',
			description: 'Prečítajte si najnovšie články o smartfónoch, recenzie a užitočné tipy od expertov na mobilné technológie.',
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/blog`,
			siteName: 'Mobilend',
			locale: 'sk_SK',
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/blog/og-blog.jpg`,
					width: 1200,
					height: 630,
					alt: 'Mobilend Blog - Články o mobilných telefónoch',
				}
			],
		},

		// Twitter Card
		twitter: {
			card: 'summary_large_image',
			title: 'Blog - Mobilend',
			description: 'Najnovšie články a recenzie mobilných telefónov.',
			images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/blog/og-blog.jpg`],
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
			canonical: 'https://mobilend.sk/blog',
		},

		// Додаткові meta tags
		other: {
			'theme-color': '#ffffff',
		},
	}
}

export default async function Blog() {
	try {
		console.log('🔄 Завантаження блог сторінки з Payload CMS...')

		// Отримуємо всі статті блога з Payload CMS (ISR - ревалідується кожні 60 секунд)
		const allPosts = await getAllBlogPosts()

		// Перевіряємо чи є пости
		if (!allPosts || !Array.isArray(allPosts)) {
			console.warn('⚠️ Немає постів або некоректний формат даних')
			return <BlogPage allPosts={[]} />
		}

		console.log(`✅ Завантажено ${allPosts.length} постів для блог сторінки`)

		// Передаємо дані в компонент
		return <BlogPage allPosts={allPosts} />
		
	} catch (error) {
		console.error('❌ Помилка завантаження блог сторінки:', error)
		
		// Fallback: показуємо порожню сторінку при помилці
		return <BlogPage allPosts={[]} />
	}
}