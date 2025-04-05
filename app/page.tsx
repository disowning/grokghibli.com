import Image from 'next/image'
import Link from 'next/link'
import ImageUploader from '@/components/ImageUploader'
import GhibliFeatures from '@/components/GhibliFeatures'
import Pricing from '@/components/Pricing'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Grok Ghibli - Transform Photos into Studio Ghibli Artwork with AI',
  description: 'Use Grok Ghibli to transform your photos into stunning Studio Ghibli style artwork in 2025. Powered by xAI\'s latest Grok technology, create magical Ghibli transformations in seconds. Last updated: April 3, 2025.',
  keywords: [
    'grok ghibli', 
    'studio ghibli ai', 
    'photo to ghibli converter', 
    'ai art transformation', 
    'anime style generator', 
    'ghibli art maker',
    'xai grok',
    'totoro style photos',
    'spirited away filter',
    '2025 ai image generator'
  ],
  openGraph: {
    title: 'Grok Ghibli - Transform Photos into Studio Ghibli Artwork with AI (2025)',
    description: 'Transform ordinary photos into magical Studio Ghibli artwork using AI. Create stunning Ghibli-style images in seconds. Updated April 3, 2025.',
    type: 'website',
    url: 'https://grokghibli.com',
    images: [
      {
        url: 'https://grokghibli.com/images/og/home-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli AI'
      }
    ]
  }
}

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-ghibli-dark">
            Grok Ghibli AI
          </h1>
          <p className="text-xl md:text-2xl text-ghibli-primary max-w-3xl mx-auto">
            Transform your photos into magical Studio Ghibli artwork using xAI's latest Grok technology.
          </p>
          <p className="text-lg text-ghibli-dark/80 max-w-2xl mx-auto">
            Experience the power of AI to create stunning Ghibli-style transformations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="/images/showcase/showcase-before.webp"
              alt="Original Photo Example" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="/images/showcase/showcase-after.webp"
              alt="Studio Ghibli Style Example" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section>
        <div className="container mx-auto px-4">
          <div className="relative text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold inline-block relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-primary via-purple-600 to-ghibli-secondary animated-gradient">
                Transform Your Photo
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ghibli-primary to-transparent"></div>
            </h2>
          </div>
          <ImageUploader />
        </div>
      </section>

      {/* Features Section */}
      <GhibliFeatures />

      {/* How It Works Section */}
      <section className="py-16 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-primary via-purple-600 to-ghibli-secondary animated-gradient">
              How to Use Ghibli AI Generator
            </span>
          </h2>
          <p className="text-center text-lg mb-12">Create stunning Ghibli-style images in four simple steps:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ghibli-light to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-ghibli-light hover:border-ghibli-primary/30 transition-all duration-300">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-ghibli-primary to-ghibli-secondary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Upload Your Photo</h3>
              <p>Start by uploading any photo you want to transform into Studio Ghibli style artwork.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ghibli-light to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-ghibli-light hover:border-ghibli-primary/30 transition-all duration-300">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-ghibli-primary to-ghibli-secondary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Customize Settings</h3>
              <p>Choose from a variety of Ghibli style options, from dreamy landscapes to whimsical character designs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ghibli-light to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-ghibli-light hover:border-ghibli-primary/30 transition-all duration-300">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-ghibli-primary to-ghibli-secondary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Generate Artwork</h3>
              <p>Let our AI work its magic, transforming your photo into a beautiful Ghibli-inspired creation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ghibli-light to-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-ghibli-light hover:border-ghibli-primary/30 transition-all duration-300">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-ghibli-primary to-ghibli-secondary">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Download and Share</h3>
              <p>Download your enchanting new artwork and share the magic with friends and family!</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <Pricing />
      
      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-br from-ghibli-light to-white rounded-xl">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-primary via-purple-600 to-ghibli-secondary animated-gradient">
            Transform Your Photos into Ghibli Magic
          </span>
        </h2>
        <p className="text-lg text-ghibli-dark/80 max-w-2xl mx-auto mb-8">
          Join thousands of fans and bring the enchanting Studio Ghibli aesthetic to your images today.
        </p>
        <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-ghibli-primary to-ghibli-secondary hover:from-ghibli-secondary hover:to-ghibli-primary transition-all duration-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Try Grok Ghibli Free
        </Button>
      </section>
    </div>
  )
} 