
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, LogIn, UserPlus } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
                alt="Anantya Overseas" 
                className="h-10 w-10"
              />
              <h3 className="text-xl font-bold">Anantya Overseas</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for global export solutions, connecting businesses worldwide with quality products and reliable services.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Auth */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/request-quote" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Request Quote
                </Link>
              </li>
              <li>
                <Link to="/catalog-request" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Catalog Request
                </Link>
              </li>
              <li>
                <Link to="/auth/manufacturer-auth" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Partner With Us
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h5 className="text-sm font-semibold mb-2">Account</h5>
              <div className="flex flex-col space-y-2">
                <Link to="/auth/client" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
                <Link to="/auth/client?register=true" className="text-gray-300 hover:text-white transition-colors text-sm flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-300 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm">
                  Ahmedabad, Gujarat 380054<br />
                  India
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-300 flex-shrink-0" />
                <a 
                  href="mailto:anantyaoverseas@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm break-all"
                >
                  anantyaoverseas@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Anantya Overseas. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors text-sm">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
