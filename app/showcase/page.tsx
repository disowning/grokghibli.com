import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Showcase - GrokGhibli',
  description: 'View amazing examples of photos transformed into Ghibli-style artwork by GrokGhibli',
}

type ShowcaseItem = {
  id: number;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: string;
}

export default function ShowcasePage() {
  const showcaseItems: ShowcaseItem[] = [
    // 风景类 (Landscapes)
    {
      id: 1,
      title: "Enchanted Forest",
      description: "A mystical forest scene inspired by Princess Mononoke's deep woodlands.",
      beforeImage: "/images/showcase/forest-before.webp",
      afterImage: "/images/showcase/forest-after.webp",
      category: "landscape"
    },
    {
      id: 2,
      title: "Seaside Dreams",
      description: "A coastal view transformed in the style of Ponyo's magical ocean scenes.",
      beforeImage: "/images/showcase/sea-before.webp",
      afterImage: "/images/showcase/sea-after.webp",
      category: "landscape"
    },

    // 城市场景 (Urban)
    {
      id: 3,
      title: "Night Market Magic",
      description: "A bustling street market scene reminiscent of Spirited Away's magical world.",
      beforeImage: "/images/showcase/market-before.webp",
      afterImage: "/images/showcase/market-after.webp",
      category: "cityscape"
    },
    {
      id: 4,
      title: "City in the Sky",
      description: "An urban landscape transformed with the floating city aesthetic of Castle in the Sky.",
      beforeImage: "/images/showcase/aerial-before.webp",
      afterImage: "/images/showcase/aerial-after.webp",
      category: "cityscape"
    },

    // 人物肖像 (Portraits)
    {
      id: 5,
      title: "Garden Portrait",
      description: "A portrait in a flower garden, styled after Howl's Moving Castle's romantic scenes.",
      beforeImage: "/images/showcase/garden-before.webp",
      afterImage: "/images/showcase/garden-after.webp",
      category: "portrait"
    },
    {
      id: 6,
      title: "Rainy Day Dreams",
      description: "A thoughtful portrait transformed with the dreamy atmosphere of The Wind Rises.",
      beforeImage: "/images/showcase/rain-before.webp",
      afterImage: "/images/showcase/rain-after.webp",
      category: "portrait"
    },

    // 动物 (Pets & Animals)
    {
      id: 7,
      title: "Magical Pet",
      description: "A beloved pet reimagined as a charming Ghibli companion creature.",
      beforeImage: "/images/showcase/pet-before.webp",
      afterImage: "/images/showcase/pet-after.webp",
      category: "pet"
    },
    {
      id: 8,
      title: "Forest Friends",
      description: "Wildlife captured in the heartwarming style of My Neighbor Totoro.",
      beforeImage: "/images/showcase/wildlife-before.webp",
      afterImage: "/images/showcase/wildlife-after.webp",
      category: "pet"
    },

    // 建筑 (Architecture - 也算在Urban类别下)
    {
      id: 9,
      title: "Ancient Temple",
      description: "A traditional temple transformed with the mystical essence of Spirited Away.",
      beforeImage: "/images/showcase/temple-before.webp",
      afterImage: "/images/showcase/temple-after.webp",
      category: "cityscape"
    },
    {
      id: 10,
      title: "Modern Dreams",
      description: "Contemporary architecture reimagined with Ghibli's unique blend of fantasy and reality.",
      beforeImage: "/images/showcase/modern-before.webp",
      afterImage: "/images/showcase/modern-after.webp",
      category: "cityscape"
    }
  ]

  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-ghibli-dark">
          Showcase Gallery
        </h1>
        <p className="text-xl text-ghibli-primary max-w-3xl mx-auto">
          Explore our gallery of stunning transformations created with GrokGhibli.
        </p>
      </section>

      {/* Showcase Tabs */}
      <section>
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="portrait">Portraits</TabsTrigger>
              <TabsTrigger value="landscape">Landscapes</TabsTrigger>
              <TabsTrigger value="cityscape">Urban</TabsTrigger>
              <TabsTrigger value="pet">Pets & Animals</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-8">
            <ShowcaseGrid items={showcaseItems} />
          </TabsContent>
          
          <TabsContent value="portrait" className="space-y-8">
            <ShowcaseGrid items={showcaseItems.filter(item => item.category === 'portrait')} />
          </TabsContent>
          
          <TabsContent value="landscape" className="space-y-8">
            <ShowcaseGrid items={showcaseItems.filter(item => item.category === 'landscape')} />
          </TabsContent>
          
          <TabsContent value="cityscape" className="space-y-8">
            <ShowcaseGrid items={showcaseItems.filter(item => item.category === 'cityscape')} />
          </TabsContent>
          
          <TabsContent value="pet" className="space-y-8">
            <ShowcaseGrid items={showcaseItems.filter(item => item.category === 'pet')} />
          </TabsContent>
        </Tabs>
      </section>

      {/* User Submissions */}
      <section className="py-12 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark">
            Community Gallery
          </h2>
          <p className="text-lg text-ghibli-dark/80 max-w-3xl mx-auto mb-8">
            These amazing transformations were submitted by our users. Create your own and join our growing community!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="/images/showcase/showcase-before.webp"
                alt="Original Photo"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-sm font-medium rounded">Original Photo</div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="/images/showcase/showcase-after.webp"
                alt="Ghibli Style"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 right-2 bg-ghibli-primary text-white px-2 py-1 text-sm font-medium rounded">Ghibli Style</div>
            </div>
          </div>
          
          <p className="mt-6 text-ghibli-primary">
            Want to see your creations here? Share them on social media with #GrokGhibli
          </p>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark text-center mb-12">
            What Users Say About GrokGhibli
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="GrokGhibli transformed my vacation photos into magical Ghibli scenes that I've framed and hung in my home. They look absolutely beautiful!"
              author="Emily K."
              role="Photographer"
            />
            <Testimonial 
              quote="As an illustrator, I use GrokGhibli to get inspiration for my own artwork. The transformations are incredibly detailed and capture the Ghibli essence perfectly."
              author="Michael T."
              role="Illustrator"
            />
            <Testimonial 
              quote="I created a custom birthday card for my Ghibli-obsessed friend using this tool, and she was amazed by the results. Such a fantastic way to create personalized gifts!"
              author="Sophia L."
              role="Graphic Designer"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function ShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {items.map(item => (
        <ShowcaseCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="grid grid-cols-2">
            <div className="relative h-[250px]">
              <Image
                src={item.beforeImage}
                alt={`Before: ${item.title}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 text-xs font-medium rounded">Before</div>
            </div>
            <div className="relative h-[250px]">
              <Image
                src={item.afterImage}
                alt={`After: ${item.title}`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-ghibli-primary text-white px-2 py-1 text-xs font-medium rounded">Ghibli Style</div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-medium mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="text-ghibli-primary text-4xl mb-4">"</div>
      <p className="italic mb-6">{quote}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-ghibli-light flex items-center justify-center text-ghibli-primary font-bold mr-3">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
} 