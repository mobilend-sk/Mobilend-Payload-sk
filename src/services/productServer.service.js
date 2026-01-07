// Серверная версия для работы с продуктами на этапе билда (SSG)

import fs from 'fs'
import path from 'path'

class ProductServiceServer {
	constructor() {
		// Путь к JSON файлу с продуктами (убираем путь к details)
		this.productsPath = path.join(process.cwd(), 'public', 'data', 'products.json')
	}

	// Загрузка всех продуктов из JSON (под твою структуру)
	async getAllProducts() {
		try {
			const fileContent = fs.readFileSync(this.productsPath, 'utf8')
			const data = JSON.parse(fileContent)

			// Извлекаем все модели из всех групп и добавляем baseImageUrl и phone
			const allProducts = []
			data.forEach(group => {
				if (group.models && Array.isArray(group.models)) {
					// Добавляем phone и baseImageUrl в каждую модель
					const modelsWithGroupInfo = group.models.map(model => ({
						...model,
						phone: group.phone,
						baseImageUrl: group.baseImageUrl
					}))
					allProducts.push(...modelsWithGroupInfo)
				}
			})

			console.log(allProducts);

			return allProducts
		} catch (error) {
			console.error('Ошибка загрузки продуктов:', error)
			return []
		}
	}

	// Получение продукта по productLink (с деталями из той же группы)
	async getProductInfo(productLink) {
		try {
			if (!productLink) {
				throw new Error('productLink не указан')
			}

			const fileContent = fs.readFileSync(this.productsPath, 'utf8')
			const data = JSON.parse(fileContent)

			// Ищем продукт и группу, в которой он находится
			let product = null
			let productGroup = null

			for (const group of data) {
				if (group.models && Array.isArray(group.models)) {
					const foundProduct = group.models.find(p => p.productLink === productLink)
					if (foundProduct) {
						product = foundProduct
						productGroup = group
						break
					}
				}
			}

			if (!product) {
				console.warn(`Продукт с productLink "${productLink}" не найден`)
				return null
			}

			// Объединяем продукт с характеристиками из его группы
			return {
				...product,
				// Добавляем базовые поля группы
				phone: productGroup.phone,
				baseImageUrl: productGroup.baseImageUrl,
				// Добавляем все характеристики из группы
				'main-characteristics': productGroup['main-characteristics'] || [],
				'display': productGroup['display'] || [],
				'camera': productGroup['camera'] || [],
				'features': productGroup['features'] || [],
				'battery': productGroup['battery'] || [],
				'hardware': productGroup['hardware'] || [],
				'connectivity': productGroup['connectivity'] || [],
				'dimensions': productGroup['dimensions'] || [],
				'energy': productGroup['energy'] || [],
				'shareModels': productGroup['shareModels'] || [] // Варианты памяти/цветов
			}
		} catch (error) {
			console.error('Ошибка получения информации о продукте:', error)
			throw error
		}
	}

	// Получение всех productLink для generateStaticParams
	async getAllProductLinks() {
		try {
			const products = await this.getAllProducts()
			return products.map(product => product.productLink).filter(Boolean)
		} catch (error) {
			console.error('Ошибка получения productLinks:', error)
			return []
		}
	}

	// Получение продуктов по модельной группе
	async getProductsByModel(modelGroup) {
		try {
			const products = await this.getAllProducts()
			return products.filter(product => product.modelGroup === modelGroup)
		} catch (error) {
			console.error('Ошибка получения продуктов по модели:', error)
			return []
		}
	}

	// Получение популярных продуктов
	async getPopularProducts(limit = 10) {
		try {
			const products = await this.getAllProducts()
			return products
				.filter(product => product.popular)
				.slice(0, limit)
		} catch (error) {
			console.error('Ошибка получения популярных продуктов:', error)
			return []
		}
	}

	// Получение продуктов со скидкой
	async getDiscountProducts(limit = 10) {
		try {
			const products = await this.getAllProducts()
			return products
				.filter(product => product.discount && product.discount > 0)
				.sort((a, b) => b.discount - a.discount)
				.slice(0, limit)
		} catch (error) {
			console.error('Ошибка получения продуктов со скидкой:', error)
			return []
		}
	}

	// Получение всех уникальных моделей для фильтрации
	async getAllModelGroups() {
		try {
			const products = await this.getAllProducts()
			const modelGroups = [...new Set(products.map(p => p.modelGroup))]
			return modelGroups.filter(Boolean)
		} catch (error) {
			console.error('Ошибка получения групп моделей:', error)
			return []
		}
	}

	// Получение связанных товаров (той же модельной группы)
	async getRelatedProducts(currentProductLink, limit = 4) {
		try {
			const products = await this.getAllProducts()
			const currentProduct = products.find(p => p.productLink === currentProductLink)

			if (!currentProduct) return []

			return products
				.filter(p =>
					p.modelGroup === currentProduct.modelGroup &&
					p.productLink !== currentProductLink
				)
				.slice(0, limit)
		} catch (error) {
			console.error('Ошибка получения связанных продуктов:', error)
			return []
		}
	}
}

// Экспортируем единственный экземпляр
const productServiceServer = new ProductServiceServer()

export default productServiceServer