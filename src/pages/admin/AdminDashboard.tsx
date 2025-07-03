
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  FileText, 
  Briefcase, 
  Package, 
  Handshake, 
  Eye, 
  Edit, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';

interface RequestItem {
  id: string;
  type: 'quote' | 'job' | 'catalog' | 'partnership';
  title: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  details?: any;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminResponse, setAdminResponse] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      // Fetch quote requests
      const { data: quotes } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch job applications
      const { data: jobs } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch manufacturer partnerships
      const { data: partnerships } = await supabase
        .from('manufacturer_partnerships')
        .select('*')
        .order('created_at', { ascending: false });

      // Combine all requests
      const allRequests: RequestItem[] = [
        ...(quotes || []).map(q => ({
          id: q.id,
          type: 'quote' as const,
          title: q.product_name,
          name: q.name,
          email: q.email,
          status: q.status || 'pending',
          created_at: q.created_at,
          details: q
        })),
        ...(jobs || []).map(j => ({
          id: j.id,
          type: 'job' as const,
          title: j.interested_department,
          name: j.applicant_name,
          email: j.email,
          status: j.status,
          created_at: j.created_at,
          details: j
        })),
        ...(partnerships || []).map(p => ({
          id: p.id,
          type: 'partnership' as const,
          title: p.company_name,
          name: p.representative_name,
          email: p.email,
          status: p.status,
          created_at: p.created_at,
          details: p
        }))
      ];

      setRequests(allRequests.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ));
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();

    // Set up real-time subscriptions
    const channels = [
      supabase
        .channel('admin-quote-requests')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, fetchAllRequests)
        .subscribe(),
      
      supabase
        .channel('admin-job-applications')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications' }, fetchAllRequests)
        .subscribe(),
      
      supabase
        .channel('admin-partnerships')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'manufacturer_partnerships' }, fetchAllRequests)
        .subscribe()
    ];

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [isAdmin]);

  const handleStatusUpdate = async () => {
    if (!selectedRequest || !newStatus) return;

    try {
      let tableName = '';
      let updateData: any = { status: newStatus };

      switch (selectedRequest.type) {
        case 'quote':
          tableName = 'quote_requests';
          if (adminResponse.trim()) {
            updateData.admin_response = adminResponse;
          }
          break;
        case 'job':
          tableName = 'job_applications';
          if (adminResponse.trim()) {
            updateData.admin_notes = adminResponse;
          }
          break;
        case 'partnership':
          tableName = 'manufacturer_partnerships';
          break;
      }

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success('Status updated successfully');
      setIsStatusUpdateOpen(false);
      setNewStatus('');
      setAdminResponse('');
      fetchAllRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'hired': case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'contacted': case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'quote': return <FileText className="h-4 w-4" />;
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'catalog': return <Package className="h-4 w-4" />;
      case 'partnership': return <Handshake className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (!isAdmin) {
    return <div className="p-8 text-center">Access denied. Admin privileges required.</div>;
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => ['approved', 'hired', 'accepted'].includes(r.status)).length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchAllRequests} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getRequestIcon(request.type)}
                    <div>
                      <h3 className="font-medium">{request.title}</h3>
                      <p className="text-sm text-gray-500">{request.name} • {request.email}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setNewStatus(request.status);
                        setAdminResponse('');
                        setIsStatusUpdateOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <p className="capitalize">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Details</Label>
                <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedRequest.details, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  {selectedRequest?.type === 'job' && (
                    <>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Admin Response/Notes</Label>
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Add response or notes..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsStatusUpdateOpen(false)}>
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

export default AdminDashboard;
