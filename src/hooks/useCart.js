import useCartStore from "@/stores/cartStore"
import { useEffect, useState } from "react"

// 🔢 Кількість всіх товарів у кошику
export const useCartCount = () => {
  return useCartStore(state => state.getTotalItems())
}

// 📦 Кількість КОНКРЕТНОГО товару по productLink
export const useCartItemQuantity = (productLink) => {
  return useCartStore(state => state.getItemQuantity(productLink))
}

// ✅ Чи є товар у кошику
export const useIsItemInCart = (productLink) => {
  return useCartStore(state => state.isItemInCart(productLink))
}

// 🧠 Основний хук для роботи з корзиною
export const useCart = () => {
  // Стан, який буде ре-рендерити компоненти при зміні корзини
  const items = useCartStore(state => state.items)
  const totalItems = useCartStore(state => state.getTotalItems())

  // Дії
  const addItem = useCartStore(state => state.addItem)
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const increaseQuantity = useCartStore(state => state.increaseQuantity)
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity)
  const clearCart = useCartStore(state => state.clearCart)

  // Синхронізація з backend (ми її додали в cartStore)
  const syncCart = useCartStore(state => state.syncCart)

  // Утиліти
  const getItemQuantity = useCartStore(state => state.getItemQuantity)
  const isItemInCart = useCartStore(state => state.isItemInCart)
  const getTotalPrice = useCartStore(state => state.getTotalPrice)
  const getCartItemsWithProducts = useCartStore(state => state.getCartItemsWithProducts)

  return {
    items,
    totalItems,

    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,

    syncCart,

    getItemQuantity,
    isItemInCart,
    getTotalPrice,
    getCartItemsWithProducts,
  }
}
