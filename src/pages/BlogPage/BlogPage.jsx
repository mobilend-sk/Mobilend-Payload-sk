// src/pages/BlogPage/BlogPage.jsx
// Компонент страницы блога

import BlogCard from '@/components/BlogCard/BlogCard'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/components/SEO/JsonLdSchemas'
import JsonLd from '@/components/SEO/JsonLd'
import './BlogPage.scss'

const BlogPage = ({ allPosts = [] }) => {
	// Разделяем на featured и обычные статьи
	const featuredPosts = allPosts.filter(post => post.featured)
	const regularPosts = allPosts.filter(post => !post.featured)

	return (
		<main className="BlogPage">
			{/* JSON-LD схемы */}
			<JsonLd schema={generateOrganizationSchema()} />
			<JsonLd schema={generateBreadcrumbSchema([
				{ name: 'Domov', url: '/' },
				{ name: 'Blog', url: '/blog' }
			])} />

			<div className="container">
				{/* Хлебные крошки */}
				{/* <nav className="BlogPage__breadcrumbs" aria-label="Breadcrumb">
					<ol className="breadcrumb-list">
						<li className="breadcrumb-item">
							<a href="/">Domov</a>
						</li>
						<li className="breadcrumb-item active" aria-current="page">
							Blog
						</li>
					</ol>
				</nav> */}

				{/* Заголовок страницы */}
				<div className="BlogPage__header">
					<h1 className="BlogPage__title">Náš Blog</h1>
					<p className="BlogPage__subtitle">
						Najnovšie články, recenzie a tipy o mobilných telefónoch
					</p>
				</div>

				{/* Featured статьи */}
				{featuredPosts.length > 0 && (
					<section className="BlogPage__featured">
						<h2 className="BlogPage__section-title">Odporúčané články</h2>
						<div className="BlogPage__featured-grid">
							{featuredPosts.slice(0, 3).map((post, index) => (
								<BlogCard
									key={post.slug}
									post={post}
									className={`BlogCard--${index === 0 ? 'large' : 'compact'}`}
									priority={index === 0}
								/>
							))}
						</div>
					</section>
				)}

				{/* Все статьи */}
				<section className="BlogPage__all">
					<h2 className="BlogPage__section-title">
						Všetky články ({allPosts.length})
					</h2>

					{allPosts.length > 0 ? (
						<div className="BlogPage__grid">
							{allPosts.map((post, index) => (
								<BlogCard
									key={post.slug}
									post={post}
									className="BlogCard--compact"
									priority={index < 6} // Первые 6 изображений с приоритетом
								/>
							))}
						</div>
					) : (
						<div className="BlogPage__empty">
							<h3>Zatiaľ nemáme žiadne články</h3>
							<p>Čoskoro pridáme zaujímavý obsah o mobilných telefónoch.</p>
						</div>
					)}
				</section>

			</div>
		</main>
	)
}

export default BlogPage