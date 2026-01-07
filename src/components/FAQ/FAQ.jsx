// src/components/FAQ/FAQ.jsx
// Компонент FAQ с аккордеоном

"use client"
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './FAQ.scss'

const FAQ = ({
	faqs = [],
	title = "Často kladené otázky",
	subtitle = "",
	className = "",
	showAll = true, // показывать все или только часть
	limit = null // лимит вопросов для главной страницы
}) => {
	const [openItems, setOpenItems] = useState({})

	// Ограничиваем количество FAQ если задан лимит
	const displayedFaqs = limit ? faqs.slice(0, limit) : faqs

	const toggleItem = (index) => {
		setOpenItems(prev => ({
			...prev,
			[index]: !prev[index]
		}))
	}

	if (!faqs || faqs.length === 0) {
		return null
	}

	return (
		<section className={`FAQ ${className}`}>
			<div className="container">
				{/* Заголовок секции */}
				<div className="FAQ__header">
					<h2 className="FAQ__title">{title}</h2>
					{subtitle && (
						<p className="FAQ__subtitle">{subtitle}</p>
					)}
				</div>

				{/* Список FAQ */}
				<div className="FAQ__list">
					{displayedFaqs.map((faq, index) => (
						<div
							key={index}
							className={`FAQ__item ${openItems[index] ? 'FAQ__item--open' : ''}`}
						>
							{/* Кнопка вопроса */}
							<button
								className="FAQ__question"
								onClick={() => toggleItem(index)}
								aria-expanded={openItems[index] || false}
								aria-controls={`faq-answer-${index}`}
							>
								<span className="FAQ__question-text">
									{faq.question}
								</span>
								<ChevronDown
									className={`FAQ__question-icon ${openItems[index] ? 'FAQ__question-icon--rotated' : ''}`}
									size={20}
								/>
							</button>

							{/* Ответ */}
							<div
								className={`FAQ__answer ${openItems[index] ? 'FAQ__answer--open' : ''}`}
								id={`faq-answer-${index}`}
							>
								<div className="FAQ__answer-content">
									{faq.answer}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Кнопка "Показать все" для главной страницы */}
				{limit && faqs.length > limit && (
					<div className="FAQ__footer">
						<a href="/caste-otazky" className="FAQ__view-all">
							Zobraziť všetky otázky ({faqs.length})
						</a>
					</div>
				)}
			</div>
		</section>
	)
}

export default FAQ