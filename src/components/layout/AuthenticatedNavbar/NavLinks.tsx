
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NavLinks: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
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
  );
};

export default NavLinks;
