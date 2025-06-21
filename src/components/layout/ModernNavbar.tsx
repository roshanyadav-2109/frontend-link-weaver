import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ModernNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    if (isHomePage && !isAuthenticated) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [isHomePage, isAuthenticated]);

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'HOME', path: '/' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'CAREER', path: '/careers' },
        { name: 'CONTACT US', path: '/contact' },
      ];
    }

    if (profile?.is_admin) {
      return [
        { name: 'DASHBOARD', path: '/admin' },
        { name: 'PRODUCTS', path: '/admin/products' },
        { name: 'QUOTES', path: '/admin/quote-requests' },
        { name: 'CAREERS', path: '/admin/careers' },
      ];
    } else if (profile?.user_type === 'manufacturer') {
      return [
        { name: 'DASHBOARD', path: '/manufacturer/dashboard' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'CATALOG REQUESTS', path: '/manufacturer/catalog-requests' },
        { name: 'CONTACT', path: '/contact' },
      ];
    } else {
      return [
        { name: 'DASHBOARD', path: '/dashboard' },
        { name: 'PRODUCTS', path: '/products' },
        { name: 'QUOTE REQUEST', path: '/request-quote' },
        { name: 'CONTACT', path: '/contact' },
      ];
    }
  };

  const navItems = getNavItems();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled || !isHomePage || isAuthenticated
        ? 'bg-black/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-4'
    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className={`flex items-center transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}>
            <Link to={isAuthenticated ? (profile?.is_admin ? '/admin' : profile?.user_type === 'manufacturer' ? '/manufacturer/dashboard' : '/dashboard') : '/'} className="flex items-center">
              <img 
                src="/lovable-uploads/logoanantya.png" 
                alt="Anantya Overseas" 
                className="h-12 w-auto filter brightness-0 invert transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Navigation Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-white font-medium text-sm tracking-wide transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                } hover:text-brand-red group`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-brand-red transition-all duration-300 group-hover:w-full ${
                  location.pathname === item.path ? 'w-full' : ''
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Right Side - User Menu or Company Logo */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm font-medium">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-gray-300 text-xs capitalize">
                    {profile?.user_type || 'user'}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-white hover:text-brand-red transition-colors p-2 hover:bg-white/10 rounded-md"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className={`transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
              }`}>
                <img 
                  src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
                  alt="Anantya Brand" 
                  className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 hover:bg-white/10 rounded-md transition-colors z-50 relative"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-40 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} style={{ top: '80px' }}>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-white font-medium text-lg tracking-wide py-3 px-4 hover:bg-white/10 rounded-md transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  } ${location.pathname === item.path ? 'bg-white/10 text-brand-red' : ''}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <div className="border-t border-white/20 pt-6 mt-6">
                  <div className="text-white mb-4 px-4">
                    <p className="font-medium">{profile?.full_name || user?.email?.split('@')[0]}</p>
                    <p className="text-gray-300 text-sm capitalize">{profile?.user_type || 'user'}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-white font-medium text-lg tracking-wide py-3 px-4 hover:bg-white/10 rounded-md transition-all duration-300 w-full"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
