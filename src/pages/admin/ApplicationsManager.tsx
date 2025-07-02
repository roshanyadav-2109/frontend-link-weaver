
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Building, 
  Briefcase, 
  Eye, 
  Edit,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Package,
  User,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  product_name: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  quantity: string;
  unit: string;
  status: string;
  created_at: string;
  admin_response?: string;
  additional_details?: string;
  user_id: string;
}

interface ManufacturerPartnership {
  id: string;
  company_name: string;
  representative_name: string;
  email: string;
  phone: string;
  product_category: string;
  status: string;
  created_at: string;
  gstin: string;
  city: string;
  state: string;
  annual_turnover: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  interested_department: string;
  experience: string;
  current_position: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  user_id: string;
}

const ApplicationsManager = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [partnerships, setPartnerships] = useState<ManufacturerPartnership[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'quote' | 'partnership' | 'job'>('quote');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [responseText, setResponseText] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [quotesResponse, partnershipsResponse, jobsResponse] = await Promise.all([
        supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('manufacturer_partnerships')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (quotesResponse.error) throw quotesResponse.error;
      if (partnershipsResponse.error) throw partnershipsResponse.error;
      if (jobsResponse.error) throw jobsResponse.error;

      setQuoteRequests(quotesResponse.data || []);
      setPartnerships(partnershipsResponse.data || []);
      setJobApplications(jobsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const quoteChannel = supabase
      .channel('admin-quotes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchData)
      .subscribe();

    const partnershipChannel = supabase
      .channel('admin-partnerships')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'manufacturer_partnerships' }, fetchData)
      .subscribe();

    const jobChannel = supabase
      .channel('admin-jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(partnershipChannel);
      supabase.removeChannel(jobChannel);
    };
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedItem || !statusUpdate) return;

    try {
      let updateData: any = { status: statusUpdate };
      
      if (dialogType === 'quote') {
        if (responseText) updateData.admin_response = responseText;
        
        const { error } = await supabase
          .from('quote_requests')
          .update(updateData)
          .eq('id', selectedItem.id);
          
        if (error) throw error;
      } else if (dialogType === 'partnership') {
        const { error } = await supabase
          .from('manufacturer_partnerships')
          .update(updateData)
          .eq('id', selectedItem.id);
          
        if (error) throw error;
      } else if (dialogType === 'job') {
        if (responseText) updateData.admin_notes = responseText;
        
        const { error } = await supabase
          .from('job_applications')
          .update(updateData)
          .eq('id', selectedItem.id);
          
        if (error) throw error;
      }

      toast.success('Status updated successfully');
      setIsDialogOpen(false);
      setSelectedItem(null);
      setStatusUpdate('');
      setResponseText('');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const openDialog = (item: any, type: 'quote' | 'partnership' | 'job') => {
    setSelectedItem(item);
    setDialogType(type);
    setStatusUpdate(item.status);
    setResponseText(type === 'quote' ? item.admin_response || '' : item.admin_notes || '');
    setIsDialogOpen(true);
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
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <Package className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications Manager</h1>
          <p className="text-gray-600 mt-1">Manage all quotes, partnerships, and job applications</p>
        </div>
      </div>

      <Tabs defaultValue="quotes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quote Requests ({quoteRequests.length})
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Partnerships ({partnerships.length})
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Applications ({jobApplications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4">
          {quoteRequests.map((quote) => (
            <Card key={quote.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{quote.product_name}</h3>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                        {getStatusIcon(quote.status)}
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{quote.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{quote.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{quote.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{quote.company || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{quote.quantity} {quote.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(quote.created_at)}</span>
                      </div>
                    </div>
                    {quote.admin_response && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800"><strong>Response:</strong> {quote.admin_response}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(quote, 'quote')}
                    className="ml-4"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="partnerships" className="space-y-4">
          {partnerships.map((partnership) => (
            <Card key={partnership.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{partnership.company_name}</h3>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(partnership.status)}`}>
                        {getStatusIcon(partnership.status)}
                        {partnership.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{partnership.representative_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{partnership.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{partnership.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{partnership.city}, {partnership.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span>{partnership.product_category || 'General'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(partnership.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(partnership, 'partnership')}
                    className="ml-4"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          {jobApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{application.interested_department}</h3>
                      <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{application.applicant_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <span>{application.current_position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{application.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(application.created_at)}</span>
                      </div>
                    </div>
                    {application.admin_notes && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800"><strong>Notes:</strong> {application.admin_notes}</p>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(application, 'job')}
                    className="ml-4"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  {dialogType === 'job' && (
                    <>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {dialogType === 'quote' ? 'Admin Response' : dialogType === 'job' ? 'Admin Notes' : 'Notes'}
              </label>
              <Textarea
                placeholder={`Add your ${dialogType === 'quote' ? 'response' : 'notes'}...`}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsManager;
