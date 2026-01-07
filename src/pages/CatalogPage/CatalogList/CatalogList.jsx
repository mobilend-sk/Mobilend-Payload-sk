'use client';

import { useEffect, useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ProductCard from "@/components/ProductCard/ProductCard"
import { Filter, X, FilterX, ChevronLeft, ChevronRight } from "lucide-react"
import "./CatalogList.scss"

const PRODUCTS_PER_PAGE = 12
const STORAGE_KEY = "catalog_filters"

const CatalogList = ({
  showFilters = true,
  initialSearchTerm = "",
  onSearchChange = null,
  initialProducts = []
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const urlSearchTerm = searchParams?.get('search') || ''
  const urlPage = parseInt(searchParams?.get('page') || '1', 10)
  
  const [productList] = useState(initialProducts)
  const [currentPage, setCurrentPage] = useState(urlPage)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState("all")
  const [sortBy, setSortBy] = useState("default")
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || initialSearchTerm)
  const [mounted, setMounted] = useState(false)

  // Мемоізована фільтрація та сортування
  const filteredProducts = useMemo(() => {
    let filtered = [...productList]

    if (selectedModel !== "all") {
      filtered = filtered.filter(p => p.modelGroup === selectedModel)
    }

    if (searchTerm.trim()) {
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/)
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.model,
          product.modelGroup,
          product.phone,
          product.description
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchWords.every(word => searchableText.includes(word))
      })
    }

    switch (sortBy) {
      case "priceAsc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "priceDesc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "nameAsc":
        filtered.sort((a, b) => a.model.localeCompare(b.model))
        break
      case "nameDesc":
        filtered.sort((a, b) => b.model.localeCompare(a.model))
        break
      case "discount":
        filtered = filtered
          .filter(p => p.discount > 0)
          .sort((a, b) => b.discount - a.discount)
        break
      default:
        filtered.sort((a, b) => {
          if (a.popular && !b.popular) return -1
          if (!a.popular && b.popular) return 1
          return 0
        })
    }

    return filtered
  }, [productList, selectedModel, sortBy, searchTerm])

  // Пагінація
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const endIndex = startIndex + PRODUCTS_PER_PAGE
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const uniqueModels = useMemo(() => {
    const models = [...new Set(productList.map(p => p.modelGroup))]
    return models.filter(Boolean).sort()
  }, [productList])

  // Монтування компонента
  useEffect(() => {
    setMounted(true)
  }, [])

  // Завантаження фільтрів після монтування
  useEffect(() => {
    if (!mounted) return
    
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY)
      if (savedFilters) {
        const { selectedModel: savedModel, sortBy: savedSort } = JSON.parse(savedFilters)
        setSelectedModel(savedModel || "all")
        setSortBy(savedSort || "default")
      }
    } catch (error) {
      console.error("Помилка завантаження фільтрів:", error)
    }
  }, [mounted])

  // Збереження фільтрів
  useEffect(() => {
    if (!mounted) return
    
    try {
      const filters = {
        selectedModel,
        sortBy
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error("Помилка збереження фільтрів:", error)
    }
  }, [selectedModel, sortBy, mounted])

  // Оновлення з URL
  useEffect(() => {
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm)
    } else if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm)
    }
  }, [urlSearchTerm, initialSearchTerm])

  // Оновлення сторінки з URL
  useEffect(() => {
    setCurrentPage(urlPage)
  }, [urlPage])

  // Повідомлення батьківського компонента
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchTerm)
    }
  }, [searchTerm, onSearchChange])

  // Скрол вгору при зміні сторінки
  useEffect(() => {
    if (mounted) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentPage, mounted])

  const updateURL = (page) => {
    const params = new URLSearchParams(searchParams)
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    
    const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(newURL, { scroll: false })
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    updateURL(page)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedModel !== "all") count++
    if (sortBy !== "default") count++
    if (searchTerm.trim()) count++
    return count
  }

  const resetFilters = () => {
    setSelectedModel("all")
    setSortBy("default")
    setSearchTerm("")
    setCurrentPage(1)
    setIsFilterOpen(false)
    
    if (mounted) {
      localStorage.removeItem(STORAGE_KEY)
      updateURL(1)
    }
  }

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value)
    setCurrentPage(1)
    updateURL(1)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
    setCurrentPage(1)
    updateURL(1)
  }

  const FilterContent = () => (
    <div className="CatalogList__filters-content">
      <div className="CatalogList__filters-header">
        <h3>Filtre:</h3>
        <button className="CatalogList__close-btn" onClick={() => setIsFilterOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className="CatalogList__filter">
        <label>Model:</label>
        <select value={selectedModel} onChange={handleModelChange}>
          <option value="all">Všetky modely</option>
          {uniqueModels.map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div className="CatalogList__filter">
        <label>Triedenie:</label>
        <select value={sortBy} onChange={handleSortChange}>
          <option value="default">Predvolené</option>
          <option value="priceAsc">Cena: najlacnejšie najprv</option>
          <option value="priceDesc">Cena: najdrahšie najprv</option>
          <option value="nameAsc">Názov: A–Z</option>
          <option value="nameDesc">Názov: Z–A</option>
          <option value="discount">So zľavou</option>
        </select>
      </div>

      <div className="CatalogList__filter-buttons">
        <button className="CatalogList__reset-btn" onClick={resetFilters} title="Zrušiť filtre">
          <FilterX size={20} />
        </button>
        <button className="CatalogList__apply-btn" onClick={() => setIsFilterOpen(false)}>
          Aplikovať filtre
        </button>
      </div>
    </div>
  )

  const Pagination = () => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisible = 5
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i)
          pages.push('...')
          pages.push(totalPages)
        } else if (currentPage >= totalPages - 2) {
          pages.push(1)
          pages.push('...')
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(totalPages)
        }
      }
      
      return pages
    }

    return (
      <div className="CatalogList__pagination">
        <button
          className="CatalogList__pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} />
          <span>Predchádzajúce</span>
        </button>

        <div className="CatalogList__pagination-numbers">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="CatalogList__pagination-ellipsis">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`CatalogList__pagination-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className="CatalogList__pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>Ďalšie</span>
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  if (!productList || productList.length === 0) {
    return (
      <div className="CatalogList__loading">
        <p>Načítavajú sa produkty...</p>
      </div>
    )
  }

  return (
    <div className="CatalogList">
      <div className="container">
        <div className="CatalogList__header">
          <h1 className="title-h1 title-h1--desktop">Katalóg tovaru</h1>
          <div className="CatalogList__header-right CatalogList__header-right--desktop">
            <div className="CatalogList__results-count">
              Nájdené: {filteredProducts.length} produktov
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="CatalogList__sticky-controls">
            <div className="CatalogList__sticky-controls--box">
              <div className="CatalogList__sticky-controls--header">
                <h1 className="title-h1 title-h1--mobile">Katalóg tovaru</h1>
                <div className="CatalogList__results-count">
                  Nájdené: {filteredProducts.length} produktov
                </div>
              </div>
              <button className="CatalogList__filter-btn" onClick={() => setIsFilterOpen(true)}>
                <Filter size={20} />
                Filter
                {getActiveFiltersCount() > 0 && (
                  <span className="filter-badge">{getActiveFiltersCount()}</span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="CatalogList__content">
          {showFilters && (
            <div className="CatalogList__filters CatalogList__filters--desktop">
              <FilterContent />
            </div>
          )}

          <div className="CatalogList__products">
            {filteredProducts.length === 0 ? (
              <div className="CatalogList__empty">
                <p>
                  {searchTerm.trim()
                    ? `Produkty pre "${searchTerm}" nenájdené`
                    : "Produkty nenájdené"
                  }
                </p>
                {showFilters && (
                  <button onClick={resetFilters}>Resetovať filtre</button>
                )}
              </div>
            ) : (
              <>
                <div className="CatalogList__grid">
                  {currentProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id || product.productLink || `${product.productLink}-${index}`} 
                      product={product} 
                    />
                  ))}
                </div>
                
                <Pagination />
              </>
            )}
          </div>
        </div>

        {showFilters && isFilterOpen && (
          <div className="CatalogList__modal-overlay" onClick={() => setIsFilterOpen(false)}>
            <div className="CatalogList__modal" onClick={(e) => e.stopPropagation()}>
              <FilterContent />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogList