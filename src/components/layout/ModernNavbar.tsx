
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ModernNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, signOut, isAdmin, isManufacturer } = useAuth();

  useEffect(() => {
    // Trigger initial load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/categories', label: 'PRODUCTS' },
    { path: '/careers', label: 'CAREER' },
    { path: '/contact', label: 'CONTACT US' },
  ];

  const getUserInitials = () => user?.email?.charAt(0).toUpperCase() || "U";

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isManufacturer) return '/manufacturer/dashboard';
    return '/dashboard';
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      } ${
        isScrolled 
          ? 'bg-corporate-dark shadow-premium py-3' 
          : 'bg-corporate-dark/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Logo */}
          <div 
            className={`flex-shrink-0 transition-all duration-700 delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/Black_logo_anantya.png" 
                alt="Anantya Overseas" 
                className="h-12 w-auto brightness-0 invert hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center Navigation Menu - Desktop */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <div
                  key={link.path}
                  className={`transition-all duration-700 ${
                    isLoaded 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-3'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <Link
                    to={link.path}
                    className={`relative text-sm font-medium tracking-wide transition-all duration-300 group ${
                      isActiveRoute(link.path)
                        ? 'text-corporate-accent'
                        : 'text-white hover:text-corporate-accent'
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute left-0 bottom-0 h-0.5 bg-corporate-accent transition-all duration-300 ${
                        isActiveRoute(link.path) 
                          ? 'w-full' 
                          : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right Logo & Auth Section */}
          <div 
            className={`flex items-center space-x-6 transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {/* Brand Logo */}
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
                alt="Brand Logo" 
                className="h-10 w-auto brightness-0 invert hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to={getDashboardPath()}>
                    <Button 
                      variant="outline" 
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-white transition-all duration-300"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-10 w-10 rounded-full hover:bg-corporate-accent/20 transition-colors duration-300"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-corporate-accent text-white">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-corporate-dark border-gray-700">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-white">My Account</p>
                          <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem asChild>
                        <Link to={getDashboardPath()} className="flex items-center w-full text-white hover:text-corporate-accent">
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={signOut} className="text-white hover:text-corporate-accent">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link to="/auth/initial">
                    <Button 
                      variant="outline" 
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-white transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/request-quote">
                    <Button className="bg-corporate-accent hover:bg-corporate-accent/90 text-white transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-corporate-accent focus:outline-none transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden bg-corporate-dark border-t border-gray-700 transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isActiveRoute(link.path)
                  ? 'text-corporate-accent bg-corporate-accent/10'
                  : 'text-white hover:text-corporate-accent hover:bg-corporate-accent/10'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-700 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-corporate-accent text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-white">{user?.email}</div>
                    </div>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="block px-3 py-2 text-base font-medium text-corporate-accent hover:bg-corporate-accent/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-corporate-accent hover:bg-corporate-accent/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/initial"
                  className="block px-3 py-2 text-base font-medium text-corporate-accent hover:bg-corporate-accent/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/request-quote"
                  className="block px-3 py-2 text-base font-medium bg-corporate-accent text-white rounded-md hover:bg-corporate-accent/90 mx-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
