
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Briefcase, 
  Settings,
  Users,
  Home
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/quote-requests', icon: MessageSquare, label: 'Quote Requests' },
    { path: '/admin/manufacturer-partnerships', icon: Users, label: 'Manufacturer Partnerships' },
    { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/logoanantya.png" 
              alt="Anantya Overseas" 
              className="h-10 w-auto mr-3"
            />
          </Link>
        </div>
        
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Website Home</span>
          </Link>
          
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
