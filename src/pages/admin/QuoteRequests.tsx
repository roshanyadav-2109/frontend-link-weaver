
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

interface QuoteRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  product_name: string;
  quantity: string;
  unit: string;
  additional_details?: string;
  status: string;
  admin_response?: string;
  delivery_address?: string;
  delivery_country?: string;
  delivery_timeline?: string;
  payment_terms?: string;
  estimated_budget?: string;
}

const QuoteRequests = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    fetchRequests();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('quote-requests-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'quote_requests' }, 
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast.error('Failed to fetch quote requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: string, adminResponse?: string) => {
    try {
      setIsResponding(true);
      const updateData: any = { status };
      
      if (adminResponse) {
        updateData.admin_response = adminResponse;
      }

      const { error } = await supabase
        .from('quote_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Quote request updated successfully');
      setSelectedRequest(null);
      setResponse('');
      setNewStatus('');
      fetchRequests();
    } catch (error) {
      console.error('Error updating quote request:', error);
      toast.error('Failed to update quote request');
    } finally {
      setIsResponding(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quote Requests</h1>
        <div className="text-sm text-gray-600">
          Total: {requests.length} requests
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{request.name}</h3>
                  <p className="text-gray-600">{request.email} • {request.phone}</p>
                  {request.company && <p className="text-gray-500">{request.company}</p>}
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(request.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Quote Request Details</DialogTitle>
                      </DialogHeader>
                      
                      {selectedRequest && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Name</Label>
                              <p className="font-medium">{selectedRequest.name}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="font-medium">{selectedRequest.email}</p>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <p className="font-medium">{selectedRequest.phone}</p>
                            </div>
                            <div>
                              <Label>Company</Label>
                              <p className="font-medium">{selectedRequest.company || 'N/A'}</p>
                            </div>
                          </div>

                          <div>
                            <Label>Product</Label>
                            <p className="font-medium">{selectedRequest.product_name}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Quantity</Label>
                              <p className="font-medium">{selectedRequest.quantity} {selectedRequest.unit}</p>
                            </div>
                            {selectedRequest.estimated_budget && (
                              <div>
                                <Label>Budget</Label>
                                <p className="font-medium">{selectedRequest.estimated_budget}</p>
                              </div>
                            )}
                          </div>

                          {selectedRequest.additional_details && (
                            <div>
                              <Label>Additional Details</Label>
                              <p className="font-medium">{selectedRequest.additional_details}</p>
                            </div>
                          )}

                          {selectedRequest.delivery_address && (
                            <div>
                              <Label>Delivery Address</Label>
                              <p className="font-medium">{selectedRequest.delivery_address}</p>
                            </div>
                          )}

                          <div className="border-t pt-4">
                            <Label>Current Status</Label>
                            <div className="mb-4">{getStatusBadge(selectedRequest.status)}</div>

                            <div className="space-y-4">
                              <div>
                                <Label>Update Status</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select new status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Admin Response</Label>
                                <Textarea
                                  placeholder="Enter your response to the customer..."
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                  rows={4}
                                />
                              </div>

                              <Button
                                onClick={() => handleStatusUpdate(selectedRequest.id, newStatus, response)}
                                disabled={!newStatus || isResponding}
                                className="w-full"
                              >
                                {isResponding ? 'Updating...' : 'Update Request'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product:</span>
                  <span className="font-medium">{request.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <span className="font-medium">{request.quantity} {request.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {request.admin_response && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Admin Response</span>
                  </div>
                  <p className="text-sm text-blue-700">{request.admin_response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No quote requests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuoteRequests;
