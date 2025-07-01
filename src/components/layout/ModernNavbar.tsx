
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Settings, Package } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, profile, signOut, loading } = useAuth();

  const isHomePage = location.pathname === '/';

  // Handle scroll to detect when to show background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PRODUCTS', href: '/products' },
    { name: 'CAREERS', href: '/careers' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const isActivePath = (path: string) => {
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

  // Determine navbar background and text colors
  const shouldShowBackground = !isHomePage || isHovered || isScrolled || isOpen;
  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    shouldShowBackground 
      ? 'bg-black/95 backdrop-blur-md shadow-lg' 
      : 'bg-transparent'
  }`;
  
  const textClasses = shouldShowBackground ? 'text-white' : 'text-white';

  return (
    <nav 
      className={navbarClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/logoanantya.png" 
              alt="Anantya Overseas" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${textClasses} hover:text-brand-teal transition-colors font-medium tracking-wide text-sm ${
                  isActivePath(item.href) ? 'text-brand-teal border-b-2 border-brand-teal pb-1' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`relative h-8 w-8 rounded-full ${textClasses}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-blue text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-gray-900">
                        {profile?.full_name || user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer text-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/products" className="cursor-pointer text-gray-700">
                      <Package className="mr-2 h-4 w-4" />
                      Products
                    </Link>
                  </DropdownMenuItem>
                  {profile?.user_type === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/auth/update-profile-client" className="cursor-pointer text-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.user_type === 'manufacturer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/auth/update-profile-manufacturer" className="cursor-pointer text-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                    disabled={loading}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {loading ? 'Signing out...' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/initial">
                  <Button variant="ghost" size="sm" className={`${textClasses} hover:bg-white/10`}>
                    SIGN IN
                  </Button>
                </Link>
                <Link to="/auth/initial">
                  <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                    GET STARTED
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className={textClasses}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-black text-white">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Navigation */}
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-white hover:text-brand-teal transition-colors font-medium py-2 tracking-wide ${
                        isActivePath(item.href) ? 'text-brand-teal' : ''
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-gray-700 pt-4">
                    {isAuthenticated && user ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-brand-blue text-white text-sm">
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
                          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link 
                          to="/products"
                          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          <span>Products</span>
                        </Link>
                        
                        {profile?.user_type === 'client' && (
                          <Link 
                            to="/auth/update-profile-client"
                            className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-white"
                            onClick={() => setIsOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        )}
                        
                        {profile?.user_type === 'manufacturer' && (
                          <Link 
                            to="/auth/update-profile-manufacturer"
                            className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-white"
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
                          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded text-red-400 w-full text-left"
                          disabled={loading}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{loading ? 'Signing out...' : 'Sign out'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth/initial" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800">
                            SIGN IN
                          </Button>
                        </Link>
                        <Link to="/auth/initial" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                            GET STARTED
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
