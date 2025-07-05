
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Package, MessageSquare, Calendar, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalQuoteRequests: number;
  pendingQuoteRequests: number;
  totalJobApplications: number;
  pendingJobApplications: number;
  totalCatalogRequests: number;
  pendingCatalogRequests: number;
  totalManufacturerPartnerships: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuoteRequests: 0,
    pendingQuoteRequests: 0,
    totalJobApplications: 0,
    pendingJobApplications: 0,
    totalCatalogRequests: 0,
    pendingCatalogRequests: 0,
    totalManufacturerPartnerships: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const channels = [
      supabase
        .channel('quote_requests_admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, () => {
          fetchDashboardData();
        })
        .subscribe(),
      
      supabase
        .channel('job_applications_admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, () => {
          fetchDashboardData();
        })
        .subscribe(),
      
      supabase
        .channel('catalog_requests_admin')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'catalog_requests' }, () => {
          fetchDashboardData();
        })
        .subscribe(),
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch quote requests stats
      const { data: allQuotes, error: quoteError } = await supabase
        .from('quote_requests')
        .select('id, status, product_name, created_at');
      
      if (quoteError) throw quoteError;
      
      const totalQuoteRequests = allQuotes?.length || 0;
      const pendingQuoteRequests = allQuotes?.filter(q => q.status === 'pending').length || 0;

      // Fetch job applications stats
      const { data: allJobs, error: jobError } = await supabase
        .from('job_applications')
        .select('id, status, interested_department, created_at');
      
      if (jobError) throw jobError;
      
      const totalJobApplications = allJobs?.length || 0;
      const pendingJobApplications = allJobs?.filter(j => j.status === 'pending').length || 0;

      // Fetch catalog requests stats
      const { data: allCatalogs, error: catalogError } = await supabase
        .from('catalog_requests')
        .select('id, status, product_category, created_at');
      
      if (catalogError) throw catalogError;
      
      const totalCatalogRequests = allCatalogs?.length || 0;
      const pendingCatalogRequests = allCatalogs?.filter(c => c.status === 'pending').length || 0;

      // Fetch manufacturer partnerships stats
      const { data: allPartnerships, error: partnershipError } = await supabase
        .from('manufacturer_partnerships')
        .select('id, status, created_at');
      
      if (partnershipError) throw partnershipError;
      
      const totalManufacturerPartnerships = allPartnerships?.length || 0;

      setStats({
        totalQuoteRequests,
        pendingQuoteRequests,
        totalJobApplications,
        pendingJobApplications,
        totalCatalogRequests,
        pendingCatalogRequests,
        totalManufacturerPartnerships,
      });

      // Prepare recent activity
      const activities: RecentActivity[] = [];
      
      if (allQuotes) {
        allQuotes.slice(0, 3).forEach(quote => {
          activities.push({
            id: quote.id,
            type: 'quote',
            title: `Quote request for ${quote.product_name}`,
            status: quote.status,
            created_at: quote.created_at,
          });
        });
      }
      
      if (allJobs) {
        allJobs.slice(0, 3).forEach(job => {
          activities.push({
            id: job.id,
            type: 'job',
            title: `Job application for ${job.interested_department}`,
            status: job.status,
            created_at: job.created_at,
          });
        });
      }
      
      if (allCatalogs) {
        allCatalogs.slice(0, 2).forEach(catalog => {
          activities.push({
            id: catalog.id,
            type: 'catalog',
            title: `Catalog request for ${catalog.product_category}`,
            status: catalog.status,
            created_at: catalog.created_at,
          });
        });
      }

      // Sort by creation date and take most recent
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivity(activities.slice(0, 8));

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
      case 'new':
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of all business activities</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuoteRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingQuoteRequests} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingJobApplications} pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalog Requests</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCatalogRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCatalogRequests} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partnerships</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalManufacturerPartnerships}</div>
            <p className="text-xs text-muted-foreground">Total requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/quote-requests">
              <Button variant="outline" className="w-full">
                View All Quotes
              </Button>
            </Link>
            <Link to="/admin/job-applications">
              <Button variant="outline" className="w-full">
                View Applications
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="w-full">
                Manage Products
              </Button>
            </Link>
            <Link to="/admin/careers">
              <Button variant="outline" className="w-full">
                Manage Careers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'quote' && <FileText className="h-4 w-4 text-blue-500" />}
                    {activity.type === 'job' && <Users className="h-4 w-4 text-green-500" />}
                    {activity.type === 'catalog' && <Package className="h-4 w-4 text-purple-500" />}
                    <div>
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-xs text-gray-400">{formatDate(activity.created_at)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
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

export default AdminDashboard;
