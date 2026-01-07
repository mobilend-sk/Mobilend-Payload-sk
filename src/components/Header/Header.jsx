"use client"
import Logotype from "../Logotype/Logotype"
import Menu from "../Menu/Menu"
import SearchComponent from "../SearchComponent/SearchComponent"
import ActiveOrdersComponent from "../ActiveOrdersComponent/ActiveOrdersComponent"
import CartLink from "../CartLink/CartLink"
import { AlignJustify, Link, X } from "lucide-react"
import { useState } from "react"
import "./Header.scss"

const Header = () => {
	const [activeMenu, setActiveMenu] = useState(false)

	return (
		<>
			<header className="header searched">
				<div className="container">
					<div className="header__wrapper">
						<Logotype />
						<div className={`header__menu ${activeMenu ? "active" : ""}`}>
							<Menu setActiveMenu={setActiveMenu} />
						</div>
						<div className="header-ico__wrapper">
							<ActiveOrdersComponent
								apiUrl="http://localhost:5000/api/offer"
								headerSelector=".header"
								activeHeaderClass="header--orders-active"
							/>
							<div className="search__wrapper">
								<SearchComponent />
							</div>
							<div className="header__cart">
								<CartLink />
							</div>
							<button
								className="header__burger"
								onClick={() => setActiveMenu(prev => !prev)}
							>
								{activeMenu ? <X /> : <AlignJustify />}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Мобільна нижня меню */}
			<nav className="mobile-bottom-menu">
				<button
					className="mobile-bottom-menu__katalog">
						<Link href="/katalog"/>
				</button>
				<div className="mobile-bottom-menu__cart">
					<CartLink />
				</div>
				<ActiveOrdersComponent
					apiUrl="http://localhost:5000/api/offer"
					headerSelector=".header"
					activeHeaderClass="header--orders-active"
				/>
				<button
					className="mobile-bottom-menu__burger"
					onClick={() => setActiveMenu(prev => !prev)}
				>
					{activeMenu ? <X /> : <AlignJustify />}
				</button>
			</nav>
		</>
	)
}

export default Header