
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  Package,
  Briefcase,
  LogOut,
  Settings,
  User
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/admin/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { path: '/admin/careers', label: 'Careers', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <aside className="w-64 bg-brand-blue text-white shadow-lg">
      <div className="p-4 border-b border-blue-800">
        <h2 className="text-xl font-bold">Anantya Admin</h2>
        <p className="text-sm text-blue-200 mt-1">Manage your exports</p>
      </div>
      
      <div className="flex flex-col h-full justify-between">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-blue-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t border-blue-800">
          <div className="flex items-center mb-4">
            <div className="bg-blue-900 rounded-full p-2 mr-3">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-blue-200">Admin</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center p-2 text-sm bg-white/10 rounded-md hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
