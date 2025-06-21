
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ModernNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getDashboardLink = () => {
    if (profile?.is_admin) return '/admin';
    if (profile?.user_type === 'manufacturer') return '/manufacturer/dashboard';
    return '/dashboard';
  };

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
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-brand-blue transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-32 truncate">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to={profile?.user_type === 'manufacturer' 
                        ? '/auth/update-profile-manufacturer' 
                        : '/auth/update-profile-client'
                      } 
                      className="flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Link to="/auth/initial">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/request-quote">
                  <Button>Get Quote</Button>
                </Link>
              </div>
            )}
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
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-700 hover:text-brand-blue transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-4">
              {loading ? (
                <div className="animate-pulse bg-gray-200 rounded h-8 w-full"></div>
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to={getDashboardLink()}
                    className="flex items-center py-2 text-gray-700 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to={profile?.user_type === 'manufacturer' 
                      ? '/auth/update-profile-manufacturer' 
                      : '/auth/update-profile-client'
                    }
                    className="flex items-center py-2 text-gray-700 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center py-2 text-red-600 hover:text-red-700 transition-colors w-full text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link to="/auth/initial" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/request-quote" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Quote</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;
