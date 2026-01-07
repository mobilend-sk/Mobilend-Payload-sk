"use client"
import { Check } from "lucide-react"
import "./ProgressBar.scss"

const ProgressBar = ({ currentStep = 1 }) => {
	const steps = [
		{ id: 1, title: "Kontaktné údaje" },
		{ id: 2, title: "Doručenie a platba" },
		{ id: 3, title: "Potvrdenie objednávky" }
	]

	return (
		<div className="ProgressBar">
			<div className="ProgressBar__container">
				{steps.map((step, index) => (
					<div key={step.id} className="ProgressBar__step-wrapper">
						{/* Шаг */}
						<div className={`ProgressBar__step ${getStepClass(step.id, currentStep)}`}>
							<div className="ProgressBar__step-circle">
								{step.id < currentStep ? (
									<Check size={16} />
								) : (
									<span className="ProgressBar__step-number">{step.id}</span>
								)}
							</div>
							<span className="ProgressBar__step-title">{step.title}</span>
						</div>

						{/* Линия между шагами */}
						{index < steps.length - 1 && (
							<div className={`ProgressBar__line ${step.id < currentStep ? 'completed' : ''}`} />
						)}
					</div>
				))}
			</div>
		</div>
	)
}

// Функция для определения класса шага
const getStepClass = (stepId, currentStep) => {
	if (stepId < currentStep) return 'completed'
	if (stepId === currentStep) return 'active'
	return 'pending'
}

export default ProgressBar