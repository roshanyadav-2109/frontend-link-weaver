
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, FileText, Settings } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Manage your account and track your activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-brand-blue" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your personal information and preferences</p>
              <Link to="/auth/update-profile-client">
                <Button variant="outline" className="w-full">
                  Update Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <ShoppingCart className="h-5 w-5 mr-2 text-brand-blue" />
                Quote Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and track your product quote requests</p>
              <Link to="/request-quote">
                <Button variant="outline" className="w-full">
                  New Quote Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-brand-blue" />
                Catalog Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Request product catalogs from manufacturers</p>
              <Link to="/catalog-request">
                <Button variant="outline" className="w-full">
                  Request Catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/categories">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <ShoppingCart className="h-6 w-6 mb-2" />
                    Browse Products
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Contact Us
                  </Button>
                </Link>
                <Link to="/careers">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <User className="h-6 w-6 mb-2" />
                    Careers
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <Settings className="h-6 w-6 mb-2" />
                    About Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
