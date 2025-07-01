import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Settings, Package, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ModernNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, profile, signOut, loading } = useAuth();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    if (isHomePage && !isAuthenticated) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsScrolled(true); // Always show solid background for authenticated users or non-home pages
    }
  }, [isHomePage, isAuthenticated]);

  const handleSignOut = async () => {
    await signOut();
  };

  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'HOME', href: '/' },
        { name: 'ABOUT US', href: '/about' },
        { name: 'PRODUCTS', href: '/products' },
        { name: 'CAREERS', href: '/careers' },
        { name: 'CONTACT US', href: '/contact' },
      ];
    }

    // Authenticated user navigation
    if (profile?.is_admin) {
      return [
        { name: 'DASHBOARD', href: '/admin' },
        { name: 'PRODUCTS', href: '/admin/products' },
        { name: 'QUOTES', href: '/admin/quote-requests' },
        { name: 'CAREERS', href: '/admin/careers' },
      ];
    } else if (profile?.user_type === 'manufacturer') {
      return [
        { name: 'DASHBOARD', href: '/manufacturer/dashboard' },
        { name: 'PRODUCTS', href: '/products' },
        { name: 'CATALOG REQUESTS', href: '/manufacturer/catalog-requests' },
        { name: 'CONTACT', href: '/contact' },
      ];
    } else {
      return [
        { name: 'DASHBOARD', href: '/dashboard' },
        { name: 'PRODUCTS', href: '/products' },
        { name: 'QUOTE REQUEST', href: '/request-quote' },
        { name: 'CONTACT', href: '/contact' },
      ];
    }
  };

  const navItems = getNavItems();

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDashboardLink = () => {
    if (profile?.is_admin) return '/admin';
    if (profile?.user_type === 'manufacturer') return '/manufacturer/dashboard';
    return '/dashboard';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled || !isHomePage || isAuthenticated
        ? 'bg-black/95 backdrop-blur-md shadow-lg py-3' 
        : 'bg-transparent py-4'
    } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'} hover:bg-black/95 hover:backdrop-blur-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Logo */}
          <div className={`flex items-center transition-all duration-700 delay-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}>
            <Link to={isAuthenticated ? getDashboardLink() : '/'} className="flex items-center">
              <img 
                src="/lovable-uploads/logoanantya.png" 
                alt="Anantya Overseas" 
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center space-x-8 transition-all duration-700 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}>
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-white font-medium text-sm tracking-wide transition-all duration-300 hover:text-brand-red relative ${
                  isActivePath(item.href) ? 'text-brand-red' : ''
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {item.name}
                {isActivePath(item.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-red"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - User Menu or Company Logo */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-red text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/95 border-gray-700" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-white">
                        {profile?.full_name || user?.email}
                      </p>
                      <p className="text-xs text-gray-300">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer text-white hover:text-brand-red">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products" className="cursor-pointer text-white hover:text-brand-red">
                      <Package className="mr-2 h-4 w-4" />
                      Products
                    </Link>
                  </DropdownMenuItem>
                  {profile?.user_type === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/auth/update-profile-client" className="cursor-pointer text-white hover:text-brand-red">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.user_type === 'manufacturer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/auth/update-profile-manufacturer" className="cursor-pointer text-white hover:text-brand-red">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {loading ? 'Signing out...' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <div className={`transition-all duration-700 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
                }`}>
                  <img 
                    src="/lovable-uploads/Black_White_Minimalist_Professional_Initial_Logo__1_-removebg-preview.png" 
                    alt="Anantya Brand" 
                    className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Link to="/auth/initial">
                    <Button variant="ghost" size="sm" className="text-white hover:text-brand-red hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/initial">
                    <Button size="sm" className="bg-brand-red hover:bg-brand-red/90 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:text-brand-red">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black/95 border-gray-700">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation */}
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-white hover:text-brand-red transition-colors font-medium text-lg tracking-wide py-3 ${
                        isActivePath(item.href) ? 'text-brand-red' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-white/20 pt-4">
                    {isAuthenticated && user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-brand-red text-white text-sm">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-white">
                              {profile?.full_name || user.email}
                            </p>
                            <p className="text-xs text-gray-300">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        
                        <Link 
                          to={getDashboardLink()}
                          className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link 
                          to="/products"
                          className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>Products</span>
                        </Link>
                        
                        {profile?.user_type === 'client' && (
                          <Link 
                            to="/auth/update-profile-client"
                            className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded text-white"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        )}
                        
                        {profile?.user_type === 'manufacturer' && (
                          <Link 
                            to="/auth/update-profile-manufacturer"
                            className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded text-white"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        )}
                        
                        <button 
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                          className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded text-red-400 w-full text-left"
                          disabled={loading}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{loading ? 'Signing out...' : 'Sign out'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth/initial" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-white hover:text-brand-red hover:bg-white/10">
                            Sign In
                          </Button>
                        </Link>
                        <Link to="/auth/initial" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
