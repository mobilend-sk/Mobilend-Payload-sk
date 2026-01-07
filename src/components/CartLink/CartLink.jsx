"use client"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCartCount } from "@/hooks/useCart"
import "./CartLink.scss"

const CartLink = () => {
	const cartCount = useCartCount()

	return (
		<div className="CartLink">
			<Link href={"/cart"}>
				<ShoppingBag />
				{cartCount > 0 && (
					<span className="CartLink__badge">
						{cartCount > 99 ? '99+' : cartCount}
					</span>
				)}
			</Link>
		</div>
	)
}

export default CartLink