// src/app/o-nas/page.js
// Страница "О нас" с SEO метаданными

import AboutPage from "@/pages/AboutPage/AboutPage"

// Генерация мета-данных для страницы "О нас"
export async function generateMetadata() {
	return {
		title: 'O nás - Mobilend | Váš partner pre mobilné technológie',
		description: 'Sme váš spoľahlivý partner pre nákup mobilných telefónov. Dlhoročné skúsenosti, kvalita a zákaznícky servis na najvyššej úrovni. Spoznajte našu históriu a hodnoty.',

		keywords: [
			'o nás mobilend',
			'história mobilend',
			'kvalitný servis',
			'mobilné telefóny bratislava',
			'dôveryhodný predajca',
			'zákaznícky servis',
			'skúsenosti predaj telefónov'
		],

		// Open Graph
		openGraph: {
			title: 'O nás - Mobilend | Kvalita a dôvera',
			description: 'Poznáte nás bližšie. Sme tu pre vás už roky s kvalitným servisom a najlepšími cenami mobilných telefónov.',
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/o-nas`,
			siteName: 'Mobilend',
			locale: 'sk_SK',
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og.jpg`,
					width: 1200,
					height: 630,
					alt: 'O nás - Mobilend tím',
				}
			],
		},

		// Twitter Card
		twitter: {
			card: 'summary_large_image',
			title: 'O nás - Mobilend',
			description: 'Váš spoľahlivý partner pre mobilné technológie na Slovensku.',
			images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og.jpg`],
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
			canonical: 'https://mobilend.sk/o-nas',
		},

		// JSON-LD schema pre organizáciu (pridáme nižšie)
		other: {
			'theme-color': '#ffffff',
		},
	}
}

export default function Onas() {
	return <AboutPage />
}