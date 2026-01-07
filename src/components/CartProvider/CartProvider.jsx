"use client"
import { useEffect, useState } from 'react'
import useCartStore from '@/stores/cartStore'

const CartProvider = ({ children }) => {
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		// Принудительная гидрация store из localStorage
		useCartStore.persist.rehydrate()
		setIsHydrated(true)
	}, [])

	// Показываем children только после гидрации
	if (!isHydrated) {
		return <div>{children}</div>
	}

	return <div>{children}</div>
}

export default CartProvider