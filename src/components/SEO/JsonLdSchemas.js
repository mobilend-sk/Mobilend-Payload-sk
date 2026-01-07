// src/components/SEO/JsonLdSchemas.js
// JSON-LD схемы для лучшего SEO

// 1. Схема для товара (Product Schema)
export function generateProductSchema(product) {
	if (!product) return null

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	// Рассчитываем цену со скидкой
	const originalPrice = parseFloat(product.price) || 0
	const discount = parseFloat(product.discount) || 0
	const currentPrice = discount > 0
		? originalPrice * (1 - discount / 100)
		: originalPrice

	// Определяем изображение
	let productImage = null
	if (product.mainImage) {
		productImage = `${baseUrl + product.baseImageUrl}/${product.mainImage}`
	} else if (product.images && product.images.length > 0 && !product.images[0].startsWith('http')) {
		productImage = `${baseUrl + product.baseImageUrl}/${product.images[0]}`
	}

	const schema = {
		"@context": "https://schema.org/",
		"@type": "Product",
		"name": product.model,
		"description": product.shortInfo || `${product.model} s ${product.memory || 'rôznou'} pamäťou. Kvalitný mobilný telefón s modernou technológiou.`,
		"brand": {
			"@type": "Brand",
			"name": product.modelGroup === "Iphones" ? "Apple" : product.modelGroup?.replace(" Galaxy", "") || "Apple"
		},
		"category": "Mobilné telefóny",
		"sku": product.productLink,
		"url": `${baseUrl}/katalog/${product.productLink}`,

  // Исправляем изображения - только если есть
		...(productImage && { "image": [productImage] }), // Добавляем только если есть изображение

		// Цена и наличие
		"offers": {
			"@type": "Offer",
			"price": currentPrice.toFixed(2),
			"priceCurrency": "EUR",
			"priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 дней
			"availability": "https://schema.org/InStock",
			"url": `${baseUrl}/katalog/${product.productLink}`,
			"seller": {
				"@type": "Organization",
				"name": "Mobilend",
				"url": baseUrl
			}
		}
	}

	// Дополнительные свойства товара - объявляем ПЕРЕД использованием
	const additionalProperty = []

	// Добавляем характеристики если есть
	if (product.memory) {
		additionalProperty.push({
			"@type": "PropertyValue",
			"name": "Pamäť",
			"value": product.memory
		})
	}

	if (product.color) {
		additionalProperty.push({
			"@type": "PropertyValue",
			"name": "Farba",
			"value": product.color
		})
	}

	// Добавляем в схему только если есть дополнительные свойства
	if (additionalProperty.length > 0) {
		schema.additionalProperty = additionalProperty
	}

	return JSON.stringify(schema)
}
// 2. Схема для организации (Organization Schema)
export function generateOrganizationSchema() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	const schema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Mobilend",
		"alternateName": "Mobilend.sk",
		"description": "Predajca mobilných telefónov na Slovensku. Široký výber iPhone, Samsung Galaxy a ďalších značiek za najlepšie ceny.",
		"url": baseUrl,
		"logo": `${baseUrl}/images/logo.png`,
		"image": `${baseUrl}/images/og-homepage.jpg`,

		// Контактная информация
		"contactPoint": {
			"@type": "ContactPoint",
			"telephone": "+421919126340",
			"contactType": "customer service",
			"email": "support@mobilend.sk",
			"availableLanguage": ["Slovak"]
		},

		// Адрес
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "Pekná cesta 2459",
			"addressLocality": "Bratislava",
			"addressRegion": "Bratislavský kraj",
			"postalCode": "831 52",
			"addressCountry": "SK"
		},

		// Социальные сети (если есть)
		"sameAs": [
			// "https://www.facebook.com/mobilend",
			// "https://www.instagram.com/mobilend",
		],

		// Область деятельности
		"knowsAbout": [
			"mobilné telefóny",
			"smartfóny",
			"iPhone",
			"Samsung Galaxy",
			"elektronika"
		]
	}

	return JSON.stringify(schema)
}

// 3. Схема для местного бизнеса (Local Business Schema)
export function generateLocalBusinessSchema() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	const schema = {
		"@context": "https://schema.org",
		"@type": "ElectronicsStore",
		"name": "Mobilend",
		"description": "Obchod s mobilnými telefónmi v Bratislave. Predaj iPhone, Samsung Galaxy a ďalších značiek.",
		"url": baseUrl,
		"telephone": "+421919126340",
		"email": "support@mobilend.sk",

		// Адрес и геолокация
		"address": {
			"@type": "PostalAddress",
			"streetAddress": "Pekná cesta 2459",
			"addressLocality": "Bratislava",
			"addressRegion": "Rača",
			"postalCode": "831 52",
			"addressCountry": "SK"
		},

		"geo": {
			"@type": "GeoCoordinates",
			"latitude": "48.198111",
			"longitude": "17.135069"
		},

		// Часы работы (настрой под свои)
		"openingHoursSpecification": [
			{
				"@type": "OpeningHoursSpecification",
				"dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				"opens": "00:00",
				"closes": "00:01"
			},
			{
				"@type": "OpeningHoursSpecification",
				"dayOfWeek": "Saturday",
				"opens": "00:00",
				"closes": "00:01"
			}
		],

		// Способы оплаты
		"paymentAccepted": ["Cash", "Credit Card", "Bank Transfer"],

		// Область обслуживания
		"areaServed": {
			"@type": "Country",
			"name": "Slovakia"
		},

		// Что продаем
		// "hasOfferCatalog": {
		// 	"@type": "OfferCatalog",
		// 	"name": "Mobilné telefóny",
		// 	"itemListElement": [
		// 		{
		// 			"@type": "Offer",
		// 			"itemOffered": {
		// 				"@type": "Product",
		// 				"name": "iPhone"
		// 			}
		// 		},
		// 		{
		// 			"@type": "Offer",
		// 			"itemOffered": {
		// 				"@type": "Product",
		// 				"name": "Samsung Galaxy"
		// 			}
		// 		}
		// 	]
		// }
	}

	return JSON.stringify(schema)
}

// 4. Схема для веб-сайта (Website Schema)
export function generateWebsiteSchema() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	const schema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Mobilend",
		"alternateName": "Mobilend.sk",
		"url": baseUrl,
		"description": "Mobilné telefóny za najlepšie ceny na Slovensku",

		// Поиск по сайту (если есть функция поиска)
		"potentialAction": {
			"@type": "SearchAction",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": `${baseUrl}/katalog?search={search_term_string}`
			},
			"query-input": "required name=search_term_string"
		},

		// Издатель
		"publisher": {
			"@type": "Organization",
			"name": "Mobilend",
			"url": baseUrl
		}
	}

	return JSON.stringify(schema)
}

// 5. Схема хлебных крошек (Breadcrumb Schema)
export function generateBreadcrumbSchema(breadcrumbs) {
	if (!breadcrumbs || breadcrumbs.length === 0) return null

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'

	const schema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": breadcrumbs.map((crumb, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"name": crumb.name,
			"item": `${baseUrl}${crumb.url}`
		}))
	}

	return JSON.stringify(schema)
}