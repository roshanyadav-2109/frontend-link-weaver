
import React, { useState } from 'react';
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

const AuthenticatedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Remove isScrolled state
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check if active route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Remove useEffect for scroll detection

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-premium py-2 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between h-16 gap-4">
          <div className="flex items-center h-16">
            <Link to="/" className="flex-shrink-0 flex items-center h-16">
              <span className="text-xl font-bold transition-colors duration-300 text-brand-blue">
                Anantya<span className="text-brand-teal">Overseas</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block flex-1">
            <div className="ml-10 flex items-center space-x-8 h-16">
              <Link 
                to="/" 
                className={`font-medium transition-colors relative ${isActive('/') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`font-medium transition-colors relative ${isActive('/about') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                About Us
              </Link>
              <Link 
                to="/categories" 
                className={`font-medium transition-colors relative ${isActive('/categories') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Products
              </Link>
              <Link 
                to="/dashboard" 
                className={`font-medium transition-colors relative ${isActive('/dashboard') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`font-medium transition-colors relative ${isActive('/admin') ? 'text-brand-blue' : 'text-brand-dark'} after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-teal after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 h-16">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-brand-teal text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-premium-blue z-50">
          <div className="px-4 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/categories" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/dashboard" 
              className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block px-3 py-2 text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-brand-teal text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 px-3">
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-brand-dark hover:text-brand-blue hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthenticatedNavbar;

