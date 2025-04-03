'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white border-b border-ghibli-light sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-heading font-bold text-ghibli-primary">Grok<span className="text-ghibli-secondary">Ghibli</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/showcase">Showcase</NavLink>
            <NavLink href="/pricing">Pricing</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button variant="secondary" className="ml-4">
              Try Now
            </Button>
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
            <MobileNavLink href="/features" onClick={() => setIsMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink href="/showcase" onClick={() => setIsMenuOpen(false)}>Showcase</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
            <div className="pt-2">
              <Button variant="secondary" className="w-full">
                Try Now
              </Button>
            </div>
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
        "text-ghibli-dark hover:text-ghibli-primary transition-colors font-medium",
        className
      )}
    >
      {children}
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