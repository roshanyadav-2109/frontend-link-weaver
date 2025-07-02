
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Briefcase, 
  Settings, 
  Users,
  UserCheck,
  ClipboardList
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: FileText, label: 'Quote Requests', path: '/admin/quote-requests' },
    { icon: Users, label: 'Manufacturer Partnerships', path: '/admin/manufacturer-partnerships' },
    { icon: UserCheck, label: 'Job Applications', path: '/admin/job-applications' },
    { icon: ClipboardList, label: 'Applications Manager', path: '/admin/applications' },
    { icon: Briefcase, label: 'Careers', path: '/admin/careers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white shadow-lg w-64 min-h-screen">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-brand-blue transition-colors ${
                isActive(item.path) ? 'bg-blue-50 text-brand-blue border-r-2 border-brand-blue' : ''
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
