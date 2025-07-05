
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Package, FileText, User, Bell, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  unit: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuoteRequests();
    }
  }, [user]);

  const fetchQuoteRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching quote requests:', error);
        toast.error('Failed to load quote requests');
        return;
      }

      setQuoteRequests(data || []);
    } catch (error) {
      console.error('Error in fetchQuoteRequests:', error);
      toast.error('Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your quote requests and explore our product catalog
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quoteRequests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quoteRequests.filter(req => req.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quoteRequests.filter(req => req.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quote Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Quote Requests
            </CardTitle>
            <CardDescription>
              Your latest quote requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : quoteRequests.length > 0 ? (
              <div className="space-y-4">
                {quoteRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status as keyof typeof statusIcons];
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <StatusIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{request.product_name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {request.quantity} {request.unit}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests yet</h3>
                <p className="text-gray-600 mb-4">Start by requesting a quote for products you're interested in</p>
                <Button onClick={() => window.location.href = '/products'}>
                  Browse Products
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Explore our products and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => window.location.href = '/products'}
                className="flex items-center justify-center gap-2 h-12"
              >
                <Package className="h-4 w-4" />
                Browse Products
              </Button>
              <Button 
                onClick={() => window.location.href = '/request-quote'}
                variant="outline" 
                className="flex items-center justify-center gap-2 h-12"
              >
                <FileText className="h-4 w-4" />
                Request Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
