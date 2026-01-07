"use client"
import { useState, useCallback } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import BuyButton from "@/components/BuyButton/BuyButton"
import Link from "next/link"
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import "./MainProductInfo.scss"

const MainProductInfo = ({ product }) => {
	const [thumbsSwiper, setThumbsSwiper] = useState(null)

	if (!product) return null

	// Расчет цены со скидкой
	const calculateDiscountedPrice = (price, discount) => {
		const numPrice = parseFloat(price) || 0
		const numDiscount = parseFloat(discount) || 0
		return numPrice + (numPrice * numDiscount / 100)
	}

	// Массив с изображениями
	const productImages =
		product.images && Array.isArray(product.images) && product.images.length > 0
			? product.images
			: ['/images/placeholder.webp']

	const price = parseFloat(product.price) || 0
	const discount = parseFloat(product.discount) || 0
	const discountedPrice = discount > 0 ? calculateDiscountedPrice(price, discount) : price

	// Обработчик для thumbsSwiper
	const onThumbsSwiper = useCallback((swiper) => {
		if (swiper && swiper !== thumbsSwiper) {
			setThumbsSwiper(swiper)
		}
	}, [thumbsSwiper])

	// Получение цветов и памяти из shareModels с правильной фильтрацией
	const getColorOptions = () => {
		if (!product.shareModels || !Array.isArray(product.shareModels) || !product.memory) return []

		// Показываем только цвета с той же памятью, что и у текущего продукта
		const colorOptions = product.shareModels.filter(model =>
			model.hexColor && model.capacity === product.memory
		)

		// Убираем дубликаты по цвету
		const uniqueColors = colorOptions.filter((model, index, self) =>
			index === self.findIndex(m => m.hexColor === model.hexColor)
		)

		return uniqueColors
	}

	const getMemoryOptions = () => {
		if (!product.shareModels || !Array.isArray(product.shareModels) || !product.color) return []

		// Показываем только варианты памяти с тем же цветом, что и у текущего продукта
		const memoryOptions = product.shareModels.filter(model =>
			model.capacity && model.hexColor === product.color
		)

		// Убираем дубликаты по памяти
		const uniqueMemory = memoryOptions.filter((model, index, self) =>
			index === self.findIndex(m => m.capacity === model.capacity)
		)

		return uniqueMemory
	}

	return (
		<section className="MainProductInfo">
			<div className="container">
				<div className="MainProductInfo__container">
					{/* Левая часть - слайдер */}
					<div className="MainProductInfo__gallery">
						{/* Миниатюры слева */}
						<div className="MainProductInfo__thumbs">
							<Swiper
								onSwiper={onThumbsSwiper}
								spaceBetween={10}
								slidesPerView="auto"
								freeMode
								watchSlidesProgress
								direction="vertical"
								modules={[FreeMode, Navigation, Thumbs]}
								className="MainProductInfo__thumbs-swiper"
							>
								{productImages.map((image, index) => (
									<SwiperSlide key={index}>
										<div className="MainProductInfo__thumb-container">
											<img
												src={`${product.baseImageUrl}/${image}`}
												alt={`${product.model} - miniatúra ${index + 1}`}
												onError={(e) => { e.target.src = '/images/placeholder.webp' }}
											/>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>

						{/* Основной слайдер справа */}
						<div className="MainProductInfo__main-slider">
							<Swiper
								style={{
									'--swiper-navigation-color': 'var(--darkBlue)',
									'--swiper-pagination-color': 'var(--darkBlue)',
								}}
								spaceBetween={10}
								navigation={{
									enabled: true,
								}}
								breakpoints={{
									// На экранах меньше 768px - навигация отключена
									0: {
										navigation: {
											enabled: false,
										},
									},
									// На экранах 768px и больше - навигация включена
									768: {
										navigation: {
											enabled: true,
										},
									},
								}}
								thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
								modules={[FreeMode, Navigation, Thumbs]}
								className="MainProductInfo__main-swiper"
							>

								{productImages.map((image, index) => (
									<SwiperSlide key={index}>
										<div className="MainProductInfo__image-container">
											<img
												src={`${product.baseImageUrl}/${image}`}
												alt={`${product.model} - ${index + 1}`}
											// onError={(e) => { e.target.src = '/images/placeholder.webp' }}
											/>
										</div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>

					{/* Правая часть - детали продукта */}
					<div className="MainProductInfo__details">
						{/* Название */}
						<div className="MainProductInfo__header">
							<h1 className="MainProductInfo__title">{product.model}</h1>
						</div>

						{/* Скидка и популярность в одной строке */}
						<div className="MainProductInfo__discount-popular">
							{discount > 0 && (
								<span className="MainProductInfo__discount-badge">-{discount}%</span>
							)}
							{product.popular && (
								<div className="MainProductInfo__popular">
									<span>Populárne</span>
								</div>
							)}
						</div>

						{/* Цена и старая цена во второй строке */}
						<div className="MainProductInfo__price-section">
							<div className="MainProductInfo__prices">
								<div className="MainProductInfo__current-price">
									{price.toFixed(2)} {product.currencyLabel}
								</div>
								{discount > 0 && (
									<span className="MainProductInfo__original-price">
										
										{discountedPrice.toFixed(2)} {product.currencyLabel}
									</span>
								)}
							</div>
						</div>

						{/* Цветовые варианты */}
						{getColorOptions().length > 0 && (
							<div className="MainProductInfo__color-options">
								<h3>Farby:</h3>
								<div className="MainProductInfo__color-list">
									{getColorOptions().map((model, index) => (
										<Link
											key={index}
											href={`/katalog/${model.productLink}`}
											className={`MainProductInfo__color-link ${model.hexColor === product.color ? 'active' : ''}`}
										>
											<div
												className="MainProductInfo__color-circle"
												style={{ backgroundColor: model.hexColor }}
												title={`Farba ${model.hexColor}`}
											/>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Варианты памяти */}
						{getMemoryOptions().length > 0 && (
							<div className="MainProductInfo__memory-options">
								<h3>Pamäť:</h3>
								<div className="MainProductInfo__memory-list">
									{getMemoryOptions().map((model, index) => (
										<Link
											key={index}
											href={`/katalog/${model.productLink}`}
											className={`MainProductInfo__memory-link ${model.capacity === product.memory ? 'active' : ''}`}
										>
											<span>{model.capacity}</span>
										</Link>
									))}
								</div>
							</div>
						)}

						{/* Кнопка купить */}
						<div className="MainProductInfo__buy-section">
							<BuyButton
								type="full"
								productLink={product.productLink}
								product={product}
							/>
						</div>

						{/* Короткое описание */}
						{product.shortInfo && (
							<div className="MainProductInfo__short-description">
								<h3>Popis:</h3>
								<p>{product.shortInfo}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default MainProductInfo