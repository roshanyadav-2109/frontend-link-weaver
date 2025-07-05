
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { FileText, Package, MessageSquare, Calendar } from 'lucide-react';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
}

interface JobApplication {
  id: string;
  interested_department: string;
  status: string;
  created_at: string;
}

interface CatalogRequest {
  id: string;
  product_category: string;
  status: string;
  created_at: string;
}

const ClientDashboard: React.FC = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [catalogRequests, setCatalogRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch quote requests
      const { data: quotes, error: quoteError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (quoteError) throw quoteError;
      setQuoteRequests(quotes || []);

      // Fetch job applications
      const { data: jobs, error: jobError } = await supabase
        .from('job_applications')
        .select('id, interested_department, status, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (jobError) throw jobError;
      setJobApplications(jobs || []);

      // Fetch catalog requests
      const { data: catalogs, error: catalogError } = await supabase
        .from('catalog_requests')
        .select('id, product_category, status, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (catalogError) throw catalogError;
      setCatalogRequests(catalogs || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600">Here's an overview of your recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quoteRequests.length}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobApplications.length}</div>
            <p className="text-xs text-muted-foreground">Applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalog Requests</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{catalogRequests.length}</div>
            <p className="text-xs text-muted-foreground">Catalogs requested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quoteRequests.length + jobApplications.length + catalogRequests.length}
            </div>
            <p className="text-xs text-muted-foreground">All submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quote Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quote Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {quoteRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No quote requests yet</p>
          ) : (
            <div className="space-y-4">
              {quoteRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{request.product_name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                    <p className="text-xs text-gray-400">{formatDate(request.created_at)}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Job Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {jobApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No job applications yet</p>
          ) : (
            <div className="space-y-4">
              {jobApplications.map((application) => (
                <div key={application.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{application.interested_department}</h4>
                    <p className="text-xs text-gray-400">{formatDate(application.created_at)}</p>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Catalog Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Catalog Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {catalogRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No catalog requests yet</p>
          ) : (
            <div className="space-y-4">
              {catalogRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{request.product_category}</h4>
                    <p className="text-xs text-gray-400">{formatDate(request.created_at)}</p>
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
