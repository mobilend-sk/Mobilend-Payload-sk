// next.config.mjs
// Конфигурация Next.js для оптимального SSG

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Включаем экспериментальные функции
	experimental: {
		// Улучшенная оптимизация статического экспорта
		optimizePackageImports: ['lucide-react'],
	},

	// Конфигурация изображений
	images: {
		// Домены для внешних изображений (если используются)
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'example.com',
			}
		],
		// Форматы изображений для оптимизации
		formats: ['image/webp', 'image/avif'],
	},

	// Оптимизация для production
	compress: true,

	// Настройки для лучшего SEO
	poweredByHeader: false, // Убираем заголовок "X-Powered-By: Next.js"

	// Переписывание маршрутов для SEO (если нужно)
	async rewrites() {
		return [
			// Можно добавить переписывание URL если нужно
		]
	},

	// Заголовки безопасности и SEO
	async headers() {
		return [
			{
				// Применяем ко всем маршрутам
				source: '/(.*)',
				headers: [
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on'
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block'
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN'
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff'
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin'
					}
				],
			},
			{
				// Кеширование статических ресурсов
				source: '/data/gallery/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable'
					}
				],
			}
		]
	}
}

export default nextConfig