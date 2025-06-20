
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Briefcase, 
  MessageSquare,
  TrendingUp,
  Users,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  activeJobs: number;
  pendingQuotes: number;
  totalQuotes: number;
  approvedQuotes: number;
  completedQuotes: number;
}

interface QuoteRequest {
  id: string;
  product_name: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeJobs: 0,
    pendingQuotes: 0,
    totalQuotes: 0,
    approvedQuotes: 0,
    completedQuotes: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

      // Calculate quote statistics
      const pendingQuotes = quotesData?.filter(quote => quote.status === 'pending').length || 0;
      const approvedQuotes = quotesData?.filter(quote => quote.status === 'approved').length || 0;
      const completedQuotes = quotesData?.filter(quote => quote.status === 'completed').length || 0;

      // Get recent quotes for display
      const recentQuotesData = quotesData?.slice(0, 8) || [];

      setStats({
        totalProducts: productsCount || 0,
        activeJobs: careersCount || 0,
        pendingQuotes,
        totalQuotes: quotesCount || 0,
        approvedQuotes,
        completedQuotes
      });

      setRecentQuotes(recentQuotesData);
      setLastUpdated(new Date());

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
      .channel('admin_dashboard_quotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          console.log('Quote request updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as QuoteRequest;
            toast.success(`New quote request received from: ${newRecord.name}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('admin_dashboard_products')
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
      .channel('admin_dashboard_careers')
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
      link: '/admin/products',
      color: 'blue'
    },
    {
      title: 'Pending Quotes',
      value: stats.pendingQuotes.toString(),
      change: 'Awaiting response',
      icon: <AlertCircle className="h-8 w-8 text-orange-500" />,
      link: '/admin/quote-requests',
      color: 'orange'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs.toString(),
      change: 'Open positions',
      icon: <Briefcase className="h-8 w-8 text-brand-teal" />,
      link: '/admin/careers',
      color: 'teal'
    },
    {
      title: 'Total Quotes',
      value: stats.totalQuotes.toString(),
      change: `${stats.completedQuotes} completed`,
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      link: '/admin/quote-requests',
      color: 'blue'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'contacted':
        return <MessageSquare className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <Package className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of system activity</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link}>
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
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
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Quote Requests
              <span className="ml-auto text-sm font-normal text-gray-500">
                Live Updates
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <div key={quote.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{quote.name}</span>
                          {quote.company && (
                            <span className="text-sm text-gray-500">({quote.company})</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{quote.product_name}</p>
                        {quote.admin_response && (
                          <p className="text-xs text-blue-600 mt-1 bg-blue-50 p-1 rounded">
                            Response: {quote.admin_response.substring(0, 50)}...
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-3">
                        <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                          {getStatusIcon(quote.status)}
                          {quote.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(quote.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No quote requests yet</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/admin/quote-requests">
                <Button className="w-full" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View all quote requests
                </Button>
              </Link>
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
            <div className="space-y-3">
              <Link to="/admin/products">
                <div className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-800">Manage Products</span>
                      <p className="text-sm text-gray-600">Add, edit, or remove products</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/quote-requests">
                <div className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-800">Review Quote Requests</span>
                      <p className="text-sm text-gray-600">Respond to customer inquiries</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/careers">
                <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-800">Manage Careers</span>
                      <p className="text-sm text-gray-600">Post and manage job listings</p>
                    </div>
                  </div>
                </div>
              </Link>
              
              <Link to="/admin/manufacturer-partnerships">
                <div className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-800">Manufacturer Partners</span>
                      <p className="text-sm text-gray-600">Manage partnership requests</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
