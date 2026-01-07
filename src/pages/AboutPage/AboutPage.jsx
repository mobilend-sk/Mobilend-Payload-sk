"use client"
import AboutHero from "./AboutHero/AboutHero"
import AboutAdvantages from "./AboutAdvantages/AboutAdvantages"
import "./AboutPage.scss"

const AboutPage = () => {
	return (
		<main className="AboutPage">
			<AboutHero />
			<AboutAdvantages />
		</main>
	)
}

export default AboutPage