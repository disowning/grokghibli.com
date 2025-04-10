import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/Header'
import Script from 'next/script'
import Footer from './components/Footer'
import { Analytics } from '@vercel/analytics/react'

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
  title: {
    default: 'Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
    template: '%s | Grok Ghibli'
  },
  description: 'Transform your photos into Studio Ghibli style artwork using xAI Grok technology. Create magical Ghibli-inspired art with AI in seconds.',
  keywords: ['grok ghibli', 'ghibli ai', 'grok ai art', 'studio ghibli style', 'ai image generator', 'ghibli art generator', 'grok image transformer'],
  icons: {
    icon: '/favicon/icon.ico',
    shortcut: '/favicon/icon.ico',
    apple: '/favicon/icon.ico',
  },
  openGraph: {
    title: 'Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
    description: 'Transform your photos into Studio Ghibli style artwork using xAI Grok technology',
    url: 'https://grokghibli.com',
    siteName: 'Grok Ghibli',
    images: [
      {
        url: '/images/showcase/showcase-after.webp',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli Art Example'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
    description: 'Transform your photos into Studio Ghibli style artwork using xAI Grok technology',
    images: ['/images/showcase/showcase-after.webp'],
  },
  metadataBase: new URL('https://grokghibli.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable} min-h-screen flex flex-col`}>
      <body className="font-sans antialiased bg-slate-50 text-ghibli-dark">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-QWERT12345" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QWERT12345');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  )
} 