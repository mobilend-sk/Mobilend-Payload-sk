"use client"
import CatalogList from "./CatalogList/CatalogList"
import { Suspense } from "react"

const CatalogPage = () => {

	return (
		<main>
			<Suspense fallback={<div>Načítavajú sa produkty...</div>}>
				<CatalogList />
			</Suspense>
		</main>
	)
}

export default CatalogPage