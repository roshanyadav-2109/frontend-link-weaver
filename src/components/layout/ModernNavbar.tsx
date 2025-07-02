
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ModernNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/client');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
              alt="Anantya Overseas" 
              className="h-8 w-8 md:h-10 md:w-10"
            />
            <span className="text-lg md:text-xl font-bold text-gray-900">
              Anantya Overseas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-blue transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-blue transition-colors">
              About
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-blue transition-colors">
              Products
            </Link>
            
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-brand-blue transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/request-quote">Request Quote</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/catalog-request">Catalog Request</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auth/manufacturer-auth">Partner With Us</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/careers" className="text-gray-700 hover:text-brand-blue transition-colors">
              Careers
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-blue transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/auth/client" className="text-gray-700 hover:text-brand-blue transition-colors">
              Sign In
            </Link>
            <Button onClick={handleGetStarted} className="bg-brand-blue hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-brand-blue hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 text-sm">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              
              {/* Mobile Services */}
              <div className="px-3 py-2">
                <div className="text-gray-700 font-medium mb-2">Services</div>
                <div className="pl-4 space-y-1">
                  <Link
                    to="/request-quote"
                    className="block py-1 text-gray-600 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Request Quote
                  </Link>
                  <Link
                    to="/catalog-request"
                    className="block py-1 text-gray-600 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Catalog Request
                  </Link>
                  <Link
                    to="/auth/manufacturer-auth"
                    className="block py-1 text-gray-600 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Partner With Us
                  </Link>
                </div>
              </div>

              <Link
                to="/careers"
                className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/auth/client"
                  className="block px-3 py-2 text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <div className="px-3 py-2">
                  <Button 
                    onClick={() => {
                      handleGetStarted();
                      setIsOpen(false);
                    }}
                    className="w-full bg-brand-blue hover:bg-blue-700 text-sm"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;
