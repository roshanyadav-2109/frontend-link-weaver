
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Factory } from 'lucide-react';

const InitialAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-brand-blue">Anantya</span><span className="text-brand-teal">Overseas</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for global trade and business connections. Choose your account type to get started.
          </p>
        </div>

        {/* Authentication Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Client Option */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-blue group cursor-pointer">
            <Link to="/auth/client" className="block">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-brand-blue" />
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-brand-blue transition-colors">
                  Login as Client
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Looking to source products or connect with manufacturers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>• Browse product catalogs</li>
                  <li>• Request quotes from suppliers</li>
                  <li>• Manage purchase orders</li>
                  <li>• Track shipments</li>
                </ul>
                <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                  Get Started as Client
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Manufacturer Option */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-brand-teal group cursor-pointer">
            <Link to="/auth/manufacturer" className="block">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Factory className="w-8 h-8 text-brand-teal" />
                </div>
                <CardTitle className="text-2xl text-gray-900 group-hover:text-brand-teal transition-colors">
                  Login as Manufacturer
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Ready to showcase your products and connect with buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-500 space-y-2 mb-6">
                  <li>• List your products</li>
                  <li>• Manage inquiries & quotes</li>
                  <li>• Connect with global buyers</li>
                  <li>• Track business metrics</li>
                </ul>
                <Button className="w-full bg-brand-teal hover:bg-brand-teal/90">
                  Get Started as Manufacturer
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Already have an account? Click on your account type above to sign in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitialAuth;
