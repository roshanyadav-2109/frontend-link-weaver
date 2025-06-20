
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NavLinks from "./AuthenticatedNavbar/NavLinks";
import AvatarMenu from "./AuthenticatedNavbar/AvatarMenu";
import MobileMenu from "./AuthenticatedNavbar/MobileMenu";

const AuthenticatedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/logoanantya.png" 
                alt="Anantya Overseas" 
                className="h-16 w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <NavLinks />
          </div>

          {/* Desktop Avatar Menu */}
          <div className="hidden md:flex items-center">
            <AvatarMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-blue focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </nav>
  );
};

export default AuthenticatedNavbar;
