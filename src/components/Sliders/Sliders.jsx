"use client"
import "./Sliders.scss"
import ProductCard from "@/components/ProductCard/ProductCard"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { useEffect, useState } from "react";
import productService from "@/services/productClient.service";

const Sliders = ({ types, model, title, limit = 10 }) => {
	const [productList, setProductList] = useState([])
	const [showSlider, setShowSlider] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (types && types.length > 0) {
			loadProducts()
		} else {
			setIsLoading(false)
		}
	}, [types, model])

	// Функция для рандомизации массива (алгоритм Fisher-Yates)
	const shuffleArray = (array) => {
		const newArray = [...array]
		for (let i = newArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
		}
		return newArray
	}

	const loadProducts = async () => {
		setIsLoading(true)
		try {
			let products = []
			if (types.includes("popular")) products = await productService.getPopularProducts()
			if (types.includes("discount")) products = await productService.getProductsWithDiscount()
			if (types.includes("model") && model) products = await productService.getProductsByModel(model)

			if (!products || !Array.isArray(products) || products.length === 0) throw new Error("Products is not correct")
			// Рандомизируем массив и берем только нужное количество товаров
			const shuffledProducts = shuffleArray(products)
			const limitedProducts = shuffledProducts.slice(0, limit)
			setProductList(limitedProducts)
			setShowSlider(true)
		} catch (error) {
			console.log(error.message);
			setShowSlider(false)
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<section className="Sliders">
				<div className="container">
					<h2>{title ? title : "Tovary"}</h2>
					<div className="Sliders__Loading">
						<div className="spinner"></div>
					</div>
				</div>
			</section>
		)
	}

	// Якщо немає продуктів або слайдер не потрібно показувати - нічого не рендеримо
	if (productList.length === 0 || !showSlider) return null

	return (
		<section className="Sliders">
			<div className="container">
				<h2>{title ? title : "Tovary"}</h2>
				<div className="Sliders__Swiper">
					<Swiper
						slidesPerView={2}
						spaceBetween={10}
						pagination={{
							clickable: true,
							dynamicBullets: true
						}}
						breakpoints={{
							560: {
								slidesPerView: 3,
							},
							760: {
								slidesPerView: 4,
							},
							960: {
								slidesPerView: 5,
							}
						}}
						modules={[Pagination]}
						className="mySwiper"
					>
						{
							productList.map((product, index) => <SwiperSlide key={index + "-product"}><ProductCard product={product} /></SwiperSlide>)
						}

					</Swiper>
				</div>
			</div>
		</section>
	)
}

export default Sliders