
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp,
  FileText,
  MessageSquare,
  ShoppingCart,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  User,
  Factory
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

interface ManufacturerPartnership {
  id: string;
  company_name: string;
  status: string;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [partnershipRequest, setPartnershipRequest] = useState<ManufacturerPartnership | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at, admin_response')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) {
        console.error('Error fetching quote requests:', quotesError);
        toast.error('Failed to load quote requests');
      } else {
        setQuoteRequests(quotes || []);
      }

      // Fetch manufacturer partnership request if user email matches
      if (user.email) {
        const { data: partnership, error: partnershipError } = await supabase
          .from('manufacturer_partnerships')
          .select('id, company_name, status, created_at')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!partnershipError && partnership) {
          setPartnershipRequest(partnership);
        }
      }

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
    const quoteChannel = supabase
      .channel('user_dashboard_quotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Quote request updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as QuoteRequest;
            toast.success(`Quote request "${newRecord.product_name}" status updated to: ${newRecord.status}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    const partnershipChannel = supabase
      .channel('user_dashboard_partnerships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships',
          filter: `email=eq.${user?.email}`
        },
        (payload) => {
          console.log('Partnership updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as any;
            toast.success(`Partnership application status updated to: ${newRecord.status}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(partnershipChannel);
    };
  }, [user?.id, user?.email]);

  const statCards = [
    {
      title: 'Total Quote Requests',
      value: quoteRequests.length.toString(),
      change: `${quoteRequests.filter(q => q.status === 'pending').length} pending`,
      icon: <FileText className="h-8 w-8 text-brand-blue" />,
      color: 'blue'
    },
    {
      title: 'Approved Quotes',
      value: quoteRequests.filter(q => q.status === 'approved').length.toString(),
      change: 'Ready for processing',
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: 'green'
    },
    {
      title: 'In Progress',
      value: quoteRequests.filter(q => q.status === 'contacted').length.toString(),
      change: 'Being processed',
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      color: 'orange'
    },
    {
      title: 'Completed Orders',
      value: quoteRequests.filter(q => q.status === 'completed').length.toString(),
      change: 'Successfully completed',
      icon: <Package className="h-8 w-8 text-purple-500" />,
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
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">
              {profile?.full_name || user?.email?.split('@')[0]}, here's your dashboard overview
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quote Requests */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Quote Requests
                <Badge variant="secondary" className="ml-auto">
                  Live Updates
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {quoteRequests.length > 0 ? (
                  quoteRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{request.product_name}</p>
                          <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                          {request.admin_response && (
                            <p className="text-sm text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                              Response: {request.admin_response}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(request.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No quote requests yet</p>
                    <p className="text-sm">Start by browsing our products</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/request-quote">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    New Quote Request
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Partnership Status */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Partnership Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {partnershipRequest ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{partnershipRequest.company_name}</p>
                      <p className="text-sm text-gray-500">Application submitted</p>
                    </div>
                    <div className="text-right ml-4">
                      <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(partnershipRequest.status)}`}>
                        {partnershipRequest.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(partnershipRequest.created_at)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Factory className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No partnership application</p>
                  <p className="text-sm mb-4">Become a manufacturing partner</p>
                  <Link to="/">
                    <Button variant="outline">
                      Apply for Partnership
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/request-quote" className="block">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Request Quote
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Get pricing for products</p>
                  <span className="text-sm text-brand-blue hover:underline">
                    Start Request →
                  </span>
                </div>
              </Link>
              
              <Link to="/products" className="block">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    Browse Products
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Explore our catalog</p>
                  <span className="text-sm text-brand-blue hover:underline">
                    View Products →
                  </span>
                </div>
              </Link>
              
              <Link to="/catalog-request" className="block">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-600" />
                    Request Catalog
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Get detailed catalogs</p>
                  <span className="text-sm text-brand-blue hover:underline">
                    Request Catalog →
                  </span>
                </div>
              </Link>
              
              <Link to="/auth/update-profile-client" className="block">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-600" />
                    Update Profile
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Manage your information</p>
                  <span className="text-sm text-brand-blue hover:underline">
                    Edit Profile →
                  </span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
