
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Users, Briefcase, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  admin_response?: string;
}

interface ManufacturerPartnership {
  id: string;
  company_name: string;
  representative_name: string;
  email: string;
  phone: string;
  product_category?: string;
  status: string;
  created_at: string;
  gstin: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  interested_department: string;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const ApplicationsManager: React.FC = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [partnerships, setPartnerships] = useState<ManufacturerPartnership[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);

      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;
      setQuoteRequests(quotes || []);

      // Fetch manufacturer partnerships
      const { data: partnerships, error: partnershipsError } = await supabase
        .from('manufacturer_partnerships')
        .select('*')
        .order('created_at', { ascending: false });

      if (partnershipsError) throw partnershipsError;
      setPartnerships(partnerships || []);

      // Fetch job applications
      const { data: jobs, error: jobsError } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobApplications(jobs || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (id: string, status: string, response?: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('quote_requests')
        .update({ 
          status, 
          admin_response: response || null 
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Quote request status updated');
      fetchAllApplications();
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('manufacturer_partnerships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Partnership application status updated');
      fetchAllApplications();
    } catch (error) {
      console.error('Error updating partnership status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const updateJobApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('job_applications')
        .update({ 
          status, 
          admin_notes: notes || null 
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Job application status updated');
      fetchAllApplications();
    } catch (error) {
      console.error('Error updating job application status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'shortlisted':
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'contacted':
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Applications Manager</h1>
        <p className="text-gray-600">Manage quote requests, partnerships, and job applications</p>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quote Requests ({quoteRequests.length})
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Partnerships ({partnerships.length})
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Applications ({jobApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          {quoteRequests.map((request) => (
            <Card key={request.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{request.product_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {request.name} - {request.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {request.quantity} | {formatDate(request.created_at)}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select
                      value={request.status}
                      onValueChange={(value) => updateQuoteStatus(request.id, value, request.admin_response)}
                      disabled={updatingId === request.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Response</label>
                    <Textarea
                      placeholder="Add response for the client..."
                      value={request.admin_response || ''}
                      onChange={(e) => {
                        const updatedRequests = quoteRequests.map(q => 
                          q.id === request.id ? { ...q, admin_response: e.target.value } : q
                        );
                        setQuoteRequests(updatedRequests);
                      }}
                      onBlur={() => updateQuoteStatus(request.id, request.status, request.admin_response)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          {partnerships.map((partnership) => (
            <Card key={partnership.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{partnership.company_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {partnership.representative_name} - {partnership.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      GSTIN: {partnership.gstin} | {formatDate(partnership.created_at)}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(partnership.status)}`}>
                    {partnership.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select
                      value={partnership.status}
                      onValueChange={(value) => updatePartnershipStatus(partnership.id, value)}
                      disabled={updatingId === partnership.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Product Category:</strong> {partnership.product_category || 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {jobApplications.map((application) => (
            <Card key={application.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{application.applicant_name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {application.email} - {application.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      Department: {application.interested_department} | {formatDate(application.created_at)}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(application.status)}`}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select
                      value={application.status}
                      onValueChange={(value) => updateJobApplicationStatus(application.id, value, application.admin_notes)}
                      disabled={updatingId === application.id}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Notes</label>
                    <Textarea
                      placeholder="Add notes for this application..."
                      value={application.admin_notes || ''}
                      onChange={(e) => {
                        const updatedApplications = jobApplications.map(a => 
                          a.id === application.id ? { ...a, admin_notes: e.target.value } : a
                        );
                        setJobApplications(updatedApplications);
                      }}
                      onBlur={() => updateJobApplicationStatus(application.id, application.status, application.admin_notes)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationsManager;
