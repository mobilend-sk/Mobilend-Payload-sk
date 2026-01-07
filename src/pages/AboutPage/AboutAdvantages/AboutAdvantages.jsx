"use client"
import { Shield, Truck, Award, HeartHandshake } from "lucide-react"
import "./AboutAdvantages.scss"
import SliderList from "@/components/SliderList/SliderList"

const AboutAdvantages = () => {
	const advantages = [
		{
			icon: Shield,
			title: "Oficiálna záruka",
			description: "Všetky naše produkty sú nové, certifikované a dodávajú sa s oficiálnou zárukou od výrobcu"
		},
		{
			icon: Truck,
			title: "Rýchle doručenie",
			description: "Každá objednávka sa spracuje okamžite s úplnými informáciami o sledovaní po odoslaní"
		},
		{
			icon: Award,
			title: "Najnovšie modely 2023-2025",
			description: "Ponúkame iba najnovšie zariadenia Samsung a  z roku 2023-2025 s oficiálnymi príslušenstvami"
		},
		{
			icon: HeartHandshake,
			title: "Spoľahlivý servis",
			description: "Pracujeme s dôveryhodnými dodávateľmi a poskytujeme kvalitný popredajný servis"
		}
	]

	return (
		<section className="AboutAdvantages">
			<div className="container">
				<div className="AboutAdvantages__container">
					<div className="AboutAdvantages__header">
						<h2 className="AboutAdvantages__title">Prečo si vybrať práve nás?</h2>
						<p className="AboutAdvantages__subtitle">
							Pri nákupe u nás získate nielen kvalitnú techniku, ale aj istotu kvalitného servisu.
							Sme tu pre vás od začiatku až do konca a ceníme si vašu dôveru.
						</p>
					</div>
					<SliderList list={advantages} />

					{/* <div className="AboutAdvantages__grid">
						{advantages.map((advantage, index) => {
							const IconComponent = advantage.icon
							return (
								<div key={index} className="AboutAdvantages__card">
									<div className="AboutAdvantages__card-icon">
										<IconComponent size={32} />
									</div>
									<div className="AboutAdvantages__card-content">
										<h3 className="AboutAdvantages__card-title">
											{advantage.title}
										</h3>
										<p className="AboutAdvantages__card-description">
											{advantage.description}
										</p>
									</div>
								</div>
							)
						})}
					</div> */}
				</div>
			</div>
		</section>
	)
}

export default AboutAdvantages