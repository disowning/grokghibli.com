import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair-display',
})

export const metadata: Metadata = {
  title: 'GrokGhibli - Transform Photos into Studio Ghibli Art',
  description: 'Transform your photos into beautiful Studio Ghibli inspired artwork using AI.',
  keywords: 'Studio Ghibli, AI art generator, Ghibli style, anime art, AI transformation',
  openGraph: {
    title: 'GrokGhibli - Transform Photos into Studio Ghibli Art',
    description: 'Transform your photos into beautiful Studio Ghibli inspired artwork using AI.',
    url: 'https://grokghibli.com',
    siteName: 'GrokGhibli',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GrokGhibli - Transform Photos into Studio Ghibli Art',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-ghibli-light py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-ghibli-dark">
              &copy; {new Date().getFullYear()} GrokGhibli. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
} 