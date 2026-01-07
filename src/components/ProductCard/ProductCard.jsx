"use client"
import Image from "next/image"
import "./ProductCard.scss"
import { Plus } from "lucide-react"
import Link from "next/link"
import BuyButton from "../BuyButton/BuyButton"

const ProductCard = ({ product }) => {

	if (!product) return null

	return (
		<div
			className="ProductCard"
		>

			<Link href={`/katalog/${product.productLink}`}>
				<div className="ProductCard__image">
					<Image src={product.mainImage ? `${product.baseImageUrl}/${product.mainImage}` : product.images[0] ? `${product.baseImageUrl}/${product.images[0]}` : "/images/placeholder.webp"} alt="Image" width={200} height={220} />


				</div>
				<div className="ProductCard__Desc">
					{
						product.popular ? <div className="ProductCard__image-popular">
							Populárne
						</div> : ""
					}
					<h3>{product.model}</h3>
				</div>
			</Link>
			{
				product.discount ? <div className="ProductCard__image-discount">
					-{product.discount}%
				</div> : ""
			}
			<div className="ProductCard__bottom">
				<div className="ProductCard__price">
					<div className="ProductCard__price-total">
						{product.price} €
					</div>
					{
						product.discount ? <div className="ProductCard__price-discount">
							{(product.price + (product.price * (product.discount / 100))).toFixed(0)} €
						</div> : ""
					}
				</div>
				<BuyButton
					type="small"
					productLink={product.productLink}
					product={product}
				/>
			</div>
		</div>
	)
}

export default ProductCard