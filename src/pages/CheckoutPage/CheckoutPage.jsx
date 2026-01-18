"use client"
import { useState, useEffect, Suspense } from "react"
import { useCart } from "@/hooks/useCart"
import cartService from "@/services/cart.service"
import productService from "@/services/productClient.service"

import ProgressBar from "./ProgressBar/ProgressBar"
import StepContact from "./StepContact/StepContact"
import StepDelivery from "./StepDelivery/StepDelivery"
import StepConfirmation from "./StepConfirmation/StepConfirmation"

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import "./CheckoutPage.scss"

const CheckoutPageContent = () => {
	const { items } = useCart()

	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()



	const urlStep = Number(searchParams.get("step")) || 1
	const [currentStep, setCurrentStep] = useState(urlStep)
	const [isInitialized, setIsInitialized] = useState(false)

	const [backendStep, setBackendStep] = useState(1)

	const [productList, setProductList] = useState([])
	const [cartItemsWithProducts, setCartItemsWithProducts] = useState([])

	const [loading, setLoading] = useState(true)
	const [orderCompleted, setOrderCompleted] = useState(false)
	const [showSuccessScreen, setShowSuccessScreen] = useState(false)

	// =============================
	// STAVY FORM z localStorage
	// =============================
	const [contactData, setContactData] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem("checkoutContactData")
			if (saved) {
				try {
					return JSON.parse(saved)
				} catch (e) {
					console.error("Failed to parse contact data:", e)
				}
			}
		}
		return {
			firstName: "",
			lastName: "",
			phone: "",
			email: "",
			comment: ""
		}
	})

	const [deliveryData, setDeliveryData] = useState(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem("checkoutDeliveryData")
			if (saved) {
				try {
					return JSON.parse(saved)
				} catch (e) {
					console.error("Failed to parse delivery data:", e)
				}
			}
		}
		return {
			city: "",
			postalCode: "",
			address: "",
			paymentMethod: "",
			monthlyIncome: "",
			monthlyExpenses: "",
			numberOfChildren: 0
		}
	})

	useEffect(() => {
		const init = async () => {
			setLoading(true)

			try {
				// 1. Отримати step з бекенду
				const cartData = await cartService.get()
				const serverStep = cartData?.cart?.step || 1
				setBackendStep(serverStep)

				// 2. Отримати URL step і параметри
				const urlStep = Number(searchParams.get("step")) || 1
				const urlStatus = searchParams.get("status")
				const urlOrderId = searchParams.get("orderId")
				const urlPaymentId = searchParams.get("paymentId")

				// ✅ ВИНЯТОК: Якщо є параметри платежу - дозволити step 3
				const isPaymentCallback = urlStatus && urlOrderId

				// 3. Визначити правильний step
				let correctStep = serverStep

				// Якщо URL вказує на попередній крок - дозволити
				if (urlStep < serverStep) {
					correctStep = urlStep
				}

				// ✅ Якщо це повернення з платіжки - дозволити step 3
				if (isPaymentCallback && urlStep === 3) {
					correctStep = 3
				}
				// Інакше - якщо URL вказує на наступний крок - заборонити
				else if (urlStep > serverStep) {
					correctStep = serverStep
				}

				// 4. Синхронізувати URL і state
				if (urlStep !== correctStep) {
					router.replace(`${pathname}?step=${correctStep}`)
				}

				setCurrentStep(correctStep)
				setIsInitialized(true)

			} catch (error) {
				console.error("Init error:", error)
				setBackendStep(1)
				setCurrentStep(1)
				setIsInitialized(true)
			} finally {
				setLoading(false)
			}
		}

		init()
	}, [])  // ✅ Запускається ТІЛЬКИ при mount

	// =============================
	// 2️⃣ Реакція на зміну URL (ТІЛЬКИ після ініціалізації)
	// =============================
	useEffect(() => {
		if (!isInitialized) return  // ✅ Пропустити до завершення init

		const urlStep = Number(searchParams.get("step")) || 1
		const urlStatus = searchParams.get("status")
		const urlOrderId = searchParams.get("orderId")

		// ✅ Якщо є параметри платежу - НЕ валідувати step
		const isPaymentCallback = urlStatus && urlOrderId

		if (isPaymentCallback && urlStep === 3) {
			setCurrentStep(3)
			return
		}

		// Якщо URL > backend step - повернути назад
		if (urlStep > backendStep) {
			router.replace(`${pathname}?step=${backendStep}`)
			setCurrentStep(backendStep)
			return
		}

		// Інакше оновити currentStep
		setCurrentStep(urlStep)

	}, [searchParams, backendStep, isInitialized, pathname, router])

	// =============================
	// 3) Nacitanie produktov
	// =============================
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true)
				const products = await productService.getAllProducts()
				setProductList(products)
			} catch (error) {
				console.error("Products load error:", error)
			} finally {
				setLoading(false)
			}
		}
		loadProducts()
	}, [])

	// =============================
	// 4) Spojenie tovaru cart + products
	// =============================
	useEffect(() => {
		if (productList.length === 0) return

		const merged = items
			.map(i => {
				const product = productList.find(p => p.productLink === i.productLink)
				return product ? { ...i, product } : null
			})
			.filter(Boolean)

		setCartItemsWithProducts(merged)
	}, [items, productList])

	// =============================
	// 5) Vyčistenie dát po dokončení objednávky
	// =============================
	useEffect(() => {
		if (orderCompleted && showSuccessScreen) {
			localStorage.removeItem("checkoutContactData")
			localStorage.removeItem("checkoutDeliveryData")
		}
	}, [orderCompleted, showSuccessScreen])

	// =============================
	// Prázdny košík
	// =============================
	if (!loading && cartItemsWithProducts.length === 0 && !orderCompleted) {
		return (
			<main className="CheckoutPage">
				<div className="container">
					<div className="CheckoutPage__empty">
						<ShoppingBag size={64} />
						<h2>Váš košík je prázdny</h2>
						<p>Pred pokračovaním na pokladňu pridajte produkty</p>
						<Link href="/katalog" className="CheckoutPage__empty-link">
							Prejsť do katalógu
						</Link>
					</div>
				</div>
			</main>
		)
	}

	// =============================
	// Tlačidlá krokov
	// =============================
	const goToNextStep = async () => {
		if (currentStep < 3) {
			const next = currentStep + 1

			try {
				await cartService.updateStep(next)
				setBackendStep(next)
				router.push(`${pathname}?step=${next}`)
			} catch (error) {
				console.error("Step update error:", error)
				alert("Chyba pri aktualizácii kroku. Skúste to neskôr.")
			}
		}
	}

	const goToPrevStep = async () => {
		if (currentStep > 1) {
			const prev = currentStep - 1

			try {
				await cartService.updateStep(prev)
				setBackendStep(prev)
				router.push(`${pathname}?step=${prev}`)
			} catch (error) {
				console.error("Step update error:", error)
				alert("Chyba pri aktualizácii kroku. Skúste to neskôr.")
			}
		}
	}

	// =============================
	// Submity formulárov
	// =============================
	const handleContactSubmit = data => {
		setContactData(data)
		localStorage.setItem("checkoutContactData", JSON.stringify(data))
	}

	const handleDeliverySubmit = data => {
		setDeliveryData(data)
		localStorage.setItem("checkoutDeliveryData", JSON.stringify(data))
	}

	const handleOrderComplete = () => {
		setOrderCompleted(true)
		setShowSuccessScreen(true)
	}

	// =============================
	// Render krokov
	// =============================
	const renderStep = () => {
		if (loading) return null

		switch (currentStep) {
			case 1:
				return (
					<StepContact
						initialValues={contactData}
						onSubmit={handleContactSubmit}
						onNext={goToNextStep}
					/>
				)

			case 2:
				return (
					<StepDelivery
						initialValues={deliveryData}
						onSubmit={handleDeliverySubmit}
						onNext={goToNextStep}
						onBack={goToPrevStep}
					/>
				)

			case 3:
				return (
					<StepConfirmation
						contactData={contactData}
						deliveryData={deliveryData}
						cartItems={cartItemsWithProducts}
						onBack={goToPrevStep}
						onOrderComplete={handleOrderComplete}
					/>
				)

			default:
				return null
		}
	}

	// =============================
	// Render stránky
	// =============================
	return (
		<main className="CheckoutPage">
			<div className="container">

				{/* breadcrumbs */}
				{!showSuccessScreen && (
					<div className="CheckoutPage__breadcrumbs">
						<Link href="/cart" className="CheckoutPage__breadcrumb">
							<ArrowLeft size={16} />
							Košík
						</Link>
						<span className="CheckoutPage__breadcrumb-separator">/</span>
						<span className="CheckoutPage__breadcrumb CheckoutPage__breadcrumb--current">
							Potvrdenie kúpy
						</span>
					</div>
				)}

				{/* progressbar */}
				{!showSuccessScreen && (
					<ProgressBar currentStep={currentStep} />
				)}

				{/* obsah */}
				<div className="CheckoutPage__content">
					{renderStep()}
				</div>

			</div>
		</main>
	)
}

// -------------------------
// Suspense wrapper
// -------------------------
const CheckoutPage = () => {
	return (
		<Suspense fallback={
			<main className="CheckoutPage">
				<div className="container">
					<div className="CheckoutPage__loading">
						<div className="spinner"></div>
						<p>Načítava sa pokladňa...</p>
					</div>
				</div>
			</main>
		}>
			<CheckoutPageContent />
		</Suspense>
	)
}

export default CheckoutPage