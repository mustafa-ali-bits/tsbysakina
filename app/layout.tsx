import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { CartProvider } from '../src/context/CartContext'
import { Analytics } from "@vercel/analytics/next"
import AddToCartAlertWrapper from '../src/components/AddToCartAlertWrapper'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'The Sweet Tooth by Sakina - Handcrafted Chocolates & Desserts',
    template: '%s | The Sweet Tooth by Sakina'
  },
  description: 'Discover handcrafted chocolates, brownies & cookies made fresh with premium ingredients. Shop artisanal sweets, cakes, and desserts crafted with love by Sakina.',
  keywords: ['chocolates', 'brownies', 'cookies', 'handcrafted desserts', 'artisanal sweets', 'premium chocolate', 'fresh baked goods', 'Sakina'],
  authors: [{ name: 'The Sweet Tooth by Sakina' }],
  creator: 'The Sweet Tooth by Sakina',
  publisher: 'The Sweet Tooth by Sakina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.thesweettoothbysakina.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Sweet Tooth by Sakina - Handcrafted Chocolates & Desserts',
    description: 'Discover handcrafted chocolates, brownies & cookies made fresh with premium ingredients. Shop artisanal sweets, cakes, and desserts crafted with love.',
    url: 'https://www.thesweettoothbysakina.in',
    siteName: 'The Sweet Tooth by Sakina',
    images: [
      {
        url: '/logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'The Sweet Tooth by Sakina - Handcrafted Chocolates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Sweet Tooth by Sakina - Handcrafted Chocolates & Desserts',
    description: 'Discover handcrafted chocolates, brownies & cookies made fresh with premium ingredients.',
    images: ['/logo.jpeg'],
  },
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
  verification: {
    google: '1mAzNDvptUdFL9dbhMeY6wiBlqjzOg6m7O6ii9u_rm8',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Analytics/>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
