"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { MapPin, CreditCard, ArrowLeft, Wallet, TrendingUp, Users } from 'lucide-react'
import "./StepDelivery.scss"

const StepDelivery = ({ initialValues, onSubmit, onNext, onBack }) => {
	// Схема валидації з Yup
	const validationSchema = Yup.object({
		city: Yup.string()
			.matches(
				/^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž-]+$/,
				'Mesto môže obsahovať iba písmená a znak "-"'
			)
			.min(2, 'Mesto musí mať aspoň 2 znaky')
			.max(100, 'Názov mesta je príliš dlhý')
			.required('Mesto je povinné'),

		postalCode: Yup.string()
			.matches(/^\d{3}\s\d{2}$/, 'PSČ musí byť ve formáte XXX XX')
			.required('PSČ je povinné'),

		street: Yup.string()
			.matches(
				/^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž\s.-]+$/,
				'Ulica môže obsahovať písmená a znaky "-","."'
			)
			.min(2, 'Názov ulice je príliš krátky')
			.max(100, 'Názov ulice je príliš dlhý')
			.required('Ulica je povinná'),

		houseNumber: Yup.string()
			.matches(
				/^[0-9]+[A-Za-z]?$/,
				'Číslo domu musí byť číslo, prípadne s písmenom (napr. 123 alebo 123A)'
			)
			.required('Číslo domu je povinné'),

		paymentMethod: Yup.string()
			.required('Vyberte spôsob platby'),

		// Podmienené polia pre kreditné platby
		monthlyIncome: Yup.number().when('paymentMethod', {
			is: 'credit',
			then: (schema) => schema
				.min(0, 'Príjem musí byť kladné číslo')
				.required('Mesačný príjem je povinný pre kúpu na splátky'),
			otherwise: (schema) => schema.nullable()
		}),

		monthlyExpenses: Yup.number().when('paymentMethod', {
			is: 'credit',
			then: (schema) => schema
				.min(0, 'Výdavky musia byť kladné číslo')
				.required('Mesačné výdavky sú povinné pre kúpu na splátky'),
			otherwise: (schema) => schema.nullable()
		}),

		numberOfChildren: Yup.number().when('paymentMethod', {
			is: 'credit',
			then: (schema) => schema
				.integer('Počet detí musí byť celé číslo')
				.min(0, 'Počet detí nemôže byť záporný')
				.max(20, 'Maximálny počet detí je 20')
				.required('Počet detí je povinný pre kúpu na splátky'),
			otherwise: (schema) => schema.nullable()
		})
	})

	// Значення за замовчуванням
	const defaultValues = {
		city: '',
		postalCode: '',
		street: '',
		houseNumber: '',
		paymentMethod: '',
		monthlyIncome: '',
		monthlyExpenses: '',
		numberOfChildren: 0,
		...initialValues
	}

	// Функція для форматування PSČ
	const formatPostalCode = (value) => {
		const numbers = value.replace(/\D/g, '')
		const limited = numbers.slice(0, 5)

		if (limited.length > 3) {
			return `${limited.slice(0, 3)} ${limited.slice(3)}`
		}

		return limited
	}

	// Варіанти оплати
	const paymentOptions = [
		{
			value: 'credit',
			label: 'Kúpa na splátky',
			description: 'Rozloženie platby na splátky',
			enabled: true
		},
		{
			value: 'online_payment',
			label: 'Online platba kartou',
			description: 'Okamžitá platba cez internet',
			enabled: true
		},
		{
			value: 'cash_on_delivery',
			label: 'Dobierka (platba pri prevzatí)',
			description: 'Zaplatíte pri doručení balíka',
			enabled: true
		}
	]
	
	return (
		<div className="StepDelivery">
			<div className="StepDelivery__header">
				<h2 className="StepDelivery__title">Doručenie a platba</h2>
				<p className="StepDelivery__subtitle">
					Zadajte adresu doručenia a vyberte spôsob platby
				</p>
			</div>

			<Formik
				initialValues={defaultValues}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					onSubmit(values)
					window.scrollTo({
						top: 0,
						behavior: 'smooth'
					})
					setTimeout(() => {
						onNext()
					}, 300)
				}}
			>
				{({ isValid, setFieldValue, values }) => (
					<Form className="StepDelivery__form">
						{/* Sekcia doručenia */}
						<div className="StepDelivery__section">
							<h3 className="StepDelivery__section-title">
								<MapPin size={20} />
								Adresa doručenia
							</h3>

							<div className="StepDelivery__row">
								{/* Mesto */}
								<div className="StepDelivery__field">
									<label htmlFor="city" className="StepDelivery__label">
										Mesto *
									</label>
									<Field
										type="text"
										id="city"
										name="city"
										className="StepDelivery__input"
										placeholder="Bratislava"
									/>
									<ErrorMessage
										name="city"
										component="div"
										className="StepDelivery__error"
									/>
								</div>

								{/* PSČ */}
								<div className="StepDelivery__field">
									<label htmlFor="postalCode" className="StepDelivery__label">
										PSČ *
									</label>
									<Field name="postalCode">
										{({ field }) => (
											<input
												{...field}
												type="text"
												id="postalCode"
												className="StepDelivery__input"
												placeholder="811 01"
												value={formatPostalCode(field.value)}
												onChange={(e) => {
													const formatted = formatPostalCode(e.target.value)
													setFieldValue('postalCode', formatted)
												}}
											/>
										)}
									</Field>
									<ErrorMessage
										name="postalCode"
										component="div"
										className="StepDelivery__error"
									/>
								</div>
							</div>

							{/* Ulica a číslo domu */}
							<div className="StepDelivery__wrapper">
								<div className="StepDelivery__field">
									<label htmlFor="street" className="StepDelivery__label">
										Ulica *
									</label>
									<Field
										type="text"
										id="street"
										name="street"
										className="StepDelivery__input"
										placeholder="Hlavná"
									/>
									<ErrorMessage
										name="street"
										component="div"
										className="StepDelivery__error"
									/>
								</div>
								<div className="StepDelivery__field house">
									<label htmlFor="houseNumber" className="StepDelivery__label">
										Číslo domu *
									</label>
									<Field
										type="text"
										id="houseNumber"
										name="houseNumber"
										className="StepDelivery__input"
										placeholder="123"
									/>
									<ErrorMessage
										name="houseNumber"
										component="div"
										className="StepDelivery__error"
									/>
								</div>
							</div>
						</div>

						{/* Sekcia platby */}
						<div className="StepDelivery__section">
							<h3 className="StepDelivery__section-title">
								<CreditCard size={20} />
								Spôsob platby
							</h3>

							<div className="StepDelivery__payment-options">
								{paymentOptions.map((option) => (
									<div
										key={option.value}
										className={`StepDelivery__payment-option ${!option.enabled ? 'disabled' : ''}`}
									>
										<Field
											type="radio"
											id={option.value}
											name="paymentMethod"
											value={option.value}
											className="StepDelivery__radio"
											disabled={!option.enabled}
										/>
										<label
											htmlFor={option.value}
											className={`StepDelivery__payment-label ${!option.enabled ? 'disabled' : ''}`}
										>
											<div className="StepDelivery__payment-info">
												<span className="StepDelivery__payment-title">
													{option.label}
													{!option.enabled && (
														<span className="StepDelivery__coming-soon">
															(Pripravujeme)
														</span>
													)}
												</span>
												<span className="StepDelivery__payment-description">
													{option.description}
												</span>
											</div>
										</label>
									</div>
								))}
							</div>

							<ErrorMessage
								name="paymentMethod"
								component="div"
								className="StepDelivery__error"
							/>
						</div>

						{/* Sekcia pre kreditné informácie - zobrazí sa len pri výbere "credit" */}
						{values.paymentMethod === 'credit' && (
							<div className="StepDelivery__section StepDelivery__credit-section">
								<h3 className="StepDelivery__section-title">
									<Wallet size={20} />
									Informácie o platobnej schopnosti
								</h3>

								<p className="StepDelivery__credit-info">
									Pre schválenie kúpy na splátky potrebujeme informácie o vašej finančnej situácii.
									Tieto údaje sú potrebné pre posúdenie žiadosti bankou.
								</p>

								<div className="StepDelivery__row">
									{/* Mesačný príjem */}
									<div className="StepDelivery__field">
										<label htmlFor="monthlyIncome" className="StepDelivery__label">
											<TrendingUp size={16} />
											Čistý mesačný príjem (€) *
										</label>
										<Field
											type="number"
											id="monthlyIncome"
											name="monthlyIncome"
											className="StepDelivery__input"
											placeholder="1500"
											min="0"
											step="0.01"
										/>
										<span className="StepDelivery__hint">
											Váš príjem po zdanení
										</span>
										<ErrorMessage
											name="monthlyIncome"
											component="div"
											className="StepDelivery__error"
										/>
									</div>

									{/* Mesačné výdavky */}
									<div className="StepDelivery__field">
										<label htmlFor="monthlyExpenses" className="StepDelivery__label">
											<CreditCard size={16} />
											Mesačné výdavky (€) *
										</label>
										<Field
											type="number"
											id="monthlyExpenses"
											name="monthlyExpenses"
											className="StepDelivery__input"
											placeholder="800"
											min="0"
											step="0.01"
										/>
										<span className="StepDelivery__hint">
											Nájom, energie, splátky, potraviny
										</span>
										<ErrorMessage
											name="monthlyExpenses"
											component="div"
											className="StepDelivery__error"
										/>
									</div>
								</div>

								{/* Počet detí */}
								<div className="StepDelivery__field">
									<label htmlFor="numberOfChildren" className="StepDelivery__label">
										<Users size={16} />
										Počet vyživovaných detí *
									</label>
									<Field
										type="number"
										id="numberOfChildren"
										name="numberOfChildren"
										className="StepDelivery__input"
										placeholder="0"
										min="0"
										max="20"
										step="1"
									/>
									<span className="StepDelivery__hint">
										Deti do 18 rokov alebo študenti dennej formy do 26 rokov
									</span>
									<ErrorMessage
										name="numberOfChildren"
										component="div"
										className="StepDelivery__error"
									/>
								</div>

								{/* Indikátor platobnej schopnosti */}
								{values.monthlyIncome > 0 && values.monthlyExpenses >= 0 && (
									<div className="StepDelivery__affordability">
										{(() => {
											const disposable = values.monthlyIncome - values.monthlyExpenses - (values.numberOfChildren * 50)
											const isAffordable = disposable > 200

											return (
												<div className={`StepDelivery__affordability-indicator ${isAffordable ? 'positive' : 'warning'}`}>
													<div className="StepDelivery__affordability-title">
														{isAffordable ? '✓ Dobrá platobná schopnosť' : '⚠ Nízka platobná schopnosť'}
													</div>
													<div className="StepDelivery__affordability-text">
														Voľné prostriedky: <strong>{disposable.toFixed(2)} €</strong> mesačne
													</div>
													{!isAffordable && (
														<div className="StepDelivery__affordability-warning">
															Odporúčame zvážiť nižšiu sumu alebo dlhšie obdobie splácania
														</div>
													)}
												</div>
											)
										})()}
									</div>
								)}
							</div>
						)}

						{/* Tlačidlá */}
						<div className="StepDelivery__actions">
							<button
								type="button"
								className="StepDelivery__back-btn"
								onClick={() => {
									window.scrollTo({
										top: 0,
										behavior: 'smooth'
									})
									setTimeout(() => {
										onBack()
									}, 300)
								}}
							>
								<ArrowLeft size={18} />
								Späť
							</button>

							<button
								type="submit"
								className="StepDelivery__next-btn"
								disabled={!isValid}
							>
								Pokračovať na potvrdenie
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default StepDelivery