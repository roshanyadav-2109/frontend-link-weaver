
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, FileText, Settings, TrendingUp, Clock, CheckCircle, XCircle, Building, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response: string | null;
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
  const [manufacturerPartnership, setManufacturerPartnership] = useState<ManufacturerPartnership | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    completedQuotes: 0,
    hasPartnership: false
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      setupRealTimeSubscriptions();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      
      setQuoteRequests(quotes || []);

      // Calculate stats
      const totalQuotes = quotes?.length || 0;
      const pendingQuotes = quotes?.filter(q => q.status === 'pending').length || 0;
      const completedQuotes = quotes?.filter(q => q.status === 'completed').length || 0;

      // Check for manufacturer partnership
      const { data: partnership, error: partnershipError } = await supabase
        .from('manufacturer_partnerships')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!partnershipError && partnership) {
        setManufacturerPartnership(partnership);
      }

      setStats({
        totalQuotes,
        pendingQuotes,
        completedQuotes,
        hasPartnership: !!partnership
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscriptions = () => {
    if (!user) return;

    // Quote requests subscription
    const quotesChannel = supabase
      .channel('user-quotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Quote request update:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as QuoteRequest;
            toast.success(`Quote request status updated to: ${newRecord.status}`);
          }
        }
      )
      .subscribe();

    // Manufacturer partnership subscription
    const partnershipChannel = supabase
      .channel('user-partnership')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships',
          filter: `email=eq.${user.email}`
        },
        (payload) => {
          console.log('Partnership update:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as ManufacturerPartnership;
            toast.success(`Partnership application status: ${newRecord.status}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(partnershipChannel);
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!</h1>
          <p className="text-gray-600 mt-2">Track your requests and manage your account</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <ShoppingCart className="h-5 w-5 mr-2 text-brand-blue" />
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuotes}</div>
              <p className="text-sm text-gray-600">Quote requests made</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
              <p className="text-sm text-gray-600">Awaiting response</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedQuotes}</div>
              <p className="text-sm text-gray-600">Successfully processed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Building className="h-5 w-5 mr-2 text-purple-500" />
                Partnership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hasPartnership ? '✓' : '✗'}</div>
              <p className="text-sm text-gray-600">
                {stats.hasPartnership ? 'Application submitted' : 'Not applied'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Quote Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Quote Requests
                  <Link to="/request-quote">
                    <Button size="sm" className="flex items-center">
                      <Plus className="h-4 w-4 mr-1" />
                      New Quote
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quoteRequests.length > 0 ? (
                    quoteRequests.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(quote.status)}
                          <div>
                            <p className="font-medium text-gray-900">{quote.product_name}</p>
                            <p className="text-sm text-gray-500">Quantity: {quote.quantity}</p>
                            <p className="text-xs text-gray-400">{format(new Date(quote.created_at), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </Badge>
                          {quote.admin_response && (
                            <p className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                              Response: {quote.admin_response}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No quote requests yet</p>
                      <Link to="/request-quote">
                        <Button className="mt-2" size="sm">
                          Make Your First Request
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Partnership Status */}
          <div className="space-y-6">
            {/* Partnership Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Manufacturer Partnership
                </CardTitle>
              </CardHeader>
              <CardContent>
                {manufacturerPartnership ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge className={`text-xs ${getStatusColor(manufacturerPartnership.status)}`}>
                        {manufacturerPartnership.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Company: {manufacturerPartnership.company_name}</p>
                      <p>Applied: {format(new Date(manufacturerPartnership.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Become a manufacturing partner and expand your business reach.
                    </p>
                    <Link to="/auth/manufacturer">
                      <Button size="sm" variant="outline">
                        Apply for Partnership
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/products" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Browse Products
                    </Button>
                  </Link>
                  <Link to="/catalog-request" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Request Catalog
                    </Button>
                  </Link>
                  <Link to="/auth/update-profile-client" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                  <Link to="/contact" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
