
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
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuoteRequestForm from '@/components/QuoteRequestForm';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  interested_department: string;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at, admin_response')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Error fetching quote requests:', quotesError);
      } else {
        setQuoteRequests(quotes || []);
      }

      // Fetch job applications
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('id, applicant_name, interested_department, status, created_at, admin_notes')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
      } else {
        setJobApplications(applications || []);
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

    const applicationChannel = supabase
      .channel('user_dashboard_applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Job application updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as JobApplication;
            toast.success(`Your application for ${newRecord.interested_department} status updated to: ${newRecord.status.replace('_', ' ')}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(applicationChannel);
    };
  }, [user?.id]);

  const statCards = [
    {
      title: 'Total Quote Requests',
      value: quoteRequests.length.toString(),
      change: `${quoteRequests.filter(q => q.status === 'pending').length} pending`,
      icon: <FileText className="h-8 w-8 text-brand-blue" />,
      color: 'blue'
    },
    {
      title: 'Job Applications',
      value: jobApplications.length.toString(),
      change: `${jobApplications.filter(a => a.status === 'pending').length} pending`,
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      color: 'green'
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
      case 'shortlisted':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted':
      case 'under_review':
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
      case 'shortlisted':
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'contacted':
      case 'under_review':
        return <MessageSquare className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <Package className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const displayedQuotes = showAllQuotes ? quoteRequests : quoteRequests.slice(0, 5);
  const displayedApplications = showAllApplications ? jobApplications : jobApplications.slice(0, 5);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Quote Requests
                <span className="ml-auto text-sm font-normal text-gray-500">
                  Live Updates
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {displayedQuotes.length > 0 ? (
                  displayedQuotes.map((request) => (
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
                          <Badge className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
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
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Button onClick={() => setShowQuoteForm(true)} className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Custom Quote Request
                </Button>
                {quoteRequests.length > 5 && (
                  <Button variant="outline" onClick={() => setShowAllQuotes(!showAllQuotes)}>
                    {showAllQuotes ? 'Show Less' : 'View All'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Applications
                <span className="ml-auto text-sm font-normal text-gray-500">
                  Live Updates
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {displayedApplications.length > 0 ? (
                  displayedApplications.map((application) => (
                    <div key={application.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{application.interested_department}</p>
                          <p className="text-sm text-gray-500">Applied: {formatDate(application.created_at)}</p>
                          {application.admin_notes && (
                            <p className="text-sm text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                              Notes: {application.admin_notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <Badge className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No job applications yet</p>
                    <p className="text-sm">Check our careers page for opportunities</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t flex gap-2">
                <Link to="/careers" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Careers
                  </Button>
                </Link>
                {jobApplications.length > 5 && (
                  <Button variant="outline" onClick={() => setShowAllApplications(!showAllApplications)}>
                    {showAllApplications ? 'Show Less' : 'View All'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div onClick={() => setShowQuoteForm(true)} className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-800 mb-1">Custom Quote Request</h3>
                  <p className="text-sm text-gray-600">Get pricing for any product</p>
                </div>
                
                <Link to="/products" className="block">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer text-center">
                    <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-1">Browse Products</h3>
                    <p className="text-sm text-gray-600">Explore our catalog</p>
                  </div>
                </Link>
                
                <Link to="/catalog-request" className="block">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer text-center">
                    <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-1">Request Catalog</h3>
                    <p className="text-sm text-gray-600">Get detailed catalogs</p>
                  </div>
                </Link>
                
                <Link to="/contact" className="block">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer text-center">
                    <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-1">Contact Support</h3>
                    <p className="text-sm text-gray-600">Get help with orders</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quote Request Dialog */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-brand-blue">
              Custom Quote Request
            </DialogTitle>
          </DialogHeader>
          <QuoteRequestForm 
            userId={user?.id}
            onSuccess={() => {
              setShowQuoteForm(false);
              fetchDashboardData();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
