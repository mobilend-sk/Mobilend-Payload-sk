// src/components/BlogContent/BlogContent.jsx
// Компонент для рендера markdown контента статьи

import './BlogContent.scss'

const BlogContent = ({ post }) => {
	if (!post) return null

	const {
		title,
		date,
		author,
		categories = [],
		image,
		description,
		htmlContent, // Уже готовый HTML приходит с сервера
		formattedDate // Уже отформатированная дата приходит с сервера
	} = post

	const imageUrl = image || '/images/blog/default-blog.jpg'

	console.log('🔍 htmlContent type:', typeof htmlContent)
	console.log('🔍 htmlContent value:', htmlContent)


	return (
		<article className="BlogContent">
			{/* Заголовок статьи */}
			<header className="BlogContent__header">
				{/* Мета информация */}
				<div className="BlogContent__meta">
					{categories.length > 0 && (
						<div className="BlogContent__categories">
							{categories.map((cat, index) => {
								const categoryText = typeof cat === 'string'
									? cat
									: (cat?.category || cat?.name || '')

								if (!categoryText) return null

								return (
									<span key={index} className="BlogContent__category">
										{categoryText}
									</span>
								)
							})}
						</div>
					)}

					{formattedDate && (
						<time className="BlogContent__date" dateTime={date}>
							{formattedDate}
						</time>
					)}
					{author && (
						<span className="BlogContent__author">
							{author}
						</span>
					)}
				</div>

				{/* Заголовок */}
				<h1 className="BlogContent__title">
					{title}
				</h1>

				{/* Описание */}
				{description && (
					<div className="BlogContent__description">
						{description}
					</div>
				)}

				{/* Главное изображение */}
				{imageUrl && (
					<div className="BlogContent__hero-image">
						<img
							src={imageUrl}
							alt={title}
							className="BlogContent__hero-img"
						/>
					</div>
				)}
			</header>

			{/* Контент статьи */}
			<div className="BlogContent__body">
				<div
					className="BlogContent__prose"
					dangerouslySetInnerHTML={{ __html: htmlContent }}
				/>
			</div>
		</article>
	)
}

export default BlogContent