"use client"
import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useCart } from "@/hooks/useCart"
import {
	ArrowLeft,
	ShoppingBag,
	User,
	MapPin,
	Check,
	Loader2
} from "lucide-react"
import "./StepConfirmation.scss"

// =============================
// КОНСТАНТИ (оновлені)
// =============================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const MAX_RETRIES = 60 // Збільшено до 60 спроб
const INITIAL_RETRY_INTERVAL = 10000 // Початковий інтервал 3 сек
const MAX_RETRY_INTERVAL = 30000 // Максимальний інтервал 30 сек
const BACKOFF_MULTIPLIER = 1.5 // Множник для exponential backoff

const PAYMENT_METHODS = {
	cash_on_delivery: 'Dobierka (platba pri prevzatí)',
	credit: 'Kúpa na splátky',
	online_payment: 'Online platba kartou'
}

// =============================
// HELPER FUNKCIE
// =============================
const removeDiacritics = (str = "") => {
	return str
		.normalize("NFKD")
		.replace(/[\p{Diacritic}]/gu, "")
}

const sanitizeRemittance = (text = "") => {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^A-Za-z0-9\/\-\?:\(\)\.,'\+ ]/g, "")
		.trim();
};

const formatPhoneNumber = (phone) => {
	if (!phone) return ""
	let cleaned = phone.replace(/[^\d+]/g, "")
	if (cleaned.startsWith("0")) cleaned = "+421" + cleaned.substring(1)
	if (!cleaned.startsWith("+")) cleaned = "+421" + cleaned
	return cleaned.replace(/\s/g, "")
}

const generateOrderNumber = () => {
	const timestamp = Date.now().toString().slice(-6)
	const random = Math.random().toString(36).substr(2, 3).toUpperCase()
	return `${timestamp}${random}`
}

// =============================
// EXPONENTIAL BACKOFF HELPER
// =============================
const getRetryInterval = (retryCount) => {
	const interval = INITIAL_RETRY_INTERVAL * Math.pow(BACKOFF_MULTIPLIER, retryCount)
	return Math.min(interval, MAX_RETRY_INTERVAL)
}

