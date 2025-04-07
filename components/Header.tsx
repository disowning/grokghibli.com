'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-r from-white via-ghibli-light/10 to-white border-b border-ghibli-light sticky top-0 z-50 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <div className="mr-3 relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Image
                  src="/images/logo/grokghibli-logo.svg"
                  alt="Grok Ghibli Logo"
                  width={40}
                  height={40}
                  className="drop-shadow-md"
                />
              </div>
              <span className="text-2xl md:text-3xl font-heading font-bold relative group">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-primary to-ghibli-primary/90 drop-shadow-sm">Grok</span>
                <span className="mx-1.5"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghibli-secondary to-ghibli-secondary/90 drop-shadow-sm">Ghibli</span>
                <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-ghibli-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/showcase">Showcase</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ghibli-dark p-2"
              aria-label="Toggle menu"
            >
              {!isMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <div className="flex items-center py-2 px-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <Image
                  src="/images/logo/grokghibli-logo.svg"
                  alt="Grok Ghibli Logo"
                  width={40}
                  height={40}
                  className="drop-shadow-md"
                />
              </div>
              <span className="text-lg font-heading font-bold">
                <span className="text-ghibli-primary">Grok</span> <span className="text-ghibli-secondary">Ghibli</span>
              </span>
            </div>
            <MobileNavLink href="/features" onClick={() => setIsMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink href="/showcase" onClick={() => setIsMenuOpen(false)}>Showcase</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
          </div>
        )}
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "text-ghibli-dark hover:text-ghibli-primary transition-colors font-medium relative group",
        className
      )}
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ghibli-primary to-ghibli-secondary group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link 
      href={href} 
      className="block py-2 px-3 text-ghibli-dark hover:bg-ghibli-light rounded-md transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  )
} 