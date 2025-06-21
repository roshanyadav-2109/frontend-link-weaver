
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/logoanantya.png" 
                alt="Anantya Overseas" 
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting global markets through innovative sourcing solutions and strategic partnerships.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/anantya_overseas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-blue transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/anantya-overseas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-blue transition-colors"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/request-quote" 
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Global Sourcing</span></li>
              <li><span className="text-gray-300">B2B Wholesale</span></li>
              <li><span className="text-gray-300">Quality Assurance</span></li>
              <li><span className="text-gray-300">Export Solutions</span></li>
              <li><span className="text-gray-300">Startup Support</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-blue" />
                <a 
                  href="mailto:anantyaoverseas@gmail.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  anantyaoverseas@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-brand-blue" />
                <span className="text-gray-300 text-sm">Ahmedabad, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Anantya Overseas. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
