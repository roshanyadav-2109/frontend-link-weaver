
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for catalog requests
const mockCatalogRequests = [
  {
    id: 'req-001',
    date: '2023-11-12',
    products: ['Cotton Textiles', 'Handicrafts'],
    status: 'Delivered',
  },
  {
    id: 'req-002',
    date: '2023-12-05',
    products: ['Organic Spices', 'Processed Foods'],
    status: 'Processing',
  },
  {
    id: 'req-003',
    date: '2024-01-15',
    products: ['Leather Products'],
    status: 'Pending',
  },
];

// Mock data for recent products viewed
const mockRecentlyViewed = [
  {
    id: 'prod-001',
    name: 'Premium Cotton Fabric',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prod-002',
    name: 'Organic Basmati Rice',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prod-003',
    name: 'Handcrafted Decorative Items',
    category: 'Handicrafts',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=200&q=80',
  },
];

// Mock data for inquiries
const mockInquiries = [
  {
    id: 'inq-001',
    date: '2023-12-20',
    subject: 'Price Inquiry - Cotton Products',
    status: 'Answered',
    message: 'Thank you for your inquiry. Our representative has provided pricing details for bulk orders.'
  },
  {
    id: 'inq-002',
    date: '2024-01-10',
    subject: 'Sample Request - Organic Spices',
    status: 'Pending',
    message: 'We are reviewing your sample request and will get back to you shortly.'
  }
];

const ClientDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [catalogRequests, setCatalogRequests] = useState(mockCatalogRequests);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [inquiries] = useState(mockInquiries);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/client');
      return;
    }

    // Load recently viewed products from localStorage
    try {
      const storedProducts = localStorage.getItem('viewedProducts');
      if (storedProducts) {
        setRecentlyViewed(JSON.parse(storedProducts).slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading viewed products:', error);
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
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a365d]">Client Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || 'Valued Client'}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/catalog-request">
              <Button className="bg-[#1a365d] hover:bg-[#0f2341]">
                Request New Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="catalogs">My Catalogs</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Summary Cards */}
              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-[#2d6da3]" /> Catalog Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{catalogRequests.length}</p>
                  <p className="text-sm text-gray-500">Total catalog requests</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Package className="mr-2 h-5 w-5 text-[#2d6da3]" /> Products Viewed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{recentlyViewed.length}</p>
                  <p className="text-sm text-gray-500">Recently viewed products</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-[#2d6da3]" /> Pending Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{inquiries.filter(i => i.status === 'Pending').length}</p>
                  <p className="text-sm text-gray-500">Awaiting response</p>
                </CardContent>
              </Card>
            </div>

            {/* Recently Viewed Products */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">Recently Viewed Products</h2>
              {recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recentlyViewed.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                      <div className="w-1/3 bg-gray-100">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="w-2/3 p-4">
                        <h3 className="font-medium text-[#1a365d]">{product.name}</h3>
                        {product.category && (
                          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        )}
                        <Link to={`/categories/${product.category?.toLowerCase()}/${product.subcategory?.toLowerCase()}`}>
                          <Button variant="link" className="text-[#2d6da3] p-0 h-auto">View Similar</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="bg-white shadow-sm p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't viewed any products yet.</p>
                  <Link to="/categories">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </Card>
              )}
            </div>

            {/* Recent Catalog Requests */}
            <div>
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">Recent Catalog Requests</h2>
              {catalogRequests.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {catalogRequests.slice(0, 3).map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2d6da3]">{request.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {request.products.join(", ")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                request.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : request.status === 'Processing' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <Card className="bg-white shadow-sm p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't requested any catalogs yet.</p>
                  <Link to="/catalog-request">
                    <Button variant="outline">Request Catalog</Button>
                  </Link>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="catalogs">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#1a365d] mb-6">My Catalog Requests</h2>
              
              {catalogRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {request.products.join(", ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'Processing' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {request.status === 'Delivered' && <CheckCircle className="mr-1 h-3 w-3" />}
                              {request.status === 'Processing' && <Clock className="mr-1 h-3 w-3" />}
                              {request.status === 'Pending' && <AlertCircle className="mr-1 h-3 w-3" />}
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.status === 'Delivered' ? (
                              <Button variant="outline" size="sm">Download PDF</Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>Awaiting Processing</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't requested any catalogs yet.</p>
                  <Link to="/catalog-request">
                    <Button>Request Your First Catalog</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1a365d]">My Inquiries</h2>
                <Button>New Inquiry</Button>
              </div>
              
              {inquiries.length > 0 ? (
                <div className="space-y-6">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="shadow-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-medium">{inquiry.subject}</CardTitle>
                            <p className="text-sm text-gray-500">Submitted on {inquiry.date}</p>
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
                        <div className="mt-4">
                          <Button variant="outline" size="sm">View Full Conversation</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't submitted any inquiries yet.</p>
                  <Button>Submit Your First Inquiry</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
