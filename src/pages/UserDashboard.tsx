
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp,
  FileText,
  MessageSquare,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string; // Keep as string since database stores it as text
  status: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (quotesError) {
        console.error('Error fetching quote requests:', quotesError);
        toast.error('Failed to load quote requests');
      } else {
        setQuoteRequests(quotes || []);
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

    // Set up real-time subscriptions for quote requests only
    const quoteChannel = supabase
      .channel('quote_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
    };
  }, [user?.id]);

  const statCards = [
    {
      title: 'Total Quote Requests',
      value: quoteRequests.length.toString(),
      change: `${quoteRequests.filter(q => q.status === 'pending').length} pending`,
      icon: <FileText className="h-8 w-8 text-brand-blue" />
    },
    {
      title: 'Active Orders',
      value: quoteRequests.filter(q => q.status === 'approved').length.toString(),
      change: 'Orders in progress',
      icon: <ShoppingCart className="h-8 w-8 text-orange-500" />
    },
    {
      title: 'Completed Orders',
      value: quoteRequests.filter(q => q.status === 'completed').length.toString(),
      change: 'Successfully completed',
      icon: <Package className="h-8 w-8 text-green-500" />
    },
    {
      title: 'Recent Activity',
      value: quoteRequests.length.toString(),
      change: 'Total requests',
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
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">
            {profile?.full_name || user?.email?.split('@')[0]}, here's your dashboard overview
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Account Type</p>
          <p className="font-semibold text-brand-blue capitalize">
            {profile?.user_type || 'Client'}
          </p>
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
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Quote Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quoteRequests.length > 0 ? (
                quoteRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-800">{request.product_name}</p>
                      <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
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
                  <p>No quote requests yet</p>
                  <p className="text-sm">Start by browsing our products</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-gray-800 mb-2">Request a Quote</h3>
                <p className="text-sm text-gray-600 mb-3">Get pricing for products you need</p>
                <a href="/request-quote" className="text-sm text-brand-blue hover:underline">
                  Start Quote Request →
                </a>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-gray-800 mb-2">Browse Categories</h3>
                <p className="text-sm text-gray-600 mb-3">Explore our product categories</p>
                <a href="/categories" className="text-sm text-brand-blue hover:underline">
                  View Categories →
                </a>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-gray-800 mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600 mb-3">Get help with your orders</p>
                <a href="/contact" className="text-sm text-brand-blue hover:underline">
                  Contact Us →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
