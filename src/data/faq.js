// src/data/faq.js
// Данные FAQ для сайта

export const faqData = [
	{
		question: "Je to originálny a nový telefón?",
		answer: "Áno, všetky zariadenia sú originálne a nové, dodávané priamo od overených dodávateľov v originálnom balení od výrobcu."
	},
	{
		question: "Je na telefón záruka a kto ju poskytuje?",
		answer: "Záruku poskytuje dodávateľ alebo servisné stredisko výrobcu. V prípade reklamácie vám radi pomôžeme so všetkými krokmi."
	},
	{
		question: "Čo je súčasťou balenia? Je tam nabíjačka?",
		answer: "Obsah balenia závisí od konkrétneho modelu a dodávateľa. Zvyčajne je v krabici telefón, kábel a návod. Nabíjací adaptér je súčasťou balenia podľa štandardov výrobcu. Podrobnosti nájdete v popise produktu alebo sa opýtajte v našom chate."
	},
	{
		question: "Dá sa telefón kúpiť na splátky alebo na úver?",
		answer: "Áno, spolupracujeme s platobnými službami, ktoré umožňujú nákup na splátky alebo úver priamo pri objednávke (ak je táto možnosť dostupná)."
	},
	{
		question: "Koľko stojí doručenie a ako dlho trvá?",
		answer: "Tovar je doručovaný priamo od dodávateľa. Doručenie zvyčajne trvá 5 až 15 pracovných dní v závislosti od regiónu. Cena doručenia sa vypočíta pri vytváraní objednávky."
	},
	{
		question: "Je možné telefón vrátiť alebo vymeniť, ak niečo nie je v poriadku?",
		answer: "Áno, tovar môžete vrátiť do 7 dní, ak nebol použitý a je v pôvodnom stave. Ak príde chybný tovar, zabezpečíme výmenu alebo vrátenie tovaru na naše náklady."
	},
	{
		question: "Ako môžem sledovať svoju objednávku?",
		answer: "Po odoslaní objednávky dostanete SMS alebo email s informáciami o sledovaní. Môžete nás tiež kontaktovať priamo cez náš chat alebo telefón."
	},
	{
		question: "Aké sú možnosti platby?",
		answer: "Podporujeme rôzne spôsoby platby: bankový prevod, kreditné a debetné karty, PayPal, a platbu na dobierku (v závislosti od regiónu)."
	},
	{
		question: "Máte kamenný obchod kde si môžem telefón pozrieť?",
		answer: "Momentálne fungujeme ako online obchod. Všetky produkty sú starostlivo vyberané a testované našimi dodávateľmi. Ak máte špecifické otázky o produkte, radi vám pomôžeme cez chat alebo telefón."
	},
	{
		question: "Čo ak sa mi telefón nepozdáva po doručení?",
		answer: "Máte právo na vrátenie tovaru do 7 dní od doručenia bez udania dôvodu, ak je tovar nepoužitý a v originálnom balení. Náklady na vrátenie si hradíte sami, okrem prípadov keď je tovar chybný."
	}
]

// Funkция для генерации JSON-LD FAQPage schema
export function generateFAQSchema(faqs) {
	if (!faqs || faqs.length === 0) return null

	const schema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": faqs.map(faq => ({
			"@type": "Question",
			"name": faq.question,
			"acceptedAnswer": {
				"@type": "Answer",
				"text": faq.answer
			}
		}))
	}

	return JSON.stringify(schema)
}