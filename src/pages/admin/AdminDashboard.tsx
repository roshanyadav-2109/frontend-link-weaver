
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { toast } from "sonner";

interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  totalJobApplications: number;
  pendingJobApplications: number;
  totalCatalogRequests: number;
  pendingCatalogRequests: number;
  totalManufacturerPartnerships: number;
  pendingManufacturerPartnerships: number;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  product_name: string;
  status: string;
  created_at: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  email: string;
  interested_department: string;
  status: string;
  created_at: string;
}

interface CatalogRequest {
  id: string;
  name: string;
  email: string;
  product_category: string;
  status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    pendingQuotes: 0,
    totalJobApplications: 0,
    pendingJobApplications: 0,
    totalCatalogRequests: 0,
    pendingCatalogRequests: 0,
    totalManufacturerPartnerships: 0,
    pendingManufacturerPartnerships: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<QuoteRequest[]>([]);
  const [recentJobApplications, setRecentJobApplications] = useState<JobApplication[]>([]);
  const [recentCatalogRequests, setRecentCatalogRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [
        quoteStats,
        jobStats,
        catalogStats,
        manufacturerStats
      ] = await Promise.all([
        supabase.from('quote_requests').select('status', { count: 'exact' }),
        supabase.from('job_applications').select('status', { count: 'exact' }),
        supabase.from('catalog_requests').select('status', { count: 'exact' }),
        supabase.from('manufacturer_partnerships').select('status', { count: 'exact' })
      ]);

      const pendingQuotes = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      const pendingJobs = await supabase
        .from('job_applications')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      const pendingCatalogs = await supabase
        .from('catalog_requests')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      const pendingManufacturers = await supabase
        .from('manufacturer_partnerships')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      setStats({
        totalQuotes: quoteStats.count || 0,
        pendingQuotes: pendingQuotes.count || 0,
        totalJobApplications: jobStats.count || 0,
        pendingJobApplications: pendingJobs.count || 0,
        totalCatalogRequests: catalogStats.count || 0,
        pendingCatalogRequests: pendingCatalogs.count || 0,
        totalManufacturerPartnerships: manufacturerStats.count || 0,
        pendingManufacturerPartnerships: pendingManufacturers.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const fetchRecentData = async () => {
    try {
      const [quotesData, jobsData, catalogsData] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('id, name, email, product_name, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('job_applications')
          .select('id, applicant_name, email, interested_department, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('catalog_requests')
          .select('id, name, email, product_category, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      if (quotesData.data) setRecentQuotes(quotesData.data);
      if (jobsData.data) setRecentJobApplications(jobsData.data);
      if (catalogsData.data) setRecentCatalogRequests(catalogsData.data);
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRecentData()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Set up real-time sync for quote requests
  useRealtimeSync({
    table: 'quote_requests',
    onUpdate: () => {
      fetchStats();
      fetchRecentData();
    },
    onInsert: () => {
      fetchStats();
      fetchRecentData();
    }
  });

  // Set up real-time sync for job applications
  useRealtimeSync({
    table: 'job_applications',
    onUpdate: () => {
      fetchStats();
      fetchRecentData();
    },
    onInsert: () => {
      fetchStats();
      fetchRecentData();
    }
  });

  // Set up real-time sync for catalog requests
  useRealtimeSync({
    table: 'catalog_requests',
    onUpdate: () => {
      fetchStats();
      fetchRecentData();
    },
    onInsert: () => {
      fetchStats();
      fetchRecentData();
    }
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingQuotes} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingJobApplications} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalog Requests</CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalManufacturerPartnerships}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingManufacturerPartnerships} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="quotes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quotes">Recent Quote Requests</TabsTrigger>
          <TabsTrigger value="jobs">Recent Job Applications</TabsTrigger>
          <TabsTrigger value="catalogs">Recent Catalog Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quote Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{quote.name}</p>
                      <p className="text-sm text-gray-600">{quote.email}</p>
                      <p className="text-sm text-gray-600">{quote.product_name}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeColor(quote.status)}>
                        {quote.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Job Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobApplications.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{job.applicant_name}</p>
                      <p className="text-sm text-gray-600">{job.email}</p>
                      <p className="text-sm text-gray-600">{job.interested_department}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeColor(job.status)}>
                        {job.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalogs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Catalog Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCatalogRequests.map((catalog) => (
                  <div key={catalog.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{catalog.name}</p>
                      <p className="text-sm text-gray-600">{catalog.email}</p>
                      <p className="text-sm text-gray-600">{catalog.product_category}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadgeColor(catalog.status)}>
                        {catalog.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(catalog.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
