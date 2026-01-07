"use client"
import { useState } from "react"
import { useCart } from "@/hooks/useCart"
import cartService from "@/services/cart.service"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ExternalLink } from "lucide-react"
import "./CartItem.scss"

const CartItem = ({ item, product }) => {
  const { updateQuantity, removeItem, syncCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const calculateDiscountedPrice = (price, discount) => {
    const numPrice = parseFloat(price) || 0
    const numDiscount = parseFloat(discount) || 0
    return numPrice - (numPrice * numDiscount / 100)
  }

  const price = parseFloat(product.price) || 0
  const discount = parseFloat(product.discount) || 0
  const discountedPrice = calculateDiscountedPrice(price, discount)
  const totalPrice = discountedPrice * item.quantity

  const handleQuantityChange = async (newQuantity) => {
    if (isUpdating) return
    setIsUpdating(true)

    try {
      if (newQuantity <= 0) {
        // LOCAL REMOVE
        removeItem(item.productLink)

        // SERVER REMOVE
        const res = await cartService.remove(item.productLink)
        if (res?.success && res.cart?.items) syncCart(res.cart.items)
      } else {
        // LOCAL UPDATE
        updateQuantity(item.productLink, newQuantity)

        // SERVER UPDATE
        const res = await cartService.update(item.productLink, newQuantity)
        if (res?.success && res.cart?.items) syncCart(res.cart.items)
      }
    } catch (error) {
      console.error("Помилка обновлення кількості:", error)
    } finally {
      setTimeout(() => setIsUpdating(false), 50)
    }
  }

  const handleRemoveItem = async () => {
    try {
      // LOCAL
      removeItem(item.productLink)

      // SERVER
      const res = await cartService.remove(item.productLink)
      if (res?.success && res.cart?.items) syncCart(res.cart.items)
    } catch (error) {
      console.error("Помилка видалення:", error)
    }
  }

  return (
    <div className="CartItem">

      <div className="CartItem__image">
        <Link href={`/katalog/${product.productLink}`}>
          <Image
            src={
              product.mainImage
                ? `${product.baseImageUrl}/${product.mainImage}`
                : "/images/placeholder.webp"
            }
            alt={product.model}
            width={120}
            height={120}
            className="CartItem__img"
          />
        </Link>

        {discount > 0 && (
          <div className="CartItem__discount-badge">
            -{discount}%
          </div>
        )}
      </div>

      <div className="CartItem__info">
        <div className="CartItem__header">
          <Link href={`/katalog/${product.productLink}`} className="CartItem__title">
            {product.model}
            <ExternalLink size={16} />
          </Link>

          <button
            className="CartItem__remove-btn"
            onClick={handleRemoveItem}
            title="Odstrániť z košíka"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="CartItem__details">

          <div className="CartItem__price">
            <div className="CartItem__price-current">{discountedPrice.toFixed(2)} €</div>

            {discount > 0 && (
              <div className="CartItem__price-original">{price.toFixed(2)} €</div>
            )}
          </div>

          <div className="CartItem__quantity">
            <button
              className="CartItem__quantity-btn"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              title="Znížiť množstvo"
            >
              <Minus size={16} />
            </button>

            <div className="CartItem__quantity-display">{item.quantity}</div>

            <button
              className="CartItem__quantity-btn"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              title="Zvýšiť množstvo"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="CartItem__total">
            <div className="CartItem__total-label">Celkom:</div>
            <div className="CartItem__total-price">{totalPrice.toFixed(2)} €</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartItem
