'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-level-background/95 backdrop-blur-md border-b border-level-primary/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Image
              src="/images/Level_Logo.png"
              alt="Level"
              width={140}
              height={48}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-sm text-level-muted-foreground hover:text-level-accent relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-level-accent after:transition-all after:duration-300"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('#contact')}
              className="btn-primary text-sm"
            >
              Get in Touch
            </button>
          </div>

          <button
            className="md:hidden p-2 text-level-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-level-primary/20">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.href)}
                  className="text-left text-level-muted-foreground hover:text-level-accent py-2"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleLinkClick('#contact')}
                className="btn-primary text-sm mt-2"
              >
                Get in Touch
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
