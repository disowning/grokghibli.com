import GhibliFeatures from '@/components/GhibliFeatures'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

export const metadata = {
  title: 'Grok Ghibli Features - Transform Photos Into Studio Ghibli Artwork',
  description: 'Discover how Grok Ghibli uses advanced xAI technology to transform your photos into stunning Studio Ghibli style artwork. Features include multiple film styles like Spirited Away and Totoro, real-time processing, and high-quality output. Last updated: April 3, 2025.',
  keywords: [
    'grok ghibli features', 
    'ghibli ai transformation', 
    'studio ghibli photo filter', 
    'totoro art style', 
    'spirited away generator', 
    'howls moving castle filter',
    'ai art generator',
    'ghibli animation style',
    'xai grok technology',
    '2025 ai art'
  ],
  openGraph: {
    title: 'Grok Ghibli Features - Transform Photos Into Studio Ghibli Artwork',
    description: 'Transform your photos into stunning Studio Ghibli style artwork with our advanced AI. Multiple film styles, real-time processing, and high-quality output. Updated April 3, 2025.',
    type: 'website',
    url: 'https://grokghibli.com/features',
    images: [
      {
        url: 'https://grokghibli.com/images/og/features-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli Features'
      }
    ]
  }
}

export default function FeaturesPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-ghibli-dark">
          Grok Ghibli Features
        </h1>
        <p className="text-xl text-ghibli-primary max-w-3xl mx-auto">
          Powered by xAI's Grok technology, our AI brings the magic of Studio Ghibli to your photos with unmatched accuracy and style.
        </p>
      </section>

      {/* Main Features */}
      <GhibliFeatures />

      {/* Detailed Features with Tabs */}
      <section className="py-12 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark text-center mb-8">
            Explore Our Features In Detail
          </h2>
          
          <Tabs defaultValue="style" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="style">Ghibli Styles</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="style" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-heading font-semibold mb-4">Multiple Ghibli Film Styles</h3>
                  <p className="mb-4">Choose from a variety of distinct Studio Ghibli film aesthetics:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-ghibli-secondary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Spirited Away</strong> - Mystical and ethereal</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-secondary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>My Neighbor Totoro</strong> - Pastoral and serene</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-secondary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Howl's Moving Castle</strong> - Fantastical and vibrant</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-secondary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Princess Mononoke</strong> - Natural and dynamic</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-[300px] rounded-xl overflow-hidden shadow-md">
                  <Image 
                    src="https://placehold.co/600x400/4A6670/ffffff/png?text=Ghibli+Styles" 
                    alt="Ghibli Style Examples" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tech" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[300px] rounded-xl overflow-hidden shadow-md">
                  <Image 
                    src="https://placehold.co/600x400/4A6670/ffffff/png?text=AI+Technology" 
                    alt="AI Technology" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-semibold mb-4">Advanced AI Technology</h3>
                  <p className="mb-4">Our cutting-edge technology ensures the highest quality transformations:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-ghibli-primary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>State-of-the-art models</strong> trained on Ghibli films</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-primary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Smart preservation</strong> of important details</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-primary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Fast processing</strong> with cloud-based infrastructure</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-primary text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Regular updates</strong> for improved quality</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="benefits" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-heading font-semibold mb-4">Benefits For You</h3>
                  <p className="mb-4">Enjoy these advantages when using Grok Ghibli:</p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <span className="bg-ghibli-accent text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Personal Creativity</strong> - Create unique art for personal projects</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-accent text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Social Media Content</strong> - Stand out with unique profile pictures or posts</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-accent text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Gift Creation</strong> - Transform photos into meaningful gifts</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-ghibli-accent text-white p-1 rounded-full mr-2">✓</span>
                      <span><strong>Artwork Inspiration</strong> - Use as reference for your own art</span>
                    </li>
                  </ul>
                </div>
                <div className="relative h-[300px] rounded-xl overflow-hidden shadow-md">
                  <Image 
                    src="https://placehold.co/600x400/4A6670/ffffff/png?text=Benefits" 
                    alt="Benefits" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-white rounded-xl shadow-sm">
        <h2 className="text-3xl font-heading font-semibold text-ghibli-dark mb-6">
          Ready to Transform Your Photos?
        </h2>
        <p className="text-lg text-ghibli-dark/80 max-w-2xl mx-auto mb-8">
          Experience all these amazing features for yourself. Start creating your own Ghibli style artworks today!
        </p>
        <Button size="lg" className="text-lg px-8">
          Try Grok Ghibli Now
        </Button>
      </section>
    </div>
  )
} 