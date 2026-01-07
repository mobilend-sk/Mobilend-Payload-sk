"use client"
import Link from "next/link"
import "./Menu.scss"

const Menu = ({ setActiveMenu }) => {

	const closeMenu = () => {
		if (!setActiveMenu) return

		setActiveMenu(false)
	}

	return (
		<nav className="Menu">
			<ul>
				<li><Link onClick={closeMenu} href={"/"}>Hlavná</Link></li>
				<li><Link onClick={closeMenu} href={"/katalog"}>Katalóg</Link></li>
				<li><Link onClick={closeMenu} href={"/blog"}>Blog</Link></li>
				<li><Link onClick={closeMenu} href={"/o-nas"}>O nás</Link></li>
				<li><Link onClick={closeMenu} href={"/caste-otazky"}>Časté otázky</Link></li>
				<li><Link onClick={closeMenu} href={"/kontakty"}>Kontakty</Link></li>
			</ul>
		</nav>
	)
}

export default Menu