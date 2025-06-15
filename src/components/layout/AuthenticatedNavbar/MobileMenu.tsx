
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isAdmin: boolean;
  getUserInitials: () => string;
  user: { email?: string | null } | null;
  signOut: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  setIsOpen,
  isAdmin,
  getUserInitials,
  user,
  signOut,
}) => {
  if (!isOpen) return null;
  return (
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
  );
};

export default MobileMenu;