// =============================
// API SERVISY (оновлені)
// =============================
const orderAPI = {
	// Спрощений endpoint - передаємо paymentId напряму
	checkOrderStatus: async (orderId, paymentId) => {
		const response = await fetch(`${API_BASE_URL}/api/offer/check-order-status/${orderId}/${paymentId}`, {
			method: 'GET',
			credentials: 'include'
		})
		const result = await response.json()

		if (!result.success) {
			throw new Error(result.message || 'Chyba pri kontrole stavu objednávky')
		}

		return result.data
	},

	checkPaymentStatus: async (paymentId) => {
		const response = await fetch(`${API_BASE_URL}/api/offer/status/${paymentId}`, {
			method: 'GET',
			credentials: 'include'
		})
		const result = await response.json()

		if (!result.success) {
			throw new Error(result.message || 'Chyba pri kontrole stavu platby')
		}

		return result.data
	},

	updateOrderStatus: async (orderId, status) => {
		const response = await fetch(`${API_BASE_URL}/api/offer/${orderId}/status`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ status })
		})
		const result = await response.json()

		if (!result.success) {
			throw new Error(result.message || 'Chyba pri aktualizácii stavu')
		}

		return result.data
	},

	createOrder: async (orderData) => {
		const response = await fetch(`${API_BASE_URL}/api/offer/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(orderData)
		})
		const result = await response.json()

		if (!response.ok || !result.success) {
			throw new Error(result.message || 'Chyba pri vytváraní objednávky')
		}

		return result.data
	}
}

// =============================
// LOKALNE ULOZISKO
// =============================
const storage = {
	getPendingOrder: () => ({
		orderId: localStorage.getItem('pendingOrderId'),
		orderNumber: localStorage.getItem('pendingOrderNumber'),
		paymentId: localStorage.getItem('paymentId')
	}),

	setPendingOrder: (orderId, orderNumber) => {
		localStorage.setItem('pendingOrderId', orderId)
		localStorage.setItem('pendingOrderNumber', orderNumber)
	},

	setPaymentId: (paymentId) => {
		localStorage.setItem('paymentId', paymentId)
	},

	clearPendingOrder: () => {
		localStorage.removeItem('pendingOrderId')
		localStorage.removeItem('pendingOrderNumber')
		localStorage.removeItem('paymentId')
	}
}

// =============================
// HLAVNY KOMPONENT
// =============================
const StepConfirmation = ({
	contactData = {},
	deliveryData = {},
	cartItems = [],
	onBack = () => { },
	onOrderComplete = () => { }
}) => {
	const { totalItems = 0, clearCart = () => { } } = useCart()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isOrderComplete, setIsOrderComplete] = useState(false)
	const [orderNumber, setOrderNumber] = useState(null)
	const [isCheckingPayment, setIsCheckingPayment] = useState(false)
	const [retryCount, setRetryCount] = useState(0)

	const timeoutRef = useRef(null)
	const isMountedRef = useRef(true)

	// =============================
	// VYPOCTY S MEMOIZACIOU
	// =============================
	const calculateDiscountedPrice = useCallback((price = 0, discount = 0) => {
		const numPrice = parseFloat(price) || 0
		const numDiscount = parseFloat(discount) || 0
		return numPrice - (numPrice * numDiscount) / 100
	}, [])

	const totalAmount = useMemo(() => {
		if (!Array.isArray(cartItems) || cartItems.length === 0) return 0

		const total = cartItems.reduce((sum, item) => {
			const quantity = parseInt(item?.quantity) || 0
			const price = parseFloat(item?.product?.price) || 0
			const discount = parseFloat(item?.product?.discount) || 0
			const finalPrice = discount > 0
				? calculateDiscountedPrice(price, discount)
				: price

			return sum + finalPrice * quantity
		}, 0)

		return parseFloat(total.toFixed(2))
	}, [cartItems, calculateDiscountedPrice])

	const orderItems = useMemo(() => {
		if (!Array.isArray(cartItems)) return []

		return cartItems.map(item => {
			const quantity = parseInt(item?.quantity) || 0
			const product = item?.product || {}
			const price = parseFloat(product?.price) || 0
			const discount = parseFloat(product?.discount) || 0
			const finalPrice = discount > 0
				? calculateDiscountedPrice(price, discount)
				: price
			const totalItemPrice = parseFloat((finalPrice * quantity).toFixed(2))

			return {
				quantity,
				totalItemPrice,
				itemDetail: {
					itemDetailSK: {
						itemName: product?.model || "Neznámy produkt",
						itemDescription: product?.description || product?.model || ""
					},
					itemDetailEN: {
						itemName: product?.model || "Unknown product",
						itemDescription: product?.description || product?.model || ""
					}
				},
				itemInfoURL: product?.link
					? `https://yourdomain.com/product/${product.link}`
					: "https://yourdomain.com"
			}
		})
	}, [cartItems, calculateDiscountedPrice])

	// =============================
	// SPRACOVANIE USPESNEJ OBJEDNAVKY
	// =============================
	const handleOrderSuccess = useCallback((orderNum) => {
		setOrderNumber(orderNum)
		setIsOrderComplete(true)
		onOrderComplete()
		clearCart()
		storage.clearPendingOrder()

		window.history.replaceState({}, document.title, window.location.pathname + '?step=3')
		window.scrollTo({ top: 0, behavior: "smooth" })
	}, [onOrderComplete, clearCart])

	// =============================
	// OНОВЛЕНА ФУНКЦІЯ ПЕРЕВІРКИ ПЛАТЕЖУ
	// =============================
	const checkPaymentStatus = useCallback(async () => {
		if (!isMountedRef.current) return

		const { orderId, orderNumber: storedOrderNumber, paymentId } = storage.getPendingOrder()

		if (!orderId || !paymentId) {
			console.log('❌ Chýba orderId alebo paymentId')
			setIsCheckingPayment(false)
			return
		}

		try {
			const currentRetry = retryCount + 1
			const nextInterval = getRetryInterval(retryCount)

			console.log(`🔄 Kontrola ${currentRetry}/${MAX_RETRIES} (ďalšia za ${nextInterval / 1000}s)...`)

			// 1️⃣ Запит напряму з paymentId
			const orderData = await orderAPI.checkOrderStatus(orderId, paymentId)
			const orderStatus = orderData?.order?.status
			const paymentStatus = orderData?.paymentStatus

			console.log('📦 Order status:', orderStatus, '| Payment status:', paymentStatus)

			// ✅ Замовлення вже оплачене
			if (orderStatus === 'paid' || paymentStatus === 'success') {
				console.log('✅ Objednávka je zaplatená!')

				if (isMountedRef.current) {
					handleOrderSuccess(storedOrderNumber)
					setIsCheckingPayment(false)
				}
				return
			}

			// ❌ Замовлення скасоване
			if (orderStatus === 'cancelled' || paymentStatus === 'failed') {
				console.log('❌ Objednávka bola zrušená')
				alert('Platba zlyhala. Skúste to neskôr.')
				storage.clearPendingOrder()

				if (isMountedRef.current) {
					window.history.replaceState({}, document.title, window.location.pathname + '?step=3')
					setIsCheckingPayment(false)
				}
				return
			}

			// ⏳ Платіж ще обробляється
			if (paymentStatus === 'pending' || orderStatus === 'pending') {
				console.log(`⏳ Platba sa spracováva... (pokus ${currentRetry}/${MAX_RETRIES})`)
				setRetryCount(prev => prev + 1)

				if (currentRetry < MAX_RETRIES && isMountedRef.current) {
					timeoutRef.current = setTimeout(checkPaymentStatus, nextInterval)
				} else {
					console.warn('⚠️ Dosiahnutý maximálny počet pokusov')
					alert('Nepodarilo sa overiť stav platby v reálnom čase. Skontrolujte svoj email alebo sa prihláste na stránku neskôr.')
					setIsCheckingPayment(false)
				}
				return
			}

			// ⚠️ Neznámy stav
			console.warn('⚠️ Neznámy stav objednávky')
			setRetryCount(prev => prev + 1)

			if (currentRetry < MAX_RETRIES && isMountedRef.current) {
				timeoutRef.current = setTimeout(checkPaymentStatus, nextInterval)
			} else {
				alert('Nepodarilo sa overiť stav platby. Skúste to neskôr.')
				setIsCheckingPayment(false)
			}

		} catch (err) {
			console.error('❌ Chyba pri kontrole:', err)
			setRetryCount(prev => prev + 1)

			const currentRetry = retryCount + 1
			const nextInterval = getRetryInterval(retryCount)

			if (currentRetry < MAX_RETRIES && isMountedRef.current) {
				console.log(`🔄 Opakovaný pokus za ${nextInterval / 1000}s...`)
				timeoutRef.current = setTimeout(checkPaymentStatus, nextInterval)
			} else {
				alert('Chyba pri kontrole platby. Skúste to neskôr.')
				setIsCheckingPayment(false)
			}
		}
	}, [retryCount, handleOrderSuccess])

	// =============================
	// OНОВЛЕНИЙ useEffect ДЛЯ URL ПАРАМЕТРІВ
	// =============================
	useEffect(() => {
		isMountedRef.current = true

		// Перевіряємо URL параметри
		const urlParams = new URLSearchParams(window.location.search)
		const urlStatus = urlParams.get('status')
		const urlOrderId = urlParams.get('orderId')
		const urlOrderNumber = urlParams.get('orderNumber')
		const urlPaymentId = urlParams.get('paymentId')

		// Якщо прийшов success з бекенду
		if (urlStatus === 'success' && urlOrderNumber) {
			console.log('✅ Otримано success з бекенду')
			storage.clearPendingOrder()
			handleOrderSuccess(urlOrderNumber)
			return () => {
				isMountedRef.current = false
			}
		}

		// Якщо прийшов failed з бекенду
		if (urlStatus === 'failed') {
			console.log('❌ Otримано failed з бекенду')
			storage.clearPendingOrder()
			alert('Platba zlyhala. Skúste to neskôr.')
			return () => {
				isMountedRef.current = false
			}
		}

		// Якщо статус pending або checking - починаємо polling
		if ((urlStatus === 'pending' || urlStatus === 'checking') && urlOrderId) {
			console.log('⏳ Platba sa spracováva, začíname polling...')

			if (urlPaymentId) {
				storage.setPaymentId(urlPaymentId)
			}

			storage.setPendingOrder(urlOrderId, urlOrderNumber || generateOrderNumber())
			setIsCheckingPayment(true)
			setRetryCount(0)
			checkPaymentStatus()
		} else {
			// Перевіряємо localStorage
			const { orderId, orderNumber: storedOrderNumber } = storage.getPendingOrder()

			if (orderId && storedOrderNumber && !isOrderComplete) {
				console.log('🔍 Nájdená pending objednávka v localStorage')
				setIsCheckingPayment(true)
				setRetryCount(0)
				checkPaymentStatus()
			}
		}

		return () => {
			isMountedRef.current = false
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	// =============================
	// KONTROLA PRI NAVRATE NA KARTU
	// =============================
	useEffect(() => {
		const handleVisibilityChange = () => {
			const { orderId } = storage.getPendingOrder()

			if (document.visibilityState === 'visible' && orderId && !isOrderComplete) {
				console.log('👁️ Karta aktívna, kontrolujeme platbu...')
				setRetryCount(0)
				setIsCheckingPayment(true)
				checkPaymentStatus()
			}
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
	}, [isOrderComplete, checkPaymentStatus])

	// =============================
	// PRIPRAVA DAT OBJEDNAVKY
	// =============================
	const prepareOrderData = useCallback((newOrderNumber) => {
		const cleanFirstName = (contactData?.firstName || "")
			.replace(/[^a-zA-Z0-9À-ž ]/g, "");

		const cleanLastName = (contactData?.lastName || "")
			.replace(/[^a-zA-Z0-9À-ž ]/g, "");

		const cleanedCardHolder = removeDiacritics(
			`${cleanFirstName} ${cleanLastName}`.trim()
		);

		const sanitizedRemittance =
			sanitizeRemittance(contactData?.comment || newOrderNumber);

		return {
			basePayment: {
				instructedAmount: {
					amountValue: totalAmount,
					currency: "EUR"
				},
				endToEnd: {
					variableSymbol: "1",
					specificSymbol: "2",
					constantSymbol: "3"
				}
			},
			userData: {
				firstName: cleanFirstName,
				lastName: cleanLastName,
				email: contactData?.email || "",
				externalApplicantId: newOrderNumber,
				phone: formatPhoneNumber(contactData?.phone)
			},
			bankTransfer: {
				remittanceInformationUnstructured: sanitizedRemittance
			},
			cardDetail: {
				billingAddress: {
					country: "SK",
					streetName: deliveryData?.street || "",
					buildingNumber: deliveryData?.houseNumber || "",
					townName: deliveryData?.city || "",
					postCode: deliveryData?.postalCode || ""
				},
				cardHolder: cleanedCardHolder,
				isPreAuthorization: false,
				shippingAddress: {
					country: "SK",
					streetName: deliveryData?.street || "",
					buildingNumber: deliveryData?.houseNumber || "",
					townName: deliveryData?.city || "",
					postCode: deliveryData?.postalCode || ""
				}
			},

			payLater: {
				order: {
					orderNo: newOrderNumber,
					orderItems,
					preferredLoanDuration: 24,
					downPayment: 0
				},
				capacityInfo: {
					monthlyIncome: parseFloat(deliveryData?.monthlyIncome) || 0,
					monthlyExpenses: parseFloat(deliveryData?.monthlyExpenses) || 0,
					numberOfChildren: parseInt(deliveryData?.numberOfChildren) || 0
				}
			},

			_metadata: {
				orderNumber: newOrderNumber,
				paymentMethod: deliveryData?.paymentMethod || "",
				totalItems: totalItems || 0,
				timestamp: new Date().toISOString(),
				status: "pending"
			}
		};
	}, [contactData, deliveryData, totalAmount, totalItems, orderItems]);

	// =============================
	// POTVRDENIE OBJEDNAVKY
	// =============================
	const handleConfirmOrder = useCallback(async () => {
		setIsSubmitting(true);

		try {
			const paymentMethod = deliveryData?.paymentMethod;
			const newOrderNumber = generateOrderNumber();
			const orderData = prepareOrderData(newOrderNumber);

			// 1️⃣ Dobierka — просто створюємо замовлення, без редіректу
			if (paymentMethod === "cash_on_delivery") {
				await orderAPI.createOrder(orderData);
				handleOrderSuccess(newOrderNumber);
				return;
			}

			// 2️⃣ Splátky — очікуємо loanRedirectUrl
			if (paymentMethod === "credit") {
				const responseData = await orderAPI.createOrder(orderData);

				if (responseData?.loanRedirectUrl) {
					window.location.replace(responseData.loanRedirectUrl);
					return;
				}

				throw new Error("Chýba loanRedirectUrl pre splátky");
			}

			// 3️⃣ Online kartou — TatraPay flow
			const responseData = await orderAPI.createOrder(orderData);

			if (responseData.tatraPayPlusUrl && responseData.orderId) {
				storage.setPendingOrder(responseData.orderId, newOrderNumber);
				window.location.replace(responseData.tatraPayPlusUrl);
				return;
			}

			throw new Error("Chýba orderId alebo URL na online platbu");

		} catch (error) {
			console.error("❌ Chyba:", error);
			alert(error.message || "Chyba pri odoslaní objednávky.");
			setIsSubmitting(false);
		}
	}, [deliveryData, prepareOrderData, handleOrderSuccess]);

	// =============================
	// POMOCNE FUNKCIE PRE RENDER
	// =============================
	const getPaymentMethodLabel = useCallback((method) => {
		return PAYMENT_METHODS[method] || 'Neznámy spôsob platby'
	}, [])

	// =============================
	// RENDER: KONTROLA PLATBY (оновлений)
	// =============================
	if (isCheckingPayment) {
		const progress = Math.min((retryCount / MAX_RETRIES) * 100, 100)
		const nextInterval = getRetryInterval(retryCount)

		return (
			<div className="StepConfirmation">
				<div className="StepConfirmation__success">
					<div className="StepConfirmation__success-icon">
						<Loader2 size={48} className="spinning" />
					</div>
					<h2 className="StepConfirmation__success-title">
						Kontrola stavu platby...
					</h2>
					<p className="StepConfirmation__success-text">
						Prosím, počkajte chvíľu. Prebieha overovanie platby.
					</p>
				</div>
			</div>
		)
	}

	// =============================
	// RENDER: USPESNA OBJEDNAVKA
	// =============================
	if (isOrderComplete) {
		return (
			<div className="StepConfirmation">
				<div className="StepConfirmation__success">
					<div className="StepConfirmation__success-icon">
						<Check size={48} />
					</div>
					<h2 className="StepConfirmation__success-title">
						Objednávka bola úspešne odoslaná!
					</h2>
					<p className="StepConfirmation__success-subtitle">
						Číslo objednávky: <strong>{orderNumber}</strong>
					</p>
					<p className="StepConfirmation__success-text">
						Ďakujeme za Vašu objednávku. Čoskoro Vás budeme kontaktovať.
					</p>
					<button
						className="StepConfirmation__success-btn"
						onClick={() => (window.location.href = "/")}
					>
						Pokračovať na hlavnú stránku
					</button>
				</div>
			</div>
		)
	}

	// =============================
	// RENDER: HLAVNA FORMA
	// =============================
	return (
		<div className="StepConfirmation">
			<div className="StepConfirmation__header">
				<h2 className="StepConfirmation__title">Potvrdenie objednávky</h2>
				<p className="StepConfirmation__subtitle">
					Skontrolujte údaje pred potvrdením objednávky
				</p>
			</div>

			<div className="StepConfirmation__content">
				{/* Produkty */}
				<div className="StepConfirmation__section">
					<h3 className="StepConfirmation__section-title">
						<ShoppingBag size={20} />
						Objednané produkty ({totalItems || 0})
					</h3>

					<div className="StepConfirmation__items">
						{Array.isArray(cartItems) && cartItems.length > 0 ? (
							cartItems.map((item, index) => {
								const quantity = parseInt(item?.quantity) || 0
								const product = item?.product || {}
								const model = product?.model || "Neznámy produkt"
								const price = parseFloat(product?.price) || 0
								const discount = parseFloat(product?.discount) || 0
								const finalPrice = discount > 0
									? calculateDiscountedPrice(price, discount)
									: price
								const totalPrice = finalPrice * quantity

								return (
									<div key={index} className="StepConfirmation__item">
										<div className="StepConfirmation__item-info">
											<span className="StepConfirmation__item-name">{model}</span>
											<span className="StepConfirmation__item-quantity">{quantity}x</span>
										</div>
										<div className="StepConfirmation__item-prices">
											{discount > 0 && (
												<span className="StepConfirmation__item-original">
													€{price.toFixed(2)}
												</span>
											)}
											<span className="StepConfirmation__item-price">
												€{totalPrice.toFixed(2)}
											</span>
										</div>
									</div>
								)
							})
						) : (
							<p className="StepConfirmation__empty">Košík je prázdny.</p>
						)}
					</div>

					<div className="StepConfirmation__total">
						<span className="StepConfirmation__total-label">Celková suma:</span>
						<span className="StepConfirmation__total-price">
							€{totalAmount.toFixed(2)}
						</span>
					</div>
				</div>

				{/* Kontaktné údaje */}
				<div className="StepConfirmation__section">
					<h3 className="StepConfirmation__section-title">
						<User size={20} />
						Kontaktné údaje
					</h3>
					<p className="StepConfirmation__info">
						{contactData?.firstName || ""} {contactData?.lastName || ""},{" "}
						{contactData?.phone || ""}, {contactData?.email || ""}
						{contactData?.comment && (
							<span className="StepConfirmation__comment">
								<br />
								Poznámka: {contactData.comment}
							</span>
						)}
					</p>
				</div>

				{/* Doručenie a platba */}
				<div className="StepConfirmation__section">
					<h3 className="StepConfirmation__section-title">
						<MapPin size={20} />
						Doručenie a platba
					</h3>
					<p className="StepConfirmation__info">
						<strong>Adresa:</strong>{" "}
						{deliveryData?.address || ""}, {deliveryData?.postalCode || ""}{" "}
						{deliveryData?.city || ""}
						<br />
						<strong>Platba:</strong>{" "}
						{getPaymentMethodLabel(deliveryData?.paymentMethod)}
					</p>
				</div>
			</div>

			{/* Tlačidlá */}
			<div className="StepConfirmation__actions">
				<button
					type="button"
					className="StepConfirmation__back-btn"
					onClick={() => {
						window.scrollTo({ top: 0, behavior: "smooth" })
						setTimeout(() => onBack(), 300)
					}}
					disabled={isSubmitting}
				>
					<ArrowLeft size={18} />
					Späť
				</button>

				<button
					type="button"
					className="StepConfirmation__confirm-btn"
					onClick={handleConfirmOrder}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2 size={18} className="spinning" />
							Spracováva sa...
						</>
					) : (
						<>
							<Check size={18} />
							Potvrdiť objednávku
						</>
					)}
				</button>
			</div>
		</div>
	)
}

export default StepConfirmation