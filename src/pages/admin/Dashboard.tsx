
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
  Clock,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  totalPartnerships: number;
  pendingPartnerships: number;
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

interface PartnershipRequest {
  id: string;
  company_name: string;
  representative_name: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeJobs: 0,
    pendingQuotes: 0,
    totalQuotes: 0,
    approvedQuotes: 0,
    completedQuotes: 0,
    totalPartnerships: 0,
    pendingPartnerships: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [recentPartnerships, setRecentPartnerships] = useState<PartnershipRequest[]>([]);
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

      // Fetch partnership requests
      const { data: partnershipsData, count: partnershipsCount } = await supabase
        .from('manufacturer_partnerships')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Calculate statistics
      const pendingQuotes = quotesData?.filter(quote => quote.status === 'pending').length || 0;
      const approvedQuotes = quotesData?.filter(quote => quote.status === 'approved').length || 0;
      const completedQuotes = quotesData?.filter(quote => quote.status === 'completed').length || 0;
      const pendingPartnerships = partnershipsData?.filter(p => p.status === 'pending').length || 0;

      // Get recent data for display
      const recentQuotesData = quotesData?.slice(0, 8) || [];
      const recentPartnershipsData = partnershipsData?.slice(0, 5) || [];

      setStats({
        totalProducts: productsCount || 0,
        activeJobs: careersCount || 0,
        pendingQuotes,
        totalQuotes: quotesCount || 0,
        approvedQuotes,
        completedQuotes,
        totalPartnerships: partnershipsCount || 0,
        pendingPartnerships
      });

      setRecentQuotes(recentQuotesData);
      setRecentPartnerships(recentPartnershipsData);
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

    // Set up real-time subscriptions
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
            toast.success(`New quote request from: ${newRecord.name}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    const partnershipsChannel = supabase
      .channel('admin_dashboard_partnerships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships'
        },
        (payload) => {
          console.log('Partnership updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as any;
            toast.success(`New partnership application from: ${newRecord.company_name}`, {
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

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(partnershipsChannel);
      supabase.removeChannel(productsChannel);
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
      color: 'orange',
      urgent: stats.pendingQuotes > 0
    },
    {
      title: 'Partnership Requests',
      value: stats.pendingPartnerships.toString(),
      change: `${stats.totalPartnerships} total`,
      icon: <Users className="h-8 w-8 text-brand-teal" />,
      link: '/admin/manufacturer-partnerships',
      color: 'teal',
      urgent: stats.pendingPartnerships > 0
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs.toString(),
      change: 'Open positions',
      icon: <Briefcase className="h-8 w-8 text-purple-500" />,
      link: '/admin/careers',
      color: 'purple'
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
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
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
            <Card className={`shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500 ${card.urgent ? 'ring-2 ring-orange-200 bg-orange-50' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  {card.title}
                  {card.urgent && <Bell className="h-4 w-4 text-orange-500 animate-pulse" />}
                </CardTitle>
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
        {/* Recent Quote Requests */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Quote Requests
              <Badge variant="secondary" className="ml-auto">
                Live Updates
              </Badge>
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

        {/* Recent Partnership Requests */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Partnership Requests
              <Badge variant="secondary" className="ml-auto">
                Live Updates
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentPartnerships.length > 0 ? (
                recentPartnerships.map((partnership) => (
                  <div key={partnership.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{partnership.company_name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{partnership.representative_name}</p>
                      </div>
                      <div className="text-right ml-3">
                        <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(partnership.status)}`}>
                          {getStatusIcon(partnership.status)}
                          {partnership.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(partnership.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No partnership requests yet</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link to="/admin/manufacturer-partnerships">
                <Button className="w-full" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View all partnerships
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
