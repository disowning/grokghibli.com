import Image from 'next/image'
import Link from 'next/link'
import ImageUploader from '@/components/ImageUploader'
import GhibliFeatures from '@/components/GhibliFeatures'
import Pricing from '@/components/Pricing'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-ghibli-dark">
            Ghibli AI Generator
          </h1>
          <p className="text-xl md:text-2xl text-ghibli-primary max-w-3xl mx-auto">
            Transform your photos into magical Studio Ghibli inspired artwork with our advanced AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/600x400/4A6670/ffffff/png?text=Before" 
              alt="Original Photo Example" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/600x400/4A6670/ffffff/png?text=After+Ghibli+Style" 
              alt="Studio Ghibli Style Example" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section className="bg-white py-16 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-ghibli-dark text-center mb-8">
            Transform Your Photo
          </h2>
          <ImageUploader />
        </div>
      </section>

      {/* Features Section */}
      <GhibliFeatures />

      {/* How It Works Section */}
      <section className="py-16 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold text-ghibli-dark text-center mb-12">
            How to Use Ghibli AI Generator
          </h2>
          <p className="text-center text-lg mb-12">Create stunning Ghibli-style images in four simple steps:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ghibli-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ghibli-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Upload Your Photo</h3>
              <p>Start by uploading any photo you want to transform into Studio Ghibli style artwork.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ghibli-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ghibli-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Customize Settings</h3>
              <p>Choose from a variety of Ghibli style options, from dreamy landscapes to whimsical character designs.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ghibli-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ghibli-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 font-heading">Generate Artwork</h3>
              <p>Let our AI work its magic, transforming your photo into a beautiful Ghibli-inspired creation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ghibli-light rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-ghibli-primary">4</span>
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
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-ghibli-dark mb-6">
          Transform Your Photos into Ghibli Magic
        </h2>
        <p className="text-lg text-ghibli-dark/80 max-w-2xl mx-auto mb-8">
          Join thousands of fans and bring the enchanting Studio Ghibli aesthetic to your images today.
        </p>
        <Button size="lg" className="text-lg px-8">
          Try GrokGhibli Free
        </Button>
      </section>
    </div>
  )
} 