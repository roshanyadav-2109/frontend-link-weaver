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
import NavLinks from "./AuthenticatedNavbar/NavLinks";
import AvatarMenu from "./AuthenticatedNavbar/AvatarMenu";
import MobileMenu from "./AuthenticatedNavbar/MobileMenu";

const AuthenticatedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const getUserInitials = () => user?.email?.charAt(0).toUpperCase() || "U";

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
            <NavLinks />
          </div>

          <div className="hidden md:flex items-center gap-3 h-16">
            <AvatarMenu />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-blue focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      <MobileMenu 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAdmin={isAdmin}
        getUserInitials={getUserInitials}
        user={user}
        signOut={signOut}
      />
    </nav>
  );
};

export default AuthenticatedNavbar;
