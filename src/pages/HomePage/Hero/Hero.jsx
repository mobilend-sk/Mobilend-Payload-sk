"use client"
import Link from "next/link"
import "./Hero.scss"

const Hero = () => {

	return (
		<section className="Hero">
			<div className="container">
				<div className="Hero__wrapper">
					<h1>Vitajte v našom online obchode s elektronikou</h1>
					<p>Objavte najnovšie technologické produkty, od tabletov a smartfónov až po rôzne príslušenstvo.</p>
					<p>Preskúmajte náš široký výber a nájdite dokonalý gadget aj pre tie najnečakanejšie nápady!</p>
					<Link className="btn Hero__btn" href={"/katalog"}>Nakupuj</Link>
				</div>
			</div>
		</section>
	)
}

export default Hero