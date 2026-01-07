"use client"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { User, Phone, Mail, MessageSquare } from 'lucide-react'
import "./StepContact.scss"

// Компонент для маски телефона
const PhoneInputMask = ({ field, form }) => {
	/**
	 * Форматирует номер телефона в формат +421 9XX XXX XXX
	 * @param {string} value - входящее значение
	 * @returns {string} отформатированное значение
	 */
	const formatPhoneNumber = (value) => {
		// Удаляем все символы кроме цифр
		const digitsOnly = value.replace(/\D/g, '')

		// Если начинается с 421, добавляем +
		let cleanNumber = digitsOnly
		if (cleanNumber.startsWith('421')) {
			cleanNumber = '+' + cleanNumber
		}

		// Если не начинается с +421, добавляем префикс
		if (!cleanNumber.startsWith('+421')) {
			if (cleanNumber.startsWith('+')) {
				cleanNumber = '+421' + cleanNumber.slice(1)
			} else {
				cleanNumber = '+421' + cleanNumber
			}
		}

		// Ограничиваем до 13 символов максимум (+421 + 9 цифр)
		if (cleanNumber.length > 13) {
			cleanNumber = cleanNumber.slice(0, 13)
		}

		// Форматируем: +421 9XX XXX XXX
		if (cleanNumber.length >= 4) {
			let formatted = '+421'
			const remainingDigits = cleanNumber.slice(4) // убираем +421

			if (remainingDigits.length > 0) {
				formatted += ' ' + remainingDigits.slice(0, 3) // первые 3 цифры

				if (remainingDigits.length > 3) {
					formatted += ' ' + remainingDigits.slice(3, 6) // следующие 3 цифры

					if (remainingDigits.length > 6) {
						formatted += ' ' + remainingDigits.slice(6, 9) // последние 3 цифры
					}
				}
			}

			return formatted
		}

		return '+421 '
	}

	/**
	 * Валидирует полноту введённого номера
	 * @param {string} value - значение для валидации
	 * @returns {boolean} true если номер полный
	 */
	const isCompletePhoneNumber = (value) => {
		const digitsOnly = value.replace(/\D/g, '')
		// Должно быть ровно 12 цифр: 421 + 9 цифр номера
		return digitsOnly.length === 12 && digitsOnly.startsWith('421')
	}

	/**
	 * Обработчик изменения значения в поле
	 */
	const handleChange = (event) => {
		const inputValue = event.target.value
		const formattedValue = formatPhoneNumber(inputValue)

		// Устанавливаем новое значение в Formik
		form.setFieldValue(field.name, formattedValue)
	}

	/**
	 * Обработчик фокуса - устанавливаем базовую маску если поле пустое
	 */
	const handleFocus = (event) => {
		if (!field.value || field.value.trim() === '') {
			form.setFieldValue(field.name, '+421 ')

			// Устанавливаем курсор в конец
			setTimeout(() => {
				const input = event.target
				input.setSelectionRange(input.value.length, input.value.length)
			}, 0)
		}
	}

	/**
	 * Обработчик нажатий клавиш
	 */
	const handleKeyDown = (event) => {
		const { key, target } = event
		const { value, selectionStart } = target

		// Запрещаем удаление префикса +421
		if ((key === 'Backspace' || key === 'Delete') && selectionStart <= 4) {
			// Если пытаются удалить часть префикса, не даём это сделать
			if (selectionStart < 4) {
				event.preventDefault()
				return
			}

			// Если удаляют сразу после +421, устанавливаем курсор после пробела
			if (selectionStart === 4 && value.length > 5) {
				event.preventDefault()
				target.setSelectionRange(5, 5)
				return
			}
		}

		// Разрешаем только цифры, Backspace, Delete, Tab, стрелки
		const allowedKeys = [
			'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight',
			'ArrowUp', 'ArrowDown', 'Home', 'End'
		]

		if (!allowedKeys.includes(key) && !/^\d$/.test(key)) {
			event.preventDefault()
		}
	}

	/**
	 * Обработчик вставки текста
	 */
	const handlePaste = (event) => {
		event.preventDefault()
		const pastedText = event.clipboardData.getData('text')
		const formattedValue = formatPhoneNumber(pastedText)
		form.setFieldValue(field.name, formattedValue)
	}

	/**
	 * Обработчик потери фокуса
	 */
	const handleBlur = () => {
		form.setFieldTouched(field.name, true)

		// Если поле содержит только префикс, очищаем его
		if (field.value === '+421 ') {
			form.setFieldValue(field.name, '')
		}
	}

	return (
		<input
			type="tel"
			id={field.name}
			name={field.name}
			value={field.value || ''}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			onPaste={handlePaste}
			className="StepContact__input"
			placeholder="+421 9XX XXX XXX"
			autoComplete="tel"
		/>
	)
}

