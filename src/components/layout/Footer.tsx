import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Globe, Shield, Users } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-brand-blue to-[#0F2942] text-white relative">
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      
      {/* Top wave */}
      <div className="relative">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-white w-full">
          <path d="M0 0L48 15C96 30 192 60 288 65C384 70 480 50 576 45C672 40 768 50 864 55C960 60 1056 60 1152 50C1248 40 1344 20 1392 10L1440 0V120H0V0Z"/>
        </svg>
      </div>
      
      {/* Footer content */}
      <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Anantya<span className="text-brand-teal">Overseas</span></h3>
            <p className="mb-6 text-gray-300">
              Global Trade, Heartfelt Partnerships. We help you source, ship, and scale—seamlessly.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/anantya-overseas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white h-10 w-10 flex items-center justify-center rounded-full transition-colors shadow-inner"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/anantya_overseas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white h-10 w-10 flex items-center justify-center rounded-full transition-colors shadow-inner"
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363-.416-2.427-.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058v.08c0 2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-brand-teal" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white transition-colors hover:underline">Products</Link>
              </li>
              <li>
                <Link to="/catalog-request" className="text-gray-300 hover:text-white transition-colors hover:underline">Request Catalogue</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors hover:underline">Contact Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors hover:underline">Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-brand-teal" />
              For Manufacturers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/auth/manufacturer" className="text-gray-300 hover:text-white transition-colors hover:underline">Sign In</Link>
              </li>
              <li>
                <Link to="/auth/manufacturer?register=true" className="text-gray-300 hover:text-white transition-colors hover:underline">Register</Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Submit Products</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-brand-teal" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-brand-teal flex-shrink-0" />
                <span className="text-gray-300">Ahmedabad, Gujarat, India</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-brand-teal flex-shrink-0" />
                <a href="mailto:info@anantyaoverseas.com" className="text-gray-300 hover:text-white transition-colors hover:underline">info@anantyaoverseas.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Anantya Overseas. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
