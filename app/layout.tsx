import './globals.css'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/Header'
import Script from 'next/script'

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
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0KVZFBBNZR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0KVZFBBNZR');
          `}
        </Script>
      </head>
      <body className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-ghibli-light py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-ghibli-dark">
              &copy; {new Date().getFullYear()} Grok Ghibli. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
} 