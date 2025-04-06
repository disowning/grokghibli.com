import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ghibli-primary">About Grok Ghibli</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Grok Ghibli is a passion project that brings the magical world of Studio Ghibli aesthetics to your personal photos through the power of AI.
          </p>
          
          <p>
            Our mission is to provide an easy-to-use tool that transforms ordinary photos into extraordinary artwork inspired by the unique visual style of Studio Ghibli films.
          </p>
          
          <p>
            This project is a fan-made tribute and is not affiliated with Studio Ghibli or any official Ghibli entities.
          </p>
        </div>
      </div>
    </div>
  );
} 