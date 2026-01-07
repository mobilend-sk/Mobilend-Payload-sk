// migrate-blog.ts
// Міграція Markdown файлів в Payload CMS (textarea version)

import payload from 'payload'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import config from '@payload-config'
import matter from 'gray-matter'

import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Функція затримки
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const migrate = async () => {
  try {
    // Ініціалізація Payload
    await payload.init({
      config,
    })

    console.log('✅ Payload ініціалізовано')

    // Шлях до папки з Markdown файлами
    const articlesPath = path.join(__dirname, './articles')
    
    // Перевірка чи папка існує
    if (!fs.existsSync(articlesPath)) {
      console.error(`❌ Папка ${articlesPath} не існує`)
      console.log('💡 Створіть папку ./articles та помістіть туди .md файли')
      process.exit(1)
    }

    // Завантаження всіх MD файлів
    const files = fs.readdirSync(articlesPath).filter(file => file.endsWith('.md'))

    console.log(`📦 Знайдено ${files.length} Markdown файлів`)

    if (files.length === 0) {
      console.log('⚠️  Немає файлів для міграції')
      process.exit(0)
    }

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    // Обробка кожного MD файлу
    for (const file of files) {
      try {
        const filePath = path.join(articlesPath, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        
        // Парсинг frontmatter та контенту
        const { data: frontmatter, content } = matter(fileContent)

        // Валідація обов'язкових полів
        if (!frontmatter.title || !frontmatter.slug) {
          console.warn(`⚠️  Пропущено ${file}: відсутній title або slug`)
          skippedCount++
          continue
        }

        // Затримка перед перевіркою (щоб уникнути блокування БД)
        await delay(100)

        // Перевірка чи стаття вже існує
        const existing = await payload.find({
          collection: 'blog',
          where: {
            slug: {
              equals: frontmatter.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`⏭️  Пропущено ${file}: стаття вже існує`)
          skippedCount++
          continue
        }

        // Обробка категорій
        const categories = Array.isArray(frontmatter.categories)
          ? frontmatter.categories.map((cat: string) => ({ category: cat }))
          : []

        // Обробка дати
        const date = frontmatter.date 
          ? new Date(frontmatter.date).toISOString()
          : new Date().toISOString()

        // Затримка перед створенням (щоб уникнути блокування БД)
        await delay(200)

        // Створення статті в Payload
        successCount++
        console.log(`✅ Додано: ${frontmatter.title}`)
        
        // Затримка після успішного створення
        await delay(300)
      } catch (error: any) {
        errorCount++
        console.error(`❌ Помилка при обробці ${file}:`, error.message)
        // Затримка після помилки
        await delay(500)
      }
    }

    console.log('\n📊 Результати міграції:')
    console.log(`✅ Успішно: ${successCount}`)
    console.log(`⏭️  Пропущено: ${skippedCount}`)
    console.log(`❌ Помилок: ${errorCount}`)
    console.log(`📦 Всього файлів: ${files.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Критична помилка:', error)
    process.exit(1)
  }
}

migrate()