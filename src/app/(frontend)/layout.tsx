import React from 'react'
import { Montserrat } from 'next/font/google'
import "./globals.css";
import Header from "@/components/Header/Header";
import CartProvider from "@/components/CartProvider/CartProvider";
import Footer from "@/components/Footer/Footer";
import Script from "next/script";


import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema
} from "@/components/SEO/JsonLdSchemas";

const montserrat = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});



export const metadata = {
  title: "Mobilend - Predaj mobilných telefónov | iPhone, Samsung Galaxy",
  description: 'Široký výber mobilných telefónov za najlepšie ceny. iPhone, Samsung Galaxy a ďalšie značky. Rýchle doručenie po celom Slovensku s garancia kvalitnej služby.',
  keywords: [
    'mobilné telefóny',
    'iPhone',
    'Samsung Galaxy',
    'smartfóny',
    'predaj telefónov',
    'Bratislava',
    'Slovensko',
    'mobilend'
  ],
  authors: [{ name: 'Mobilend group' }],
  creator: 'Mobilend studio',
  publisher: 'Mobilend',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://mobilend.sk',
  },
  // Правильный способ добавления гео-тегов
  other: {
    'theme-color': '#ffffff', // Tvoja hlavná farba
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'geo.region': 'SK',
    'geo.placename': 'Slovakia',
    'geo.position': '48.198111;17.135069', // координаты вашего магазина
    'ICBM': '48.198111, 17.135069',
    'DC.title': 'Mobilend - Mobilné telefóny',
    'DC.creator': 'Mobilend',
    'DC.subject': 'mobilné telefóny, smartfóny, iPhone, Samsung',
    'DC.description': 'Predaj mobilných telefónov na Slovensku',
    'DC.language': 'sk',
  },
  // Open Graph pre sociálne siete
  openGraph: {
    title: 'Mobilend - Najlepšie mobilné telefóny na Slovensku',
    description: 'Objavte široký výber mobilných telefónov za skvelé ceny. iPhone, Samsung a ďalšie značky s rýchlym doručením.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}`,
    siteName: 'Mobilend',
    locale: 'sk_SK',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Mobilend - Mobilné telefóny',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Mobilend - Predaj mobilných telefónov',
    description: 'Najlepšie ceny mobilných telefónov na Slovensku. iPhone, Samsung Galaxy a ďalšie.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mobilend.sk'}/images/og.jpg`],
  },
  // Дополнительные SEO теги
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="sk">
      <head>
        <Script
          src="https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js"
          strategy="afterInteractive"
        />

        <Script id="cookie-consent-init" strategy="afterInteractive">
          {`
    if (window.cookieconsent) {
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
      });
    }
  `}
        </Script>

      </head>
      <body>
        <Header />
        <CartProvider>
          {children}
        </CartProvider>
        <Footer />
      </body>
    </html>
  )
}
