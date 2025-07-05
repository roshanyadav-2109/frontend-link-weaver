
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Mail, Phone, Building, Calendar, Package } from 'lucide-react';

interface CatalogRequest {
  id: string;
  user_id?: string;
  product_category: string;
  company_name?: string;
  contact_person: string;
  email: string;
  phone: string;
  requirements?: string;
  quantity_range?: string;
  budget_range?: string;
  timeline?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const CatalogRequests: React.FC = () => {
  const [requests, setRequests] = useState<CatalogRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CatalogRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load catalog requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up real-time subscription
    const channel = supabase
      .channel('catalog_requests_admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'catalog_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleViewRequest = (request: CatalogRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('catalog_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status updated successfully');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-800">Catalog Requests</h1>
        <div className="text-sm text-gray-500">
          Total: {requests.length} requests
        </div>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No catalog requests found.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-600" />
                      {request.product_category}
                    </CardTitle>
                    <p className="text-sm text-gray-600">Contact: {request.contact_person}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {request.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {request.phone}
                      </span>
                      {request.company_name && (
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {request.company_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={request.status} 
                      onValueChange={(value) => handleStatusUpdate(request.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(request.created_at)}
                    </span>
                    {request.quantity_range && (
                      <span className="text-sm text-gray-500">
                        Qty: {request.quantity_range}
                      </span>
                    )}
                    {request.timeline && (
                      <span className="text-sm text-gray-500">
                        Timeline: {request.timeline}
                      </span>
                    )}
                  </div>
                </div>
                {request.requirements && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {request.requirements}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Catalog Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Contact Person:</strong> {selectedRequest.contact_person}</p>
                    <p><strong>Email:</strong> {selectedRequest.email}</p>
                    <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                    {selectedRequest.company_name && (
                      <p><strong>Company:</strong> {selectedRequest.company_name}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Product Category:</strong> {selectedRequest.product_category}</p>
                    <p><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </Badge>
                    </p>
                    <p><strong>Submitted:</strong> {formatDate(selectedRequest.created_at)}</p>
                    <p><strong>Last Updated:</strong> {formatDate(selectedRequest.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedRequest.quantity_range && (
                  <div>
                    <h4 className="font-medium text-sm">Quantity Range</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.quantity_range}</p>
                  </div>
                )}
                {selectedRequest.budget_range && (
                  <div>
                    <h4 className="font-medium text-sm">Budget Range</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.budget_range}</p>
                  </div>
                )}
                {selectedRequest.timeline && (
                  <div>
                    <h4 className="font-medium text-sm">Timeline</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.timeline}</p>
                  </div>
                )}
              </div>

              {selectedRequest.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    {selectedRequest.requirements}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogRequests;
