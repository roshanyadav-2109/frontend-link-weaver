
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CatalogForm } from '@/components/CatalogForm';

const CatalogRequest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Request Product Catalog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get access to our comprehensive product catalogs tailored to your business needs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Catalog Request Form</CardTitle>
              <p className="text-center text-gray-600">
                Fill out the form below and we'll send you the relevant product catalog
              </p>
            </CardHeader>
            <CardContent>
              <CatalogForm />
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-semibold mb-2">Comprehensive Catalogs</h3>
                  <p className="text-sm text-gray-600">
                    Detailed product information with specifications, pricing, and availability
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Receive your customized catalog within 24-48 hours via email
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold mb-2">Tailored Solutions</h3>
                  <p className="text-sm text-gray-600">
                    Catalogs customized based on your specific requirements and industry
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogRequest;
