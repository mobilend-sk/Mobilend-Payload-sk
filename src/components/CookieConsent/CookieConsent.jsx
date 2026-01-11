// src/components/CookieConsent/CookieConsent.tsx
'use client'

import Script from 'next/script'
import './CookieConsent.scss'

const CookieConsent = () => {
  return (
    <>
      {/* ============================================ */}
      {/* COOKIE CONSENT - TermsFeed Integration */}
      {/* ============================================ */}

      {/* 1. Завантаження бібліотеки Cookie Consent */}
      <Script
        src="https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ Cookie Consent library loaded')
        }}
        onError={(e) => {
          console.error('❌ Cookie Consent loading error:', e)
        }}
      />

      {/* 2. Ініціалізація Cookie Consent */}
      <Script 
        id="cookie-consent-init" 
        strategy="afterInteractive"
      >
        {`
          // Функція ініціалізації з перевіркою завантаження
          (function initCookieConsent() {
            if (typeof window.cookieconsent !== 'undefined') {
              console.log('🍪 Initializing Cookie Consent...')
              
              try {
                window.cookieconsent.run({
                  notice_banner_type: "headline",
                  consent_type: "express",
                  palette: "light",
                  language: "sk",
                  page_load_consent_levels: ["strictly-necessary"],
                  notice_banner_reject_button_hide: false,
                  preferences_center_close_button_hide: false,
                  page_refresh_confirmation_buttons: false,
                  website_name: "Mobilend.sk",
                  website_privacy_policy_url: "https://mobilend.sk/privacy-policy"
                })
                
                console.log('✅ Cookie Consent initialized successfully')
              } catch (error) {
                console.error('❌ Cookie Consent initialization error:', error)
              }
            } else {
              // Якщо бібліотека ще не завантажилась, спробуємо через 100ms
              console.log('⏳ Waiting for Cookie Consent library...')
              setTimeout(initCookieConsent, 100)
            }
          })()
        `}
      </Script>

      {/* 3. Ping script для аналітики TermsFeed (опціонально) */}
      <Script
        src={`https://www.termsfeed.com/public-ping/cookie-consent/4.2.0/cookie-consent.js/${
          process.env.NEXT_PUBLIC_SITE_URL 
            ? process.env.NEXT_PUBLIC_SITE_URL.replace('https://', '').replace('http://', '') 
            : 'mobilend.sk'
        }`}
        strategy="lazyOnload"
      />
    </>
  )
}

export default CookieConsent