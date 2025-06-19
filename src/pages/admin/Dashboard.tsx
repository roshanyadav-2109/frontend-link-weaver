
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalProducts: number;
  activeJobs: number;
  pendingQuotes: number;
  totalQuotes: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeJobs: 0,
    pendingQuotes: 0,
    totalQuotes: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch careers count
      const { count: careersCount } = await supabase
        .from('careers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch quote requests
      const { data: quotesData, count: quotesCount } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Count pending quotes
      const pendingQuotes = quotesData?.filter(quote => quote.status === 'pending').length || 0;

      // Get recent quotes for display
      const recentQuotesData = quotesData?.slice(0, 5) || [];

      setStats({
        totalProducts: productsCount || 0,
        activeJobs: careersCount || 0,
        pendingQuotes,
        totalQuotes: quotesCount || 0
      });

      setRecentQuotes(recentQuotesData);

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
      .channel('dashboard_quotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('dashboard_products')
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

    const careersChannel = supabase
      .channel('dashboard_careers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'careers'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(careersChannel);
    };
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      change: 'Manage inventory',
      icon: <Package className="h-8 w-8 text-brand-blue" />,
      link: '/admin/products'
    },
    {
      title: 'Active Job Positions',
      value: stats.activeJobs.toString(),
      change: 'Open positions',
      icon: <Briefcase className="h-8 w-8 text-brand-teal" />,
      link: '/admin/careers'
    },
    {
      title: 'Pending Quote Requests',
      value: stats.pendingQuotes.toString(),
      change: 'Awaiting response',
      icon: <AlertCircle className="h-8 w-8 text-orange-500" />,
      link: '/admin/quote-requests'
    },
    {
      title: 'Total Quote Requests',
      value: stats.totalQuotes.toString(),
      change: 'All time requests',
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      link: '/admin/quote-requests'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
            <CardTitle>Recent Quote Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote, i) => (
                  <div key={quote.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{quote.name}</span>
                      <p className="text-sm text-gray-500">{quote.product_name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      quote.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No quote requests yet</p>
              )}
            </div>
            <div className="mt-4">
              <a href="/admin/quote-requests" className="text-sm text-brand-blue hover:underline">View all quote requests →</a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a 
                href="/admin/products" 
                className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium">Manage Products</span>
                </div>
              </a>
              <a 
                href="/admin/careers" 
                className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium">Manage Careers</span>
                </div>
              </a>
              <a 
                href="/admin/quote-requests" 
                className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                  <span className="font-medium">Review Quote Requests</span>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
