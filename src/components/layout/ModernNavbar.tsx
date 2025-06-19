
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ModernNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Initial load animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true); // Always show solid background on non-home pages
    }
  }, [isHomePage]);

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PRODUCTS', path: '/categories' },
    { name: 'CAREER', path: '/careers' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled || !isHomePage
        ? 'bg-black/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-4'
    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section - Left */}
          <div className={`flex items-center transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}>
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/anantyalogo.png" 
                alt="Anantya Overseas" 
                className="h-12 w-auto filter brightness-0 invert transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Menu - Center */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-white font-medium text-sm tracking-wide transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                } hover:text-brand-red group`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full ${
                  location.pathname === item.path ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Company Logo - Right */}
          <div className={`flex items-center transition-all duration-700 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}>
            <img 
              src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
              alt="Anantya Brand" 
              className="h-10 w-auto filter brightness-0 invert transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
