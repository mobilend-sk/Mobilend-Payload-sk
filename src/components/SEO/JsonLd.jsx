const JsonLd = ({ schema }) => {
	if (!schema) return null

	// ✅ Санитизация для XSS защиты (рекомендация Next.js)
	const sanitizedSchema = schema.replace(/</g, '\\u003c')

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: sanitizedSchema }}
		/>
	)
}

// ✅ Компонент для множественных схем
export const MultipleJsonLd = ({ schemas }) => {
	if (!schemas || schemas.length === 0) return null

	return (
		<>
			{schemas.map((schema, index) => (
				<script
					key={index}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ 
						__html: schema.replace(/</g, '\\u003c') 
					}}
				/>
			))}
		</>
	)
}

export default JsonLd