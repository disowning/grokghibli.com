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
    {
      id: 1,
      title: "Ghibli Style Transformation",
      description: "Experience the magic of Studio Ghibli's artistic style with our AI transformation.",
      beforeImage: "/images/showcase/showcase-before.webp",
      afterImage: "/images/showcase/showcase-after.webp",
      category: "landscape"
    },
    {
      id: 2,
      title: "Urban Scene",
      description: "A busy city street reimagined in the style of Spirited Away.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Urban",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Urban",
      category: "cityscape"
    },
    {
      id: 3,
      title: "Portrait Magic",
      description: "A portrait transformed with the whimsical character style of Howl's Moving Castle.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Portrait",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Portrait",
      category: "portrait"
    },
    {
      id: 4,
      title: "Pet Companion",
      description: "A pet photo reimagined as a magical Ghibli companion.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Pet",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Pet",
      category: "pet"
    },
    {
      id: 5,
      title: "Natural Wonder",
      description: "A natural landscape transformed in the Princess Mononoke style.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Nature",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Nature",
      category: "landscape"
    },
    {
      id: 6,
      title: "Architecture Dreams",
      description: "An architectural photo with the magical touch of Castle in the Sky.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Architecture",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Architecture",
      category: "cityscape"
    },
    {
      id: 7,
      title: "Group Portrait",
      description: "A family photo transformed into a heartwarming Ghibli scene.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Group",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Group",
      category: "portrait"
    },
    {
      id: 8,
      title: "Animal Friends",
      description: "Wildlife transformed into the charming animal companions from Ghibli films.",
      beforeImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Original+Animals",
      afterImage: "https://placehold.co/800x600/E6EFF2/4A6670?text=Ghibli+Animals",
      category: "pet"
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