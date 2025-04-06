import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ghibli-primary">Grok Ghibli</h3>
            <p className="text-gray-600">
              Transform your photos into Studio Ghibli style artwork using AI.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ghibli-primary">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-ghibli-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-ghibli-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-ghibli-primary">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-ghibli-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-ghibli-primary">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-ghibli-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-600 hover:text-ghibli-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-600 hover:text-ghibli-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {currentYear} Grok Ghibli. All rights reserved.</p>
          <p className="mt-1">
            Grok Ghibli is a fan project and not affiliated with Studio Ghibli.
          </p>
        </div>
      </div>
    </footer>
  );
} 