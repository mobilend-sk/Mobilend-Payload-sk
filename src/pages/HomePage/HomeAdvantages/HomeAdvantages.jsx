"use client"
import Link from "next/link"
import { Shield, Truck, Award, HeartHandshake, ArrowRight } from "lucide-react"
import SliderList from "@/components/SliderList/SliderList"
import "./HomeAdvantages.scss"

const HomeAdvantages = () => {
	const advantages = [
		{
			icon: Shield,
			title: "Oficiálna záruka",
			description: "100% originálne produkty s oficiálnou zárukou od výrobcu"
		},
		{
			icon: Truck,
			title: "Rýchle doručenie",
			description: "Expresné doručenie s možnosťou sledovania zásielky"
		},
		{
			icon: Award,
			title: "Modely 2023-2025",
			description: "Iba najnovšie zariadenia Samsung a iPhone z roku 2023-2025"
		},
		{
			icon: HeartHandshake,
			title: "Dôveryhodný servis",
			description: "Kvalitný zákaznícky servis a popredajná podpora"
		}
	]

	return (
		<section className="HomeAdvantages">
			<div className="container">
				<div className="HomeAdvantages__container">
					<div className="HomeAdvantages__header">
						<h2 className="HomeAdvantages__title">Prečo nakupovať u nás?</h2>
						<p className="HomeAdvantages__subtitle">
							Sme váš spoľahlivý partner pre nákup najnovších technológií
						</p>
					</div>

					<SliderList list={advantages}/>

					{/* <div className="HomeAdvantages__grid">
						{advantages.map((advantage, index) => {
							const IconComponent = advantage.icon
							return (
								<div key={index} className="HomeAdvantages__card">
									<div className="HomeAdvantages__card-icon">
										<IconComponent size={28} />
									</div>
									<h3 className="HomeAdvantages__card-title">
										{advantage.title}
									</h3>
									<p className="HomeAdvantages__card-description">
										{advantage.description}
									</p>
								</div>
							)
						})}
					</div> */}

					<div className="HomeAdvantages__cta">
						<p className="HomeAdvantages__cta-text">
							Chcete vedieť viac o našej spoločnosti?
						</p>
						<Link href="/o-nas" className="HomeAdvantages__cta-button">
							Zistiť viac o nás
							<ArrowRight size={18} />
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HomeAdvantages