// src/app/katalog/[productLink]/not-found.js
// 404 страница для несуществующих товаров

import Link from 'next/link'

export default function NotFound() {
	return (
		<div className="ProductPage">
			<div className="container">
				<div className="ProductPage__not-found">
					<h1>Produkt sa nenašiel</h1>
					<p>Možno je odkaz nesprávny alebo bol produkt odstránený z nášho katalógu.</p>

					<div style={{
						display: 'flex',
						gap: '20px',
						justifyContent: 'center',
						marginTop: '30px'
					}}>
						<Link
							href="/katalog"
							className="catalog-btn"
							style={{
								padding: '12px 24px',
								background: 'var(--darkBlue)',
								color: 'white',
								textDecoration: 'none',
								borderRadius: '6px',
								fontWeight: '600',
								transition: 'all 0.2s'
							}}
						>
							Prejsť do katalógu
						</Link>

						<Link
							href="/"
							className="home-btn"
							style={{
								padding: '12px 24px',
								background: 'var(--lightGreen)',
								color: 'var(--darkBlue)',
								textDecoration: 'none',
								borderRadius: '6px',
								fontWeight: '600',
								transition: 'all 0.2s'
							}}
						>
							Na hlavnú stránku
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}