
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ExternalLink, Trash } from 'lucide-react';

interface QuoteRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  product_id: string | null;
  product_name: string;
  quantity: string;
  unit: string;
  additional_details: string | null;
  status: 'pending' | 'contacted' | 'completed' | 'rejected';
  user_id: string;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const QuoteRequests: React.FC = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchQuoteRequests();
  }, [statusFilter]);

  const fetchQuoteRequests = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setQuoteRequests(data as QuoteRequest[]);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast.error('Failed to load quote requests.');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setQuoteRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === id ? { ...req, status: newStatus as any } : req
        )
      );
      
      toast.success('Status updated successfully.');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.');
    }
  };

  const deleteRequest = async (id: string) => {
    if (confirm('Are you sure you want to delete this quote request?')) {
      try {
        const { error } = await supabase
          .from('quote_requests')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setQuoteRequests(prevRequests => 
          prevRequests.filter(req => req.id !== id)
        );
        
        toast.success('Quote request deleted successfully.');
      } catch (error) {
        console.error('Error deleting quote request:', error);
        toast.error('Failed to delete quote request.');
      }
    }
  };

  const filteredRequests = searchTerm 
    ? quoteRequests.filter(req => 
        req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.company && req.company.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : quoteRequests;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Quote Requests</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search by name, email or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || statusFilter) && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              <X size={18} />
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-brand-blue border-t-transparent rounded-full mr-2"></div>
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        {request.company && (
                          <div className="text-xs text-gray-500">{request.company}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={request.product_name}>
                        {request.product_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.quantity} {request.unit}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={request.status} 
                        onValueChange={(value) => updateRequestStatus(request.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.product_id && (
                        <a 
                          href={`/product/${request.product_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mr-2"
                        >
                          <Button variant="ghost" size="sm">
                            <ExternalLink size={16} />
                          </Button>
                        </a>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteRequest(request.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No quote requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default QuoteRequests;
