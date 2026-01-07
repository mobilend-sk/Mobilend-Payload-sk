const API_URL = "http://localhost:5000/api/cart"

const cartService = {

    // ДОДАТИ
    add: async (productLink, quantity, price) => {
        try {
            const res = await fetch(`${API_URL}/add`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productLink,
                    quantity,
                    price
                })
            })

            const result = await res.json()

            // Перевіряємо новий формат відповіді
            if (!result.success) {
                throw new Error(result.message || 'Помилка додавання товару')
            }

            return result.data
        } catch (e) {
            console.error("Cart add error:", e)
            throw e
        }
    },

    // ОНОВИТИ
    update: async (productLink, quantity, price) => {
        try {
            const res = await fetch(`${API_URL}/update`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productLink,
                    quantity,
                    price
                })
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message || 'Помилка оновлення товару')
            }

            return result.data
        } catch (e) {
            console.error("Cart update error:", e)
            throw e
        }
    },

    // ВИДАЛИТИ
    remove: async (productLink) => {
        try {
            const res = await fetch(`${API_URL}/remove`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productLink })
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message || 'Помилка видалення товару')
            }

            return result.data
        } catch (e) {
            console.error("Cart remove error:", e)
            throw e
        }
    },

    // ОТРИМАТИ
    get: async () => {
        try {
            const res = await fetch(`${API_URL}`, {
                method: "GET",
                credentials: "include",
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message || 'Помилка отримання кошика')
            }

            return result.data
        } catch (e) {
            console.error("Cart get error:", e)
            throw e
        }
    },

    // ОНОВИТИ STEP
    updateStep: async (step) => {
        try {
            const res = await fetch(`${API_URL}/update-step`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ step })
            })

            const result = await res.json()

            if (!result.success) {
                throw new Error(result.message || 'Помилка оновлення кроку')
            }

            return result.data
        } catch (e) {
            console.error("Cart update-step error:", e)
            throw e
        }
    }
}

export default cartService