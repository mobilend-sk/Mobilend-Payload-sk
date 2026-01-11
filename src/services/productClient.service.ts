// Клієнтський сервіс для роботи з продуктами через Payload API

interface Product {
	id: string
	phone: string
	model: string
	category: string
	modelGroup: string
	color: string
	memory: string
	price: number | null
	currency: string
	currencyLabel: string
	discount: number
	popular: boolean
	productLink: string
	shortInfo?: string
	baseImageUrl?: string
	mainImage: string
	images?: Array<{ filename: string }>
	mainCharacteristics?: Array<{ label: string; value: string; key: string }>
	display?: Array<{ label: string; value: string; key: string }>
	dimensions?: Array<{ label: string; value: string; key: string }>
	camera?: Array<{ label: string; value: string; key: string }>
	features?: Array<{ label: string; value: string; key: string }>
	battery?: Array<{ label: string; value: string; key: string }>
	hardware?: Array<{ label: string; value: string; key: string }>
	connectivity?: Array<{ label: string; value: string; key: string }>
	energy?: Array<{ label: string; value: string; key: string }>
}

class ProductService {
	private baseUrl: string

	constructor() {
		// КРИТИЧНО: Використовуємо змінні оточення!
		// В dev: http://localhost:3000
		// В production: https://your-domain.com
		this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
	}

	// Завантаження всіх продуктів з Payload + ISR кешування
	async getAllProducts(): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?limit=1000`
			
			console.log('🔍 Fetching products from:', url)

			const response = await fetch(url, {
				// ISR КЕШУВАННЯ - КРИТИЧНО!
				next: { 
					revalidate: 3600, // 1 година
					tags: ['products'] // Для on-demand revalidation
				}
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			
			console.log('✅ Products loaded:', data.docs?.length || 0)
			
			return data.docs || []
		} catch (error) {
			console.error('❌ Помилка завантаження продуктів:', error)
			return [] // Повертаємо пустий масив щоб білд не падав
		}
	}

	// Отримання продукту по productLink
	async getProductInfo(productLink: string): Promise<Product | null> {
		try {
			if (!productLink) {
				throw new Error('productLink не вказано')
			}

			const url = `${this.baseUrl}/api/products?where[productLink][equals]=${productLink}&limit=1`

			const response = await fetch(url, {
				next: { 
					revalidate: 3600,
					tags: ['products', `product-${productLink}`]
				}
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()

			if (!data.docs || data.docs.length === 0) {
				console.warn(`Продукт з productLink "${productLink}" не знайдено`)
				return null
			}

			return data.docs[0]
		} catch (error) {
			console.error('Помилка отримання інформації про продукт:', error)
			return null
		}
	}

	// Отримання всіх productLink
	async getAllProductLinks(): Promise<string[]> {
		try {
			const products = await this.getAllProducts()
			return products.map((product: Product) => product.productLink).filter(Boolean)
		} catch (error) {
			console.error('Помилка отримання productLinks:', error)
			return []
		}
	}

	// Отримання продуктів по модельній групі
	async getProductsByModel(modelGroup: string): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?where[modelGroup][equals]=${encodeURIComponent(modelGroup)}&limit=100`
			
			const response = await fetch(url, {
				next: { revalidate: 3600 }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка отримання продуктів по моделі:', error)
			return []
		}
	}

	// Отримання продуктів по phone (напр. "Apple iPhone 14")
	async getProductsByPhone(phone: string): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?where[phone][equals]=${encodeURIComponent(phone)}&limit=100`
			
			const response = await fetch(url, {
				next: { revalidate: 3600 }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка отримання продуктів по телефону:', error)
			return []
		}
	}

	// Отримання популярних продуктів
	async getPopularProducts(limit = 10): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?where[popular][equals]=true&limit=${limit}`
			
			const response = await fetch(url, {
				next: { revalidate: 3600, tags: ['popular-products'] }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка отримання популярних продуктів:', error)
			return []
		}
	}

