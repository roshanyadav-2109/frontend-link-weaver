
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const ModernNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage && !isScrolled
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/logoanantya.png" 
              alt="Anantya Overseas" 
              className={`h-8 sm:h-10 w-auto transition-all duration-300 ${
                isHomePage && !isScrolled ? 'filter brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? isHomePage && !isScrolled
                      ? 'text-white border-b-2 border-white'
                      : 'text-brand-blue border-b-2 border-brand-blue'
                    : isHomePage && !isScrolled
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-700 hover:text-brand-blue'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${
                  isHomePage && !isScrolled ? 'text-white' : 'text-gray-700'
                }`}>
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className={
                    isHomePage && !isScrolled
                      ? 'border-white text-white hover:bg-white hover:text-gray-900'
                      : ''
                  }
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/initial-auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      isHomePage && !isScrolled
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-700 hover:text-brand-blue'
                    }
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/initial-auth">
                  <Button
                    size="sm"
                    className={
                      isHomePage && !isScrolled
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-brand-blue hover:bg-brand-blue/90'
                    }
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isHomePage && !isScrolled
                ? 'text-white hover:bg-white/10'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200/20 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-brand-blue bg-blue-50'
                      : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <p className="text-sm text-gray-600">
                    Welcome, {user.user_metadata?.full_name || user.email}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Link to="/auth/initial-auth" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/initial-auth" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;
