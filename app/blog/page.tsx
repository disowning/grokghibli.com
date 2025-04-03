import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Grok Ghibli Blog - Studio Ghibli Art & AI Transformation Articles',
  description: 'Explore insightful articles about Studio Ghibli art styles, AI transformation techniques, film analysis, and creative inspiration. Learn how Grok Ghibli transforms photos into Ghibli-style artwork.',
  keywords: [
    'grok ghibli blog', 
    'studio ghibli art analysis', 
    'ai photo transformation', 
    'ghibli animation style', 
    'totoro influence', 
    'spirited away colors',
    'ai art ethics',
    'ghibli-inspired artwork'
  ],
  openGraph: {
    title: 'Grok Ghibli Blog - Studio Ghibli Art & AI Transformation Articles',
    description: 'Explore insightful articles about Studio Ghibli art styles, AI transformation techniques, film analysis, and creative inspiration.',
    type: 'website',
    url: 'https://grokghibli.com/blog',
    images: [
      {
        url: 'https://grokghibli.com/images/og/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli Blog'
      }
    ]
  }
}

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  coverImage: string;
  category: string;
}

export default function BlogPage() {
  const blogPosts: BlogPost[] = [
    {
      id: "ghibli-art-style",
      title: "The Magic Behind Studio Ghibli's Distinctive Art Style",
      excerpt: "Explore the techniques, color palettes, and artistic choices that make Studio Ghibli films instantly recognizable and emotionally powerful.",
      date: "April 3, 2025",
      author: "Miyako H.",
      authorRole: "Art Director",
      readTime: "8 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=Ghibli+Art+Style",
      category: "Art Analysis"
    },
    {
      id: "ai-transformation-explained",
      title: "How AI Transforms Photos into Ghibli Artwork: The Technology Explained",
      excerpt: "A deep dive into the neural networks and algorithms that power GrokGhibli's transformation capabilities.",
      date: "March 25, 2025",
      author: "Ravi P.",
      authorRole: "AI Engineer",
      readTime: "12 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=AI+Technology",
      category: "Technology"
    },
    {
      id: "totoro-influence",
      title: "My Neighbor Totoro: The Influence on Modern Animation",
      excerpt: "How this beloved classic continues to shape animation aesthetics and storytelling 35 years after its release.",
      date: "February 18, 2025",
      author: "Emma T.",
      authorRole: "Animation Historian",
      readTime: "10 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=Totoro+Influence",
      category: "Film History"
    },
    {
      id: "creative-photo-ideas",
      title: "10 Creative Ways to Use Your Ghibli-Transformed Photos",
      excerpt: "From wall art to gifts, discover wonderful applications for your magical Ghibli-style transformations.",
      date: "January 15, 2025",
      author: "Sophie K.",
      authorRole: "Creative Director",
      readTime: "7 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=Creative+Ideas",
      category: "Creativity"
    },
    {
      id: "spirited-away-colors",
      title: "The Color Psychology of Spirited Away",
      excerpt: "A detailed analysis of how color is used to convey emotion and meaning in this Oscar-winning masterpiece.",
      date: "December 10, 2024",
      author: "James L.",
      authorRole: "Color Specialist",
      readTime: "9 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=Spirited+Away+Colors",
      category: "Art Analysis"
    },
    {
      id: "ai-art-ethics",
      title: "The Ethics of AI Art: Respecting the Ghibli Legacy",
      excerpt: "How AI art generators like GrokGhibli can honor artistic traditions while creating new possibilities.",
      date: "November 20, 2024",
      author: "Naomi R.",
      authorRole: "Ethics Researcher",
      readTime: "11 min read",
      coverImage: "https://placehold.co/800x450/E6EFF2/4A6670?text=AI+Ethics",
      category: "Technology"
    }
  ]

  // Group posts by category
  const categories = Array.from(new Set(blogPosts.map(post => post.category)))

  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-ghibli-dark">
          GrokGhibli Blog
        </h1>
        <p className="text-xl text-ghibli-primary max-w-3xl mx-auto">
          Explore articles about Studio Ghibli art, AI technology, and creative inspiration.
        </p>
      </section>

      {/* Featured Post */}
      <section>
        <div className="relative rounded-xl overflow-hidden aspect-[2/1] max-h-[500px]">
          <Image
            src={blogPosts[0].coverImage}
            alt={blogPosts[0].title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <div className="max-w-3xl text-white">
              <span className="inline-block bg-ghibli-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                {blogPosts[0].category}
              </span>
              <h2 className="text-2xl md:text-4xl font-heading font-bold mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="mb-4">{blogPosts[0].excerpt}</p>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-ghibli-light flex items-center justify-center text-ghibli-primary font-bold">
                  {blogPosts[0].author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{blogPosts[0].author}</p>
                  <p className="text-sm text-gray-300">{blogPosts[0].date} · {blogPosts[0].readTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span className="font-medium text-ghibli-dark">Browse by:</span>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className="bg-ghibli-primary text-white px-3 py-1 rounded-full text-sm">
              All
            </Link>
            {categories.map(category => (
              <Link 
                key={category} 
                href={`/blog?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-ghibli-light text-ghibli-primary px-3 py-1 rounded-full text-sm hover:bg-ghibli-light/70 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-heading font-semibold text-ghibli-dark mb-4">
            Stay Updated with GrokGhibli
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for the latest articles, tutorials, and updates on Ghibli-style AI transformations.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-ghibli-primary"
            />
            <button className="bg-ghibli-primary text-white px-6 py-2 rounded-md hover:bg-ghibli-primary/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/9]">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-ghibli-primary">
            {post.category}
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="flex items-center text-xs text-gray-500 space-x-2">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex items-center text-sm border-t mt-4">
        <div className="w-8 h-8 rounded-full bg-ghibli-light flex items-center justify-center text-ghibli-primary font-bold mr-2 text-xs">
          {post.author.charAt(0)}
        </div>
        <span className="font-medium">{post.author}</span>
        <span className="text-gray-500 ml-2">· {post.authorRole}</span>
      </CardFooter>
    </Card>
  )
} 