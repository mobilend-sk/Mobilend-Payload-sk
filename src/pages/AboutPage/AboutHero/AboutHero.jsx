"use client"
import Image from "next/image"
import "./AboutHero.scss"

const AboutHero = () => {
	return (
		<section className="AboutHero">
			<div className="container">
				<div className="AboutHero__container">
					<div className="AboutHero__image">
						<Image
							src="/images/o-nas.webp"
							alt="O našej spoločnosti"
							width={600}
							height={400}
							priority
							className="AboutHero__img"
						/>
					</div>
					<div className="AboutHero__content">
						<h1 className="AboutHero__title">O našej spoločnosti</h1>
						<p className="AboutHero__subtitle">
							Poskytujeme vám inteligentné riešenia pre všetky vaše technické potreby
						</p>
						<div className="AboutHero__text">
							<p>
								Sme online technický obchod špecializujúci sa na najnovšie smartfóny a tablety iPhone a Samsung
								(modely 2023-2025) spolu s oficiálnymi príslušenstvami. Všetky naše produkty sú úplne nové,
								certifikované a dodávajú sa s oficiálnou zárukou a rýchlym doručením.
							</p>
							<p>
								Naším poslaním je urobiť nákup technológií jednoduchým, bezpečným a pohodlným.
								Pracujeme iba s dôveryhodnými dodávateľmi, aby sme zaručili pravosť produktov
								a spoľahlivý popredajný servis.
							</p>
							<p>
								Každá objednávka sa spracuje rýchlo a ihneď po odoslaní dostanete úplné údaje
								o sledovaní. Ceníme si vašu dôveru a snažíme sa poskytovať hladký nákupný zážitok
								od začiatku až do konca.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AboutHero