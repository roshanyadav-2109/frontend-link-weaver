
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-brand-blue text-xl font-bold">Link<span className="text-brand-teal">Weaver</span></span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link to="/" className="text-brand-dark hover:text-brand-blue font-medium">
                Home
              </Link>
              <Link to="/categories" className="text-brand-dark hover:text-brand-blue font-medium">
                Products
              </Link>
              <Link to="/contact" className="text-brand-dark hover:text-brand-blue font-medium">
                Contact
              </Link>
              <Link to="/catalog-request" className="text-brand-dark hover:text-brand-blue font-medium">
                Request Catalog
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Link to="/auth/client">
                <Button variant="outline">Client Sign In</Button>
              </Link>
              <Link to="/auth/manufacturer">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">Manufacturer Sign In</Button>
              </Link>
            </div>
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue">
              Home
            </Link>
            <Link to="/categories" className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue">
              Products
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue">
              Contact
            </Link>
            <Link to="/catalog-request" className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue">
              Request Catalog
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3 space-x-3">
                <Link to="/auth/client" className="w-full">
                  <Button variant="outline" className="w-full">Client Sign In</Button>
                </Link>
              </div>
              <div className="mt-3 px-3">
                <Link to="/auth/manufacturer" className="w-full">
                  <Button className="w-full bg-brand-teal hover:bg-brand-teal/90">Manufacturer Sign In</Button>
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
