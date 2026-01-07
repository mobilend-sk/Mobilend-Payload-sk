// src/app/caste-otazky/page.js
// Страница часто задаваемых вопросов

import { faqData } from '@/data/faq'
import FAQPage from '@/pages/FAQPage/FAQPage'

// Генерация мета-данных для SEO
export async function generateMetadata() {
	return {
		title: 'Často kladené otázky - Mobilend | Odpovede na vaše otázky',
		description: 'Nájdite odpovede na najčastejšie otázky o nákupe mobilných telefónov, záruke, doručení a vrátení tovaru v našom obchode Mobilend.',

		keywords: [
			'často kladené otázky',
			'FAQ mobilend',
			'otázky o mobilných telefónoch',
			'záruka telefóny',
			'doručenie mobilov',
			'vrátenie telefónu',
			'nákup na splátky',
			'kontakt mobilend'
		],

		// Open Graph
		openGraph: {
			title: 'Často kladené otázky - Mobilend',
			description: 'Odpovede na najčastejšie otázky o nákupe mobilných telefónov, záruke a doručení.',
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/caste-otazky`,
			siteName: 'Mobilend',
			locale: 'sk_SK',
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og-faq.jpg`,
					width: 1200,
					height: 630,
					alt: 'Mobilend - Často kladené otázky',
				}
			],
		},

		// Twitter Card
		twitter: {
			card: 'summary_large_image',
			title: 'FAQ - Mobilend',
			description: 'Odpovede na najčastejšie otázky o mobilných telefónoch.',
			images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og-faq.jpg`],
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
			canonical: 'https://mobilend.sk/caste-otazky',
		},

		// Dodatočné meta tagy
		other: {
			'theme-color': '#ffffff',
		},
	}
}

export default function CasteOtazky() {
	return <FAQPage faqs={faqData} />
}