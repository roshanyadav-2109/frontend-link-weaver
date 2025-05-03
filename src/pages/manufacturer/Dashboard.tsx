
import React from 'react';
import { 
  Package, 
  TrendingUp,
  FileText,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();

  const statCards = [
    {
      title: 'Products',
      value: '24',
      change: '+3 this month',
      icon: <Package className="h-8 w-8 text-brand-blue" />
    },
    {
      title: 'Active Orders',
      value: '8',
      change: '3 awaiting shipment',
      icon: <ShoppingCart className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Catalog Requests',
      value: '12',
      change: '5 new requests',
      icon: <FileText className="h-8 w-8 text-orange-500" />
    },
    {
      title: 'Customer Inquiries',
      value: '16',
      change: '4 unread messages',
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />
    }
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manufacturer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">GSTIN</p>
          <p className="font-semibold text-gray-800">{profile?.gstin || user?.user_metadata?.gstin || 'Not provided'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Catalog Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: 'Global Imports Inc.', date: '2023-04-28', category: 'Textiles & Fabrics', status: 'New' },
                { client: 'European Trade LLC', date: '2023-04-26', category: 'Leather Products', status: 'Viewed' },
                { client: 'Asian Markets Co.', date: '2023-04-25', category: 'Handicrafts & Decor', status: 'Responded' },
                { client: 'American Retail Group', date: '2023-04-22', category: 'Textiles & Fabrics', status: 'New' },
              ].map((request, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800">{request.client}</p>
                    <p className="text-sm text-gray-500">{request.category}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      request.status === 'New' 
                        ? 'bg-blue-100 text-blue-800' 
                        : request.status === 'Viewed' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/manufacturer/catalog-requests" className="text-sm text-brand-blue hover:underline">View all catalog requests →</a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Handwoven Cotton Sarees', views: 452, inquiries: 24 },
                { name: 'Leather Laptop Bags', views: 328, inquiries: 18 },
                { name: 'Brass Decorative Items', views: 287, inquiries: 12 },
                { name: 'Organic Spice Set', views: 235, inquiries: 9 },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <div className="text-right">
                    <p className="text-sm"><span className="text-gray-500">Views:</span> <span className="font-semibold">{product.views}</span></p>
                    <p className="text-sm"><span className="text-gray-500">Inquiries:</span> <span className="font-semibold">{product.inquiries}</span></p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/manufacturer/products" className="text-sm text-brand-blue hover:underline">Manage all products →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
