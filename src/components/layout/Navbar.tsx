
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/categories', label: 'Products' },
    { path: '/careers', label: 'Careers' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/24c42267-8e02-494f-95c1-2c9dd3307076.png" 
                alt="Anantya Overseas" 
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActiveRoute(link.path)
                      ? 'text-brand-blue border-b-2 border-brand-blue'
                      : 'text-gray-700 hover:text-brand-blue hover:border-b-2 hover:border-brand-blue'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth/initial">
              <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/request-quote">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-blue focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActiveRoute(link.path)
                    ? 'text-brand-blue bg-blue-50'
                    : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200 space-y-2">
              <Link
                to="/auth/initial"
                className="block px-3 py-2 text-base font-medium text-brand-blue hover:bg-blue-50"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/request-quote"
                className="block px-3 py-2 text-base font-medium bg-brand-teal text-white rounded-md hover:bg-brand-teal/90 mx-3"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