	// Отримання продуктів зі знижкою
	async getDiscountProducts(limit = 10): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?where[discount][greater_than]=0&sort=-discount&limit=${limit}`
			
			const response = await fetch(url, {
				next: { revalidate: 3600, tags: ['discount-products'] }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка отримання продуктів зі знижкою:', error)
			return []
		}
	}

	// Отримання всіх унікальних моделей для фільтрації
	async getAllModelGroups(): Promise<string[]> {
		try {
			const products = await this.getAllProducts()
			const modelGroups = [...new Set(products.map((p: Product) => p.modelGroup))]
			return modelGroups.filter(Boolean)
		} catch (error) {
			console.error('Помилка отримання груп моделей:', error)
			return []
		}
	}

	// Отримання пов'язаних товарів (тієї ж модельної групи)
	async getRelatedProducts(currentProductLink: string, limit = 4): Promise<Product[]> {
		try {
			// Спочатку отримуємо поточний продукт
			const currentProduct = await this.getProductInfo(currentProductLink)

			if (!currentProduct) return []

			// Потім шукаємо інші продукти тієї ж групи
			const url = `${this.baseUrl}/api/products?where[modelGroup][equals]=${encodeURIComponent(currentProduct.modelGroup)}&where[productLink][not_equals]=${currentProductLink}&limit=${limit}`
			
			const response = await fetch(url, {
				next: { revalidate: 3600 }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка отримання пов\'язаних продуктів:', error)
			return []
		}
	}

	// Пошук продуктів по назві
	async searchProducts(query: string, limit = 20): Promise<Product[]> {
		try {
			const url = `${this.baseUrl}/api/products?where[or][0][model][contains]=${encodeURIComponent(query)}&where[or][1][modelGroup][contains]=${encodeURIComponent(query)}&where[or][2][phone][contains]=${encodeURIComponent(query)}&limit=${limit}`
			
			const response = await fetch(url, {
				next: { revalidate: 1800 } // 30 хвилин для пошуку
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			return data.docs || []
		} catch (error) {
			console.error('Помилка пошуку продуктів:', error)
			return []
		}
	}

	// Отримання продуктів з фільтрами
	async getProductsWithFilters({
		category,
		modelGroup,
		memory,
		minPrice,
		maxPrice,
		color,
		popular,
		hasDiscount,
		limit = 50,
		page = 1
	}: {
		category?: string
		modelGroup?: string
		memory?: string
		minPrice?: number
		maxPrice?: number
		color?: string
		popular?: boolean
		hasDiscount?: boolean
		limit?: number
		page?: number
	}) {
		try {
			const params = new URLSearchParams()
			
			params.append('limit', limit.toString())
			params.append('page', page.toString())

			// Додаємо фільтри
			if (category) params.append('where[category][equals]', category)
			if (modelGroup) params.append('where[modelGroup][equals]', modelGroup)
			if (memory) params.append('where[memory][equals]', memory)
			if (minPrice) params.append('where[price][greater_than_equal]', minPrice.toString())
			if (maxPrice) params.append('where[price][less_than_equal]', maxPrice.toString())
			if (color) params.append('where[color][equals]', color)
			if (popular !== undefined) params.append('where[popular][equals]', popular.toString())
			if (hasDiscount) params.append('where[discount][greater_than]', '0')

			const url = `${this.baseUrl}/api/products?${params.toString()}`
			
			const response = await fetch(url, {
				next: { revalidate: 3600 }
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			
			return {
				products: data.docs || [],
				totalPages: data.totalPages || 0,
				totalDocs: data.totalDocs || 0,
				page: data.page || 1,
				hasNextPage: data.hasNextPage || false,
				hasPrevPage: data.hasPrevPage || false
			}
		} catch (error) {
			console.error('Помилка отримання продуктів з фільтрами:', error)
			return {
				products: [],
				totalPages: 0,
				totalDocs: 0,
				page: 1,
				hasNextPage: false,
				hasPrevPage: false
			}
		}
	}

	// Отримання статистики продуктів
	async getProductsStats() {
		try {
			const products = await this.getAllProducts()

			// Фільтруємо продукти з валідними цінами
			const productsWithPrice = products.filter((p: Product) => p.price && typeof p.price === 'number')

			return {
				total: products.length,
				popular: products.filter((p: Product) => p.popular).length,
				withDiscount: products.filter((p: Product) => p.discount && p.discount > 0).length,
				modelGroups: [...new Set(products.map((p: Product) => p.modelGroup))].length,
				averagePrice: productsWithPrice.length > 0
					? productsWithPrice.reduce((sum: number, p: Product) => sum + (p.price || 0), 0) / productsWithPrice.length
					: 0
			}
		} catch (error) {
			console.error('Помилка отримання статистики:', error)
			return {
				total: 0,
				popular: 0,
				withDiscount: 0,
				modelGroups: 0,
				averagePrice: 0
			}
		}
	}
}

// Експортуємо єдиний екземпляр
const productService = new ProductService()

export default productService