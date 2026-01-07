import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
    persist(
        (set, get) => ({

            items: [],

            // =====================
            // ДОДАТИ ТОВАР
            // =====================
            addItem: (productLink, price) => {
                const items = get().items
                const existing = items.find(i => i.productLink === productLink)

                if (existing) {
                    set({
                        items: items.map(i =>
                            i.productLink === productLink
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        )
                    })
                } else {
                    set({
                        items: [...items, { productLink, quantity: 1, price }]
                    })
                }
            },

            // =====================
            // ВИДАЛИТИ ТОВАР
            // =====================
            removeItem: (productLink) => {
                set({
                    items: get().items.filter(i => i.productLink !== productLink)
                })
            },

            // =====================
            // ОНОВИТИ КІЛЬКІСТЬ
            // =====================
            updateQuantity: (productLink, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(productLink)
                    return
                }

                const items = get().items
                const existing = items.find(i => i.productLink === productLink)

                set({
                    items: items.map(i =>
                        i.productLink === productLink
                            ? { ...i, quantity, price: existing?.price }
                            : i
                    )
                })
            },

            increaseQuantity: (productLink) => {
                const item = get().items.find(i => i.productLink === productLink)
                if (item) {
                    get().updateQuantity(productLink, item.quantity + 1)
                }
            },

            decreaseQuantity: (productLink) => {
                const item = get().items.find(i => i.productLink === productLink)
                if (!item) return

                if (item.quantity <= 1) {
                    get().removeItem(productLink)
                } else {
                    get().updateQuantity(productLink, item.quantity - 1)
                }
            },

            getItemQuantity: (productLink) => {
                const item = get().items.find(i => i.productLink === productLink)
                return item ? item.quantity : 0
            },

            isItemInCart: (productLink) => {
                return get().items.some(i => i.productLink === productLink)
            },

            getTotalItems: () => {
                return get().items.reduce((t, i) => t + i.quantity, 0)
            },

            clearCart: () => set({ items: [] }),

            // Підрахунок суми
            getTotalPrice: () => {
                return get().items.reduce((t, i) => {
                    const price = parseFloat(i.price) || 0
                    return t + price * i.quantity
                }, 0)
            },

            // Для checkout (з продуктами)
            getCartItemsWithProducts: (productList) => {
                return get().items
                    .map(item => {
                        const product = productList.find(p => p.productLink === item.productLink)
                        return {
                            ...item,
                            product: product || null
                        }
                    })
                    .filter(i => i.product !== null)
            },

            // =====================
            // СИНХРОНІЗАЦІЯ З БЕКЕНДОМ
            // =====================
            syncCart: (serverItems) => {
                const normalized = serverItems.map(item => ({
                    productLink: item.productLink || item.productId,
                    quantity: item.quantity,
                    price: item.price  
                }))

                set({ items: normalized })
            }

        }),
        {
            name: 'shopping-cart',
        }
    )
)

export default useCartStore
