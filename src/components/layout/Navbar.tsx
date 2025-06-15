
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Remove isScrolled state since we always want a solid navbar
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Remove useEffect for scroll detection

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-premium py-2 transition-all duration-300`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between h-16 gap-4">
          <div className="flex items-center h-16">
            <Link to="/" className="flex-shrink-0 flex items-center h-16">
              <span className={`text-xl font-bold transition-colors duration-300 text-brand-blue`}>
                Anantya<span className="text-brand-teal">Overseas</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block flex-1">
            <div className="ml-10 flex items-center space-x-8 h-16">
              <Link 
                to="/" 
                className={`font-medium transition-colors relative ${isActive('/') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors relative ${isActive('/about') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                About Us
              </Link>
              <Link 
                to="/careers" 
                className={`font-medium transition-colors relative ${isActive('/careers') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Careers
              </Link>
              <Link 
                to="/contact" 
                className={`font-medium transition-colors relative ${isActive('/contact') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 h-16">
            <Link to="/auth/client">
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/5 premium-btn">
                Client Sign In
              </Button>
            </Link>
            <Link to="/auth/manufacturer">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 shadow-md hover:shadow-lg premium-btn">
                Manufacturer Sign In
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-blue focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-premium-blue z-50">
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

