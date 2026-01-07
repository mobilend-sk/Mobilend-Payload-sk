"use client"
import Logotype from "../Logotype/Logotype"
import Menu from "../Menu/Menu"
import { Instagram, Linkedin, Facebook } from "lucide-react"
import "./Footer.scss"

const Footer = () => {


	return (

		<footer className="footer">
			<div className="container">
				<div className="footer__wrapper">
					<div className="footer__part">
						<Logotype />
						<p>Vaše obľúbené miesto pre najnovšie smartfóny, gadgety a technológie. Rýchle doručenie, férové ceny, bez starostí.</p>
					</div>
					<div className="footer__part">
						<Menu />
					</div>
				</div>

				<div className="footer__bottom">
					<p>Mobilend 2025 @ Všetky práva vyhradené</p>

					<a href="mailto:support@mobilend.sk">support@mobilend.sk</a>

					<div className="footer__bottom-social">
						<a href="" target="#">
							<Instagram />
						</a>
						<a href="" target="#">
							<Linkedin />
						</a>
						<a href="" target="#">
							<Facebook />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer