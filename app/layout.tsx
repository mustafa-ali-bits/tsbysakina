import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../src/context/CartContext'
import { Analytics } from "@vercel/analytics/next"


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Sweet Tooth by Sakina',
  description: 'Handcrafted chocolate perfection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics/>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
