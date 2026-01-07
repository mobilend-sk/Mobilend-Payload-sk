"use client"
import { useState } from "react"
import {
	ChevronDown,
	Smartphone,
	Monitor,
	Camera,
	Zap,
	Wifi,
	Battery,
	Ruler,
	Settings,
	Leaf
} from "lucide-react"
import "./AllProductInfo.scss"

const AllProductInfo = ({ product }) => {
	const [openSections, setOpenSections] = useState({ "main-characteristics": true }) // Первая секция открыта по умолчанию

	if (!product) return null

	// Функция для переключения секций
	const toggleSection = (sectionKey) => {
		setOpenSections(prev => ({
			...prev,
			[sectionKey]: !prev[sectionKey]
		}))
	}

	// Конфигурация секций
	const sections = [
		{
			key: "main-characteristics",
			title: "Сharakteristiky",
			data: product["main-characteristics"],
			icon: Smartphone
		},
		{
			key: "display",
			title: "Displej",
			data: product.display,
			icon: Monitor
		},
		{
			key: "camera",
			title: "Kamera",
			data: product.camera,
			icon: Camera
		},
		{
			key: "hardware",
			title: "Výkon",
			data: product.hardware,
			icon: Zap
		},
		{
			key: "connectivity",
			title: "Pripojenie",
			data: product.connectivity,
			icon: Wifi
		},
		{
			key: "battery",
			title: "Batéria",
			data: product.battery,
			icon: Battery
		},
		{
			key: "dimensions",
			title: "Rozmery",
			data: product.dimensions,
			icon: Ruler
		},
		{
			key: "features",
			title: "Funkcie",
			data: product.features,
			icon: Settings
		},
		{
			key: "energy",
			title: "Energetika",
			data: product.energy,
			icon: Leaf
		}
	]

	// Фильтруем только секции с данными
	const availableSections = sections.filter(section =>
		section.data && Array.isArray(section.data) && section.data.length > 0
	)

	return (
		<section className="AllProductInfo">
			<div className="container">
				<div className="AllProductInfo__container">
					<h2 className="AllProductInfo__title">Podrobné špecifikácie</h2>

					<div className="AllProductInfo__accordion">
						{availableSections.map((section) => (
							<div key={section.key} className="AllProductInfo__section">
								<button
									className={`AllProductInfo__section-header ${openSections[section.key] ? 'active' : ''}`}
									onClick={() => toggleSection(section.key)}
								>
									<div className="AllProductInfo__section-left">
										<div className="AllProductInfo__section-icon">
											<section.icon size={20} />
										</div>
										<span className="AllProductInfo__section-title">{section.title}</span>
										<span className="AllProductInfo__section-count">
											({section.data.length} charakteristík)
										</span>
									</div>
									<ChevronDown
										className={`AllProductInfo__section-arrow ${openSections[section.key] ? 'rotated' : ''}`}
									/>
								</button>

								<div className={`AllProductInfo__section-content ${openSections[section.key] ? 'open' : ''}`}>
									<div className="AllProductInfo__characteristics">
										{section.data.map((char, index) => (
											<div key={index} className="AllProductInfo__characteristic">
												<span className="AllProductInfo__char-label">{char.label}</span>
												<span className="AllProductInfo__char-value">{char.value}</span>
											</div>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default AllProductInfo