// src/pages/FAQPage/FAQPage.jsx
// Страница часто задаваемых вопросов

import FAQ from '@/components/FAQ/FAQ'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/components/SEO/JsonLdSchemas'
import { generateFAQSchema } from '@/data/faq'
import JsonLd from '@/components/SEO/JsonLd'
import './FAQPage.scss'

const FAQPage = ({ faqs = [] }) => {
	return (
		<main className="FAQPage">
			{/* JSON-LD схемы */}
			<JsonLd schema={generateOrganizationSchema()} />
			<JsonLd schema={generateFAQSchema(faqs)} />
			<JsonLd schema={generateBreadcrumbSchema([
				{ name: 'Domov', url: '/' },
				{ name: 'Často kladené otázky', url: '/caste-otazky' }
			])} />

			<div className="container">
				{/* Хлебные крошки */}
				{/* <nav className="FAQPage__breadcrumbs" aria-label="Breadcrumb">
					<ol className="breadcrumb-list">
						<li className="breadcrumb-item">
							<a href="/">Domov</a>
						</li>
						<li className="breadcrumb-item active" aria-current="page">
							Často kladené otázky
						</li>
					</ol>
				</nav> */}

				{/* Заголовок страницы */}
				<header className="FAQPage__header">
					<h1 className="FAQPage__title">Často kladené otázky</h1>
					<p className="FAQPage__subtitle">
						Nájdite odpovede na najčastejšie otázky o nákupe mobilných telefónov v našom obchode
					</p>
				</header>

				{/* FAQ компонент */}
				<FAQ
					faqs={faqs}
					title="" // Убираем заголовок так как он уже есть в header
					showAll={true}
					className="FAQPage__faq"
				/>

				{/* Контактная информация */}
				<section className="FAQPage__contact">
					<div className="FAQPage__contact-content">
						<h2>Nenašli ste odpoveď na svoju otázku?</h2>
						<p>Kontaktujte nás a radi vám pomôžeme</p>
						<div className="FAQPage__contact-methods">
							<a href="mailto:support@mobilend.sk" className="FAQPage__contact-method">
								<span className="FAQPage__contact-icon">✉️</span>
								<div>
									<strong>Email</strong>
									<span>support@mobilend.sk</span>
								</div>
							</a>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

export default FAQPage