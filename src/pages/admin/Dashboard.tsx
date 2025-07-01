
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingCart, 
  FileText, 
  TrendingUp, 
  Package, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  pendingQuotes: number;
  totalQuotes: number;
  manufacturerPartnerships: number;
  pendingPartnerships: number;
}

interface RecentQuote {
  id: string;
  product_name: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
}

interface RecentPartnership {
  id: string;
  company_name: string;
  representative_name: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    pendingQuotes: 0,
    totalQuotes: 0,
    manufacturerPartnerships: 0,
    pendingPartnerships: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [recentPartnerships, setRecentPartnerships] = useState<RecentPartnership[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard statistics
      const [
        { count: totalUsers },
        { count: totalProducts },
        { count: totalQuotes },
        { count: pendingQuotes },
        { count: manufacturerPartnerships },
        { count: pendingPartnerships },
        { data: quotes },
        { data: partnerships }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('manufacturer_partnerships').select('*', { count: 'exact', head: true }),
        supabase.from('manufacturer_partnerships').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase
          .from('quote_requests')
          .select('id, product_name, name, company, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('manufacturer_partnerships')
          .select('id, company_name, representative_name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        pendingQuotes: pendingQuotes || 0,
        totalQuotes: totalQuotes || 0,
        manufacturerPartnerships: manufacturerPartnerships || 0,
        pendingPartnerships: pendingPartnerships || 0,
      });

      setRecentQuotes(quotes || []);
      setRecentPartnerships(partnerships || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions for live updates
    const quotesChannel = supabase
      .channel('admin-quotes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          console.log('Real-time quote update:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'INSERT') {
            toast.info('New quote request received!', {
              description: `From: ${payload.new.name}`,
              action: {
                label: 'View',
                onClick: () => window.open('/admin/quote-requests', '_blank')
              }
            });
          }
        }
      )
      .subscribe();

    const partnershipsChannel = supabase
      .channel('admin-partnerships-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships'
        },
        (payload) => {
          console.log('Real-time partnership update:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'INSERT') {
            toast.info('New manufacturer partnership request!', {
              description: `From: ${payload.new.company_name}`,
              action: {
                label: 'View',
                onClick: () => window.open('/admin/manufacturer-partnerships', '_blank')
              }
            });
          }
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('admin-products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Real-time product update:', payload);
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(partnershipsChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your business performance and manage operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">Real-time updates enabled</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Quotes</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingQuotes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manufacturers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.manufacturerPartnerships}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-brand-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending Partners</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingPartnerships}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Quote Requests</span>
              <Link to="/admin/quote-requests">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuotes.length > 0 ? (
              <div className="space-y-3">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{quote.product_name}</p>
                      <p className="text-xs text-gray-600">{quote.name} - {quote.company}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(quote.status)}
                      <Badge className={`text-xs ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No quote requests yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Partnership Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Partnership Requests</span>
              <Link to="/admin/manufacturer-partnerships">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPartnerships.length > 0 ? (
              <div className="space-y-3">
                {recentPartnerships.map((partnership) => (
                  <div key={partnership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{partnership.company_name}</p>
                      <p className="text-xs text-gray-600">{partnership.representative_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(partnership.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(partnership.status)}
                      <Badge className={`text-xs ${getStatusColor(partnership.status)}`}>
                        {partnership.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No partnership requests yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center">
                <Package className="h-6 w-6 mb-2" />
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/quote-requests">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center">
                <ShoppingCart className="h-6 w-6 mb-2" />
                Quote Requests
              </Button>
            </Link>
            <Link to="/admin/manufacturer-partnerships">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center">
                <TrendingUp className="h-6 w-6 mb-2" />
                Partnerships
              </Button>
            </Link>
            <Link to="/admin/careers">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center">
                <FileText className="h-6 w-6 mb-2" />
                Career Posts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
