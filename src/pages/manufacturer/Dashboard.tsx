
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, MessageCircle, Users, TrendingUp, PieChart, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for catalog requests
const mockCatalogRequests = [
  {
    id: 'req-001',
    clientName: 'Global Imports Ltd.',
    date: '2023-11-12',
    products: ['Cotton Textiles', 'Handicrafts'],
    status: 'Fulfilled',
    country: 'United Kingdom'
  },
  {
    id: 'req-002',
    clientName: 'European Trade Network',
    date: '2023-12-05',
    products: ['Organic Spices', 'Processed Foods'],
    status: 'Processing',
    country: 'Germany'
  },
  {
    id: 'req-003',
    clientName: 'American Distributors Inc.',
    date: '2024-01-15',
    products: ['Leather Products'],
    status: 'New Request',
    country: 'United States'
  },
];

// Mock data for products
const mockProducts = [
  {
    id: 'prod-001',
    name: 'Premium Cotton Fabric',
    category: 'Textiles',
    views: 248,
    inquiries: 15,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prod-002',
    name: 'Organic Basmati Rice',
    category: 'Agriculture',
    views: 187,
    inquiries: 9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prod-003',
    name: 'Handcrafted Decorative Items',
    category: 'Handicrafts',
    views: 132,
    inquiries: 7,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80',
  },
];

// Mock data for inquiries
const mockInquiries = [
  {
    id: 'inq-001',
    clientName: 'John Smith',
    company: 'Global Trade Partners',
    date: '2023-12-20',
    subject: 'Price Inquiry - Cotton Products',
    status: 'Answered',
    message: 'I am interested in bulk orders of your premium cotton fabrics. Could you provide your pricing structure for orders over 5000 meters?'
  },
  {
    id: 'inq-002',
    clientName: 'Maria Rodriguez',
    company: 'European Imports Co.',
    date: '2024-01-10',
    subject: 'Sample Request - Organic Spices',
    status: 'Pending',
    message: 'We would like to request samples of your organic turmeric and cumin for quality assessment. Please let us know the procedure and costs involved.'
  }
];

const ManufacturerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [catalogRequests] = useState(mockCatalogRequests);
  const [products] = useState(mockProducts);
  const [inquiries] = useState(mockInquiries);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/manufacturer');
      return;
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a365d]">Manufacturer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.company || 'Valued Partner'}!</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button className="bg-[#1a365d] hover:bg-[#0f2341]">
              <Package className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Summary Cards */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-[#2d6da3]" /> Catalog Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{catalogRequests.length}</p>
              <p className="text-sm text-gray-500">Total pending requests</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Package className="mr-2 h-5 w-5 text-[#2d6da3]" /> Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-500">Active product listings</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-[#2d6da3]" /> Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{inquiries.filter(i => i.status === 'Pending').length}</p>
              <p className="text-sm text-gray-500">Pending inquiries</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-[#2d6da3]" /> Product Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{products.reduce((total, product) => total + product.views, 0)}</p>
              <p className="text-sm text-gray-500">Total product views</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="catalog">
          <TabsList className="mb-8">
            <TabsTrigger value="catalog">Catalog Requests</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1a365d] mb-6">Recent Catalog Requests</h2>
              
              {catalogRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {catalogRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2d6da3]">{request.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.clientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.country}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.products.join(", ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'Fulfilled' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'Processing' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status === 'Fulfilled' && <CheckCircle className="mr-1 h-3 w-3" />}
                              {request.status === 'Processing' && <Clock className="mr-1 h-3 w-3" />}
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.status === 'New Request' ? (
                              <Button size="sm">Process Request</Button>
                            ) : request.status === 'Processing' ? (
                              <Button variant="outline" size="sm">Mark as Fulfilled</Button>
                            ) : (
                              <Button variant="outline" size="sm">View Details</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No catalog requests yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1a365d]">Your Products</h2>
                <Button>
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inquiries</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              {product.image ? (
                                <img 
                                  src={product.image}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-gray-800">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.views}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.inquiries}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1a365d] mb-6">Recent Inquiries</h2>
              
              {inquiries.length > 0 ? (
                <div className="space-y-6">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="shadow-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-medium">{inquiry.subject}</CardTitle>
                            <p className="text-sm">
                              <span className="text-[#2d6da3]">{inquiry.clientName}</span> from <span className="font-medium">{inquiry.company}</span>
                            </p>
                            <p className="text-xs text-gray-500">Received on {inquiry.date}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            inquiry.status === 'Answered' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{inquiry.message}</p>
                        <div className="mt-4 flex gap-2">
                          {inquiry.status === 'Pending' ? (
                            <Button>Reply Now</Button>
                          ) : (
                            <Button variant="outline">View Conversation</Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No inquiries yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
