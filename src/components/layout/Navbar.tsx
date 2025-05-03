
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-premium py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-brand-blue' : 'text-white text-shadow-sm'}`}>
                Anantya<span className="text-brand-teal">Overseas</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-medium transition-colors relative ${isScrolled ? (isActive('/') ? 'text-brand-blue' : 'text-brand-dark') : (isActive('/') ? 'text-white font-semibold' : 'text-white/90 hover:text-white')} ${!isScrolled && 'text-shadow-sm'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors relative ${isScrolled ? (isActive('/about') ? 'text-brand-blue' : 'text-brand-dark') : (isActive('/about') ? 'text-white font-semibold' : 'text-white/90 hover:text-white')} ${!isScrolled && 'text-shadow-sm'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                About Us
              </Link>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link 
                    to="/categories" 
                    className={`font-medium transition-colors relative ${isScrolled ? (isActive('/categories') ? 'text-brand-blue' : 'text-brand-dark') : (isActive('/categories') ? 'text-white font-semibold' : 'text-white/90 hover:text-white')} ${!isScrolled && 'text-shadow-sm'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
                  >
                    Products
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 p-0 shadow-premium-blue premium-glass-card border-white/20">
                  <div className="grid grid-cols-2 gap-2 p-4">
                    {['Agriculture', 'Textiles', 'Electronics', 'Handicrafts'].map((cat) => (
                      <Link 
                        key={cat} 
                        to={`/categories/${cat.toLowerCase()}`}
                        className="p-2 hover:bg-brand-blue/5 rounded-md transition-colors"
                      >
                        <div className="font-medium text-brand-blue">{cat}</div>
                        <div className="text-xs text-gray-500">Explore {cat.toLowerCase()} products</div>
                      </Link>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <Link 
                to="/careers" 
                className={`font-medium transition-colors relative ${isScrolled ? (isActive('/careers') ? 'text-brand-blue' : 'text-brand-dark') : (isActive('/careers') ? 'text-white font-semibold' : 'text-white/90 hover:text-white')} ${!isScrolled && 'text-shadow-sm'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Careers
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium transition-colors relative ${isScrolled ? (isActive('/contact') ? 'text-brand-blue' : 'text-brand-dark') : (isActive('/contact') ? 'text-white font-semibold' : 'text-white/90 hover:text-white')} ${!isScrolled && 'text-shadow-sm'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Link to="/auth/client">
                <Button variant="outline" className={`${isScrolled ? 'border-brand-blue text-brand-blue hover:bg-brand-blue/5' : 'border-white text-white border-opacity-70 hover:border-opacity-100 text-shadow-sm hover:bg-white/10'} premium-btn`}>
                  Client Sign In
                </Button>
              </Link>
              <Link to="/auth/manufacturer">
                <Button className={`bg-brand-teal hover:bg-brand-teal/90 shadow-md hover:shadow-lg premium-btn ${!isScrolled && 'text-shadow-sm'}`}>
                  Manufacturer Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? 'text-brand-dark' : 'text-white'} hover:${isScrolled ? 'text-brand-blue' : 'text-white/80'} focus:outline-none`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-premium-blue">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/categories" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/careers" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Careers
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-x-3">
                <Link to="/auth/client" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-brand-blue text-brand-blue premium-btn">Client Sign In</Button>
                </Link>
              </div>
              <div className="mt-3 px-3">
                <Link to="/auth/manufacturer" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-brand-teal hover:bg-brand-teal/90 shadow-md hover:shadow-lg premium-btn">Manufacturer Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
