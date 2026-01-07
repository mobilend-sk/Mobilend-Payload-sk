// src/components/BlogSlider/BlogSlider.jsx
// Слайдер с блог статьями

'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import BlogCard from '@/components/BlogCard/BlogCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Импорты стилей Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './BlogSlider.scss'

const BlogSlider = ({
	posts = [],
	title = "Naše články",
	subtitle = "",
	slidesToShow = 3,
	autoplay = true,
	className = "",
	cardVariant = "compact" // compact, large, horizontal
}) => {
	if (!posts || posts.length === 0) {
		return null
	}

	// Настройки слайдера
	const swiperSettings = {
		modules: [Navigation, Autoplay],
		spaceBetween: 24,
		slidesPerView: 1,
		navigation: {
			prevEl: '.blog-slider-prev',
			nextEl: '.blog-slider-next',
		},
		autoplay: autoplay ? {
			delay: 5000,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		} : false,
		loop: posts.length > slidesToShow,
		breakpoints: {
			480: {
				slidesPerView: 1,
				spaceBetween: 16,
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1024: {
				slidesPerView: Math.min(slidesToShow, 3),
				spaceBetween: 24,
			},
			1200: {
				slidesPerView: Math.min(slidesToShow, posts.length),
				spaceBetween: 24,
			},
		},
	}

	return (
		<section className={`BlogSlider ${className}`}>
			<div className="container">
				{/* Заголовок секции */}
				<div className="BlogSlider__header">
					<div className="BlogSlider__titles">
						<h2 className="BlogSlider__title">{title}</h2>
						{subtitle && (
							<p className="BlogSlider__subtitle">{subtitle}</p>
						)}
					</div>

					{/* Навигационные кнопки */}
					<div className="BlogSlider__controls">
						<button
							className="BlogSlider__nav BlogSlider__nav--prev blog-slider-prev"
							aria-label="Predchádzajúci článok"
						>
							<ChevronLeft size={20} />
						</button>
						<button
							className="BlogSlider__nav BlogSlider__nav--next blog-slider-next"
							aria-label="Nasledujúci článok"
						>
							<ChevronRight size={20} />
						</button>
					</div>
				</div>

				{/* Слайдер */}
				<div className="BlogSlider__slider">
					<Swiper {...swiperSettings}>
						{posts.map((post, index) => (
							<SwiperSlide key={post.slug || index}>
								<BlogCard
									post={post}
									className={`BlogCard--${cardVariant}`}
									priority={index === 0} // Первое изображение с приоритетом
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>

				{/* Кнопка "Показать все" */}
				{posts.length > slidesToShow && (
					<div className="BlogSlider__footer">
						<a
							href="/blog"
							className="BlogSlider__view-all"
						>
							Zobraziť všetky články
							<ChevronRight size={16} />
						</a>
					</div>
				)}
			</div>
		</section>
	)
}

export default BlogSlider