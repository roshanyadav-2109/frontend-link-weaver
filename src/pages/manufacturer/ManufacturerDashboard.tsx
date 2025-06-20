
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Factory, FileText, Settings, Mail } from 'lucide-react';

const ManufacturerDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manufacturer Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your manufacturing business and partnerships</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Factory className="h-5 w-5 mr-2 text-brand-blue" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage your manufacturing profile and capabilities</p>
              <Link to="/auth/update-profile-manufacturer">
                <Button variant="outline" className="w-full">
                  Update Profile
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
              <p className="text-gray-600 mb-4">View and respond to catalog requests</p>
              <Link to="/manufacturer/catalog-requests">
                <Button variant="outline" className="w-full">
                  View Requests
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Mail className="h-5 w-5 mr-2 text-brand-blue" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get help with your manufacturer account</p>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Contact Us
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
                    <Factory className="h-6 w-6 mb-2" />
                    Browse Categories
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <Settings className="h-6 w-6 mb-2" />
                    About Company
                  </Button>
                </Link>
                <Link to="/careers">
                  <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                    <Mail className="h-6 w-6 mb-2" />
                    Careers
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

export default ManufacturerDashboard;
