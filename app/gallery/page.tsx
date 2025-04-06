import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore the transformations created with Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
};

export default function Gallery() {
  // Sample gallery items - in a real app, these would come from a database or API
  const galleryItems = [
    {
      id: 1,
      title: 'Mountain Lake',
      description: 'A serene mountain lake transformed into Ghibli style',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
    {
      id: 2,
      title: 'City Street',
      description: 'Urban landscape with Ghibli magic',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
    {
      id: 3,
      title: 'Forest Path',
      description: 'A winding forest path in Ghibli style',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
    {
      id: 4,
      title: 'Coastal Village',
      description: 'Seaside town with Ghibli aesthetics',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
    {
      id: 5,
      title: 'Summer Garden',
      description: 'Lush garden scene in Ghibli style',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
    {
      id: 6,
      title: 'Country Road',
      description: 'Winding country road with Ghibli magic',
      imageSrc: '/images/showcase/showcase-after.webp',
      originalSrc: '/images/showcase/showcase-before.webp',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-ghibli-primary text-center">Gallery of Transformations</h1>
        
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Explore our collection of photos transformed into the magical style of Studio Ghibli. 
          See the before and after of each transformation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image 
                  src={item.imageSrc} 
                  alt={item.title} 
                  width={400} 
                  height={300} 
                  className="w-full h-64 object-cover"
                />
                
                {/* Hover overlay with original image */}
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-95 transition-opacity flex items-center justify-center">
                  <Image 
                    src={item.originalSrc} 
                    alt={`Original ${item.title}`} 
                    width={400} 
                    height={300} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-center text-sm">
                    Hover to see original
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-ghibli-primary">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Create your own Ghibli-style transformations by uploading your photos on our home page.
          </p>
          <a 
            href="/"
            className="inline-block mt-4 bg-ghibli-primary text-white px-6 py-2 rounded-md hover:bg-ghibli-primary-dark transition-colors"
          >
            Start Transforming
          </a>
        </div>
      </div>
    </div>
  );
} 