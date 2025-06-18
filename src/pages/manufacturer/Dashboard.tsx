
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp,
  FileText,
  MessageSquare,
  ShoppingCart,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  created_at: string;
}

interface CatalogRequest {
  id: string;
  client_name: string;
  company_name: string;
  category: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [catalogRequests, setCatalogRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, category, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (productsError) {
        console.error('Error fetching products:', productsError);
        toast.error('Failed to load products');
      } else {
        setProducts(productsData || []);
      }

      // Fetch catalog requests
      const { data: catalogsData, error: catalogsError } = await supabase
        .from('catalog_requests')
        .select('id, client_name, company_name, category, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (catalogsError) {
        console.error('Error fetching catalog requests:', catalogsError);
        toast.error('Failed to load catalog requests');
      } else {
        setCatalogRequests(catalogsData || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const productsChannel = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const catalogChannel = supabase
      .channel('catalog_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'catalog_requests'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(catalogChannel);
    };
  }, [user?.id]);

  const statCards = [
    {
      title: 'Products',
      value: products.length.toString(),
      change: `${products.filter(p => p.status === 'active').length} active`,
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
      value: catalogRequests.length.toString(),
      change: `${catalogRequests.filter(c => c.status === 'pending').length} new requests`,
      icon: <FileText className="h-8 w-8 text-orange-500" />
    },
    {
      title: 'Customer Inquiries',
      value: catalogRequests.filter(c => c.status === 'pending').length.toString(),
      change: `${catalogRequests.filter(c => c.status === 'pending').length} unread messages`,
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'viewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manufacturer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email?.split('@')[0]}</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">GSTIN</p>
          <p className="font-semibold text-gray-800">{profile?.gstin || 'Not provided'}</p>
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
              {catalogRequests.length > 0 ? (
                catalogRequests.slice(0, 4).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{request.company_name || request.client_name}</p>
                      <p className="text-sm text-gray-500">{request.category}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(request.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No catalog requests yet</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/manufacturer/catalog-requests" className="text-sm text-brand-blue hover:underline">View all catalog requests →</a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(product.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No products yet</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <a href="/admin/products" className="text-sm text-brand-blue hover:underline">Manage all products →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
