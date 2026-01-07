// src/components/BlogCard/BlogCard.jsx
// Карточка статьи блога

import Link from 'next/link'
import Image from 'next/image'
import './BlogCard.scss'

const BlogCard = ({ post, className = '', priority = false }) => {
	if (!post) return null

	const {
		title,
		description,
		slug,
		date,
		image,
		author,
		categories = [],
		excerpt, // Уже готовый excerpt приходит с сервера
		formattedDate // Уже отформатированная дата приходит с сервера
	} = post

	const imageUrl = image || '/images/blog/default-blog.jpg'

	return (
		<article className={`BlogCard ${className}`}>
			<Link href={`/blog/${slug}`} className="BlogCard__link">
				{/* Изображение статьи */}
				<div className="BlogCard__image">
					<Image
						src={imageUrl}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						priority={priority}
						className="BlogCard__img"
					/>

					{/* Категории */}
					{categories.length > 0 && (
						<div className="BlogCard__categories">
							{categories.slice(0, 2).map((cat, index) => {
								// Витягуємо текст з об'єкта або берем як string
								const categoryText = typeof cat === 'string'
									? cat
									: (cat?.category || cat?.name || '')

								if (!categoryText) return null

								return (
									<span key={index} className="BlogCard__category">
										{categoryText}
									</span>
								)
							})}
						</div>
					)}
				</div>

				{/* Контент карточки */}
				<div className="BlogCard__content">
					{/* Дата и автор */}
					<div className="BlogCard__meta">
						{formattedDate && (
							<time className="BlogCard__date" dateTime={date}>
								{formattedDate}
							</time>
						)}
						{author && (
							<span className="BlogCard__author">
								{author}
							</span>
						)}
					</div>

					{/* Заголовок */}
					<h3 className="BlogCard__title">
						{title}
					</h3>

					{/* Описание */}
					{(description || excerpt) && (
						<p className="BlogCard__excerpt">
							{description || excerpt}
						</p>
					)}

					{/* Кнопка "Читать далее" */}
					<div className="BlogCard__footer">
						<span className="BlogCard__read-more">
							Čítať ďalej
							<svg className="BlogCard__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
							</svg>
						</span>
					</div>
				</div>
			</Link>
		</article>
	)
}

export default BlogCard