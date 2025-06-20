
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Info, Package, Briefcase, Phone, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const { user, profile, isAdmin, isManufacturer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out');
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Products', path: '/categories', icon: Package },
    { name: 'Careers', path: '/careers', icon: Briefcase },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
        
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="px-3 py-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-brand-blue text-white text-sm">
                  {getInitials(profile?.full_name || user?.email || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-800">
                  {profile?.full_name || 'User'}
                </div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>
          
          <Link
            to="/"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <Home className="mr-3 h-5 w-5" />
            Website Home
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-3 h-5 w-5" />
            My Dashboard
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-5 w-5" />
              Admin Panel
            </Link>
          )}

          {isManufacturer && (
            <Link
              to="/manufacturer/dashboard"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <User className="mr-3 h-5 w-5" />
              Manufacturer Dashboard
            </Link>
          )}

          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
