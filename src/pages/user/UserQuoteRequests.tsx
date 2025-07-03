
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileText, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
  company?: string;
  additional_details?: string;
}

const UserQuoteRequests: React.FC = () => {
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuoteRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuoteRequests(data || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast.error('Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteRequests();
  }, [user?.id]);

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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Quote Requests</h1>
          <p className="text-gray-600 mt-2">Track all your product quote requests</p>
        </div>

        <div className="grid gap-6">
          {quoteRequests.length > 0 ? (
            quoteRequests.map((request, index) => (
              <AnimatedCard key={request.id} delay={index * 0.1} className="bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.product_name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {request.quantity}
                      </p>
                      {request.company && (
                        <p className="text-sm text-gray-500">Company: {request.company}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={`flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {request.additional_details && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Details:</h4>
                      <p className="text-sm text-gray-600">{request.additional_details}</p>
                    </div>
                  )}
                  {request.admin_response && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-1">Admin Response:</h4>
                      <p className="text-sm text-blue-700">{request.admin_response}</p>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard className="bg-white text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quote Requests</h3>
                <p className="text-gray-500 mb-6">You haven't submitted any quote requests yet.</p>
                <Link to="/request-quote">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Request Your First Quote
                  </Button>
                </Link>
              </CardContent>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQuoteRequests;
