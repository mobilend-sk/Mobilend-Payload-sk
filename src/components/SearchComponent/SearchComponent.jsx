'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Додано
import "./SearchComponent.scss"
import CatalogList from '@/pages/CatalogPage/CatalogList/CatalogList';

const SearchComponent = ({
  onSearch,
  placeholder = "Zadajte hľadaný výraz...",
  initialValue = "",
  className = "",
  autoFocus = true,
  headerSelector = ".header",
  activeHeaderClass = "header--search-active",
  redirectOnSearch = true, // Новий проп для контролю редіректу
  catalogPageUrl = "/katalog" // URL сторінки каталогу
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(initialValue);
  const inputRef = useRef(null);
  const router = useRouter(); // Додано

  // Встановлюємо початкове значення
  useEffect(() => {
    setSearchValue(initialValue);
    setDebouncedSearchValue(initialValue);
  }, [initialValue]);

  // Дебаунс для searchValue
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Управління класом хедера при відкритті/закритті форми
  useEffect(() => {
    const headerElement = document.querySelector(headerSelector);

    if (headerElement) {
      if (isOpen) {
        headerElement.classList.add(activeHeaderClass);
        document.body.classList.add('search-modal-open');
      } else {
        headerElement.classList.remove(activeHeaderClass);
        document.body.classList.remove('search-modal-open');
      }
    }

    return () => {
      if (headerElement) {
        headerElement.classList.remove(activeHeaderClass);
      }
      document.body.classList.remove('search-modal-open');
    };
  }, [isOpen, headerSelector, activeHeaderClass]);

  // Фокус на інпуті коли відкривається форма
  useEffect(() => {
    if (isOpen && inputRef.current && autoFocus) {
      inputRef.current.focus();
    }
  }, [isOpen, autoFocus]);

  // Закриття при кліку Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedValue = searchValue.trim();

    if (trimmedValue) {
      if (redirectOnSearch) {
        // Редірект на сторінку каталогу з пошуковим запитом
        router.push(`${catalogPageUrl}?search=${encodeURIComponent(trimmedValue)}`);
        handleClose();
      } else {
        // Залишаємось на поточній сторінці
        setDebouncedSearchValue(trimmedValue);
        if (onSearch) {
          onSearch(trimmedValue);
        }
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue('');
    setDebouncedSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <div className={`search-component ${className}`}>
      {!isOpen ? (
        <button
          onClick={handleSearchClick}
          className="search-btn"
          aria-label="Відкрити пошук"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" />
          </svg>


        </button>
      ) : (
        <div className="search__wrapper">
          <div
            className="search-component_blur"
            onClick={handleClose}
          />
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="search-input"
              />
              <button
                type="submit"
                className="search-submit"
                disabled={!searchValue.trim()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="search-close"
                aria-label="Закрити пошук"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m18 6-12 12" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </form>

          {/* Показуємо результати тільки якщо не редіректимо */}
          <div
            className="searh-results__wrapper"
            onClick={handleClose}
          >
            <CatalogList
              showFilters={false}
              initialSearchTerm={debouncedSearchValue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;