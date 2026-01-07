"use client"
import "./HeroContacts.scss"

const HeroContacts = () => {

	return (
		<section className="HeroContacts">
			<div className="container">
				<div className="HeroContacts__wrapper">
					<div className="HeroContacts-part">
						<h1>Kontakty</h1>
		
						<div className="HeroContacts-part__contact">
							<h2>Email</h2>
							<a href="mailto:support@mobilend.sk">support@mobilend.sk</a>
						</div>
						<div className="HeroContacts-part__contact">
							<h2>Adresa</h2>
							<a target="_blank" href="https://maps.app.goo.gl/gfhPy2dJwwAR58XD8">Pekná cesta 2459, 831 52
								Bratislava, Rača</a>
						</div>
					</div>
					<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.441489266971!2d17.135069899999998!3d48.198111600000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c8e875982f33d%3A0xff0a60c3acf17e56!2zMTksIFBla27DoSBjZXN0YSAyNDU5LCA4MzEgNTIgUmHEjWEsINCh0LvQvtCy0LDRh9GH0LjQvdCw!5e0!3m2!1suk!2sua!4v1753087689641!5m2!1suk!2sua" width="600" height="450" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
				</div>
			</div>
		</section>
	)
}

export default HeroContacts