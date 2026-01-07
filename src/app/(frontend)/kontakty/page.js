// src/app/kontakty/page.js
// Страница контактов с SEO метаданными

import Contacts from "@/pages/ContactsPage/Contacts"

// Генерация мета-данных для страницы контактов
export async function generateMetadata() {
	return {
		title: 'Kontakt - Mobilend | support@mobilend.sk | Bratislava',
		description: 'Kontaktujte nás pre poradenstvo a objednávky mobilných telefónov. Email: support@mobilend.sk. Návštívte nás na Pekná cesta 2459, Bratislava.',

		keywords: [
			'kontakt mobilend',
			'support@mobilend.sk',
			'Pekná cesta 2459 Bratislava',
			'kontakt predajňa telefóny',
			'adresa mobilend',
			'telefónne číslo',
			'email mobilend'
		],

		// Open Graph
		openGraph: {
			title: 'Kontakt - Mobilend Bratislava',
			description: 'Potrebujete poradiť s výberom telefónu? Kontaktujte nás na support@mobilend.sk alebo navštívte našu predajňu v Bratislave.',
			type: 'website',
			url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/kontakty`,
			siteName: 'Mobilend',
			locale: 'sk_SK',
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og.jpg`,
					width: 1200,
					height: 630,
					alt: 'Kontakt - Mobilend Bratislava',
				}
			],
		},

		// Twitter Card
		twitter: {
			card: 'summary_large_image',
			title: 'Kontakt - Mobilend',
			description: 'Kontaktujte nás: support@mobilend.sk | Bratislava, Pekná cesta 2459',
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
			canonical: 'https://mobilend.sk/kontakty',
		},

		// Dodatočné meta tagy pre kontakty
		other: {
			'theme-color': '#ffffff',
			// Local Business schema (pridáme v ďalšom kroku)
			'geo.region': 'SK-BL',
			'geo.placename': 'Bratislava',
			'geo.position': '48.198111;17.135069',
			'ICBM': '48.198111, 17.135069',
		},
	}
}

export default function Kontakty() {
	return <Contacts />
}