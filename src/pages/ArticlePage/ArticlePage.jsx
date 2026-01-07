// src/pages/ArticlePage/ArticlePage.jsx
// Компонент страницы отдельной статьи блога

import BlogContent from '@/components/BlogContent/BlogContent'
import BlogSlider from '@/components/BlogSlider/BlogSlider'
import { generateBreadcrumbSchema } from '@/components/SEO/JsonLdSchemas'
import JsonLd from '@/components/SEO/JsonLd'
import './ArticlePage.scss'

// Генерация JSON-LD схемы для статьи
function generateArticleSchema(post) {
	if (!post) return null

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'
	const imageUrl = post.image
		? `${baseUrl}${post.image}`
		: `${baseUrl}/images/blog/default-blog.jpg`

	const schema = {
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": post.title,
		"description": post.description || post.title,
		"image": [imageUrl],
		"datePublished": post.date,
		"dateModified": post.date,
		"author": {
			"@type": "Person",
			"name": post.author || "Mobilend"
		},
		"publisher": {
			"@type": "Organization",
			"name": "Mobilend",
			"logo": {
				"@type": "ImageObject",
				"url": `${baseUrl}/images/logo.png`
			}
		},
		"mainEntityOfPage": {
			"@type": "WebPage",
			"@id": `${baseUrl}/blog/${post.slug}`
		},
		"articleSection": post.categories ? post.categories.join(", ") : "Technology",
		"keywords": post.categories ? post.categories.join(", ") : "",
		"wordCount": post.content ? post.content.split(' ').length : 0
	}

	return JSON.stringify(schema)
}

const ArticlePage = ({ post, relatedPosts = [] }) => {
	if (!post) {
		return (
			<div className="ArticlePage">
				<div className="container">
					<div className="ArticlePage__not-found">
						<h2>Článok sa nenašiel</h2>
						<p>Možno je odkaz nesprávny alebo bol článok odstránený</p>
						<a href="/blog" className="ArticlePage__back-button">
							Prejsť na blog
						</a>
					</div>
				</div>
			</div>
		)
	}

	return (
		<main className="ArticlePage">
			{/* JSON-LD схемы */}
			<JsonLd schema={generateArticleSchema(post)} />
			<JsonLd schema={generateBreadcrumbSchema([
				{ name: 'Domov', url: '/' },
				{ name: 'Blog', url: '/blog' },
				{ name: post.title, url: `/blog/${post.slug}` }
			])} />

			<div className="container">
				{/* Хлебные крошки */}
				<nav className="ArticlePage__breadcrumbs" aria-label="Breadcrumb">
					<ol className="breadcrumb-list">
						<li className="breadcrumb-item">
							<a href="/">Hlavná</a>
						</li>
						<li className="breadcrumb-item">
							<a href="/blog">Blog</a>
						</li>
						<li className="breadcrumb-item active" aria-current="page">
							{post.title}
						</li>
					</ol>
				</nav>

				{/* Контент статьи */}
				<BlogContent post={post} />
			</div>

			{/* Похожие статьи */}
			{relatedPosts.length > 0 && (
				<BlogSlider
					posts={relatedPosts}
					title="Mohli by vás zaujímať"
					subtitle="Podobné články z nášho blogu"
					className="ArticlePage__related"
					cardVariant="compact"
					slidesToShow={3}
					autoplay={false}
				/>
			)}
		</main>
	)
}

export default ArticlePage