const StepContact = ({ initialValues, onSubmit, onNext }) => {
	const validationSchema = Yup.object({
		firstName: Yup.string()
			.matches(
				/^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž-]+$/,
				'Meno môže obsahovať iba písmená a znak "-"'
			)
			.min(2, 'Meno musí mať aspoň 2 znaky')
			.max(30, 'Meno je príliš dlhé')
			.required('Meno je povinné'),

		lastName: Yup.string()
			.matches(
				/^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž-]+$/,
				'Priezvisko môže obsahovať iba písmená a znak "-"'
			)
			.min(2, 'Priezvisko musí mať aspoň 2 znaky')
			.max(30, 'Priezvisko je príliš dlhé')
			.required('Priezvisko je povinné'),

		phone: Yup.string()
			.required('Telefónne číslo je povinné')
			.test('valid-phone', 'Neplatné telefónne číslo', (value) => {
				// Проверяем формат: должно быть +421 и 9 цифр после него
				if (!value) return false
				const digitsOnly = value.replace(/\D/g, '')
				return digitsOnly.length === 12 && digitsOnly.startsWith('421')
			}),
		email: Yup.string()
			.email('Neplatná emailová adresa')
			.required('Email je povinný'),
		comment: Yup.string().max(500, 'Poznámka je príliš dlhá (max 500 znakov)')
	})

	const defaultValues = {
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		comment: '',
		...initialValues
	}

	return (
		<div className="StepContact">
			<div className="StepContact__header">
				<h2 className="StepContact__title">Kontaktné údaje</h2>
				<p className="StepContact__subtitle">Zadajte svoje kontaktné informácie pre doručenie objednávky</p>
			</div>

			<Formik
				initialValues={defaultValues}
				validationSchema={validationSchema}
				onSubmit={(values) => {
					onSubmit(values)
					window.scrollTo({ top: 0, behavior: 'smooth' })
					setTimeout(onNext, 300)
				}}
				enableReinitialize
			>
				{({ isValid }) => (
					<Form className="StepContact__form">
						<div className="StepContact__row">
							<div className="StepContact__field">
								<label htmlFor="firstName" className="StepContact__label">
									<User size={18} />
									Meno *
								</label>
								<Field
									type="text"
									id="firstName"
									name="firstName"
									className="StepContact__input"
									placeholder="Zadajte svoje meno"
									onKeyDown={(e) => {
										const allowed = /^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž-]$/

										if (
											!allowed.test(e.key) &&
											!['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
										) {
											e.preventDefault()
										}
									}}

								/>

								<ErrorMessage name="firstName" component="div" className="StepContact__error" />
							</div>

							<div className="StepContact__field">
								<label htmlFor="lastName" className="StepContact__label">
									<User size={18} />
									Priezvisko *
								</label>
								<Field
									type="text"
									id="lastName"
									name="lastName"
									className="StepContact__input"
									placeholder="Zadajte svoje priezvisko"
									onKeyDown={(e) => {
										const allowed = /^[A-Za-zÁÄáäČčĎďÉéÍíĹĺĽľŇňÓóÔôŘřŠšŤťÚúÝýŽž-]$/

										if (
											!allowed.test(e.key) &&
											!['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)
										) {
											e.preventDefault()
										}
									}}

								/>
								<ErrorMessage name="lastName" component="div" className="StepContact__error" />
							</div>
						</div>

						<div className="StepContact__field">
							<label htmlFor="phone" className="StepContact__label">
								<Phone size={18} />
								Telefónne číslo *
							</label>
							<Field name="phone" component={PhoneInputMask} />
							<ErrorMessage name="phone" component="div" className="StepContact__error" />
						</div>

						<div className="StepContact__field">
							<label htmlFor="email" className="StepContact__label">
								<Mail size={18} />
								Emailová adresa *
							</label>
							<Field
								type="email"
								id="email"
								name="email"
								className="StepContact__input"
								placeholder="vasa@email.com"
							/>
							<ErrorMessage name="email" component="div" className="StepContact__error" />
						</div>

						<div className="StepContact__field">
							<label htmlFor="comment" className="StepContact__label">
								<MessageSquare size={18} />
								Poznámka k objednávke
							</label>
							<Field
								as="textarea"
								id="comment"
								name="comment"
								className="StepContact__textarea"
								placeholder="Dodatočné informácie k objednávke (nepovinné)"
								rows="3"
							/>
							<ErrorMessage name="comment" component="div" className="StepContact__error" />
						</div>

						<div className="StepContact__actions">
							<button type="submit" className="StepContact__next-btn" disabled={!isValid}>
								Pokračovať na doručenie
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default StepContact