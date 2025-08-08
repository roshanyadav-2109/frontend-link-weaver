import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface QuoteRequest {
  id: string;
  created_at: string;
  product_name: string;
  quantity: string;
  unit: string;
  status: string;
  admin_response?: string;
}

interface JobApplication {
  id: string;
  created_at: string;
  applicant_name: string;
  email: string;
  phone: string;
  current_position: string;
  status: string;
  admin_notes?: string;
}

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();

    // Set up real-time subscriptions
    const quoteChannel = supabase
      .channel('user-quote-requests')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchQuoteRequests();
        }
      )
      .subscribe();

    const jobChannel = supabase
      .channel('user-job-applications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'job_applications',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchJobApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(jobChannel);
    };
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      await Promise.all([
        fetchQuoteRequests(),
        fetchJobApplications()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuoteRequests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuoteRequests(data || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
    }
  };

  const fetchJobApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Welcome, {profile?.full_name || 'User'}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quote-requests">Quote Requests</TabsTrigger>
              <TabsTrigger value="job-applications">Job Applications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4">
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
                    <p>Email: {user?.email}</p>
                    {profile?.company_name && <p>Company: {profile.company_name}</p>}
                    {profile?.phone && <p>Phone: {profile.phone}</p>}
                    <Link to="/auth/update-profile-client">
                      <Button variant="secondary" size="sm">Update Profile</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                    <Button onClick={() => setShowQuoteModal(true)}>Request a Quote</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="quote-requests">
              <h3 className="text-lg font-semibold mb-4">Your Quote Requests</h3>
              {quoteRequests.length > 0 ? (
                <div className="grid gap-4">
                  {quoteRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{request.product_name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(request.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No quote requests found.</p>
              )}
            </TabsContent>
            <TabsContent value="job-applications">
              <h3 className="text-lg font-semibold mb-4">Your Job Applications</h3>
              {jobApplications.length > 0 ? (
                <div className="grid gap-4">
                  {jobApplications.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{job.applicant_name}</h4>
                          <p className="text-sm text-gray-500">
                            Position: {job.current_position}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(job.status)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No job applications found.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
