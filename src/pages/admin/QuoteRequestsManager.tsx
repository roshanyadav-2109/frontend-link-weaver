
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Archive, Check, Clock, Eye, Filter, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface QuoteRequest {
  id: string;
  created_at: string;
  product_name: string;
  status: string;
  additional_details: string;
  company: string | null;
  name: string;
  email: string;
  phone: string;
  quantity: string;
  user_id: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'reviewed':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'completed':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'approved', label: 'Approved' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

const QuoteRequestsManager: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<QuoteRequest[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching quote requests:', error);
          toast.error('Failed to load quote requests');
        } else {
          setQuoteRequests(data || []);
          setFilteredRequests(data || []);
        }
      } catch (error) {
        console.error('Exception fetching quote requests:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchQuoteRequests();
    }
  }, [isAdmin]);

  useEffect(() => {
    let results = quoteRequests;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(quote => quote.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(quote => 
        quote.name.toLowerCase().includes(query) ||
        quote.email.toLowerCase().includes(query) ||
        quote.product_name.toLowerCase().includes(query) ||
        (quote.company && quote.company.toLowerCase().includes(query))
      );
    }
    
    setFilteredRequests(results);
  }, [quoteRequests, searchQuery, statusFilter]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error refreshing quote requests:', error);
        toast.error('Failed to refresh data');
      } else {
        setQuoteRequests(data || []);
        setFilteredRequests(data || []);
        toast.success('Data refreshed');
      }
    } catch (error) {
      console.error('Exception refreshing quote requests:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedQuote) return;
    
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus })
        .eq('id', selectedQuote.id);
      
      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
      } else {
        toast.success(`Status updated to ${newStatus}`);
        
        // Update local state
        const updatedRequests = quoteRequests.map(quote => 
          quote.id === selectedQuote.id ? { ...quote, status: newStatus } : quote
        );
        
        setQuoteRequests(updatedRequests);
        setSelectedQuote({ ...selectedQuote, status: newStatus });
        setIsUpdateStatusOpen(false);
      }
    } catch (error) {
      console.error('Exception updating status:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const viewQuoteDetails = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setIsDetailsOpen(true);
  };

  const openUpdateStatus = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setIsUpdateStatusOpen(true);
  };

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quote Requests</h2>
          <p className="text-gray-500">Manage and respond to customer quote requests</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="ml-auto"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Quote Requests</CardTitle>
          <CardDescription>
            {filteredRequests.length} total requests found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Archive className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No quote requests found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try changing your search or filter criteria.' 
                  : 'There are no quote requests in the system yet.'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">
                        {format(new Date(quote.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.name}</div>
                          <div className="text-xs text-gray-500">{quote.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {quote.product_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`uppercase text-xs font-semibold ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Open menu</span>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewQuoteDetails(quote)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openUpdateStatus(quote)}>
                              <Clock className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quote Request Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedQuote && format(new Date(selectedQuote.created_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Status</h4>
                  <Badge variant="outline" className={`mt-1 uppercase text-xs font-semibold px-2 py-0.5 ${getStatusColor(selectedQuote.status)}`}>
                    {selectedQuote.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Service</h4>
                  <p className="mt-1">{selectedQuote.product_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Name</h4>
                  <p className="mt-1">{selectedQuote.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Email</h4>
                  <p className="mt-1">{selectedQuote.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Phone</h4>
                  <p className="mt-1">{selectedQuote.phone}</p>
                </div>
                {selectedQuote.company && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500">Company</h4>
                    <p className="mt-1">{selectedQuote.company}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500">Quantity/Budget</h4>
                  <p className="mt-1">{selectedQuote.quantity}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500">Additional Details</h4>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedQuote.additional_details}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsOpen(false);
                setIsUpdateStatusOpen(true);
              }}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Quote Status</DialogTitle>
            <DialogDescription>
              Change the status of this quote request
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Current Status</h3>
                <Badge variant="outline" className={`mt-1 uppercase text-xs font-semibold px-2 py-0.5 ${getStatusColor(selectedQuote.status)}`}>
                  {selectedQuote.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Change Status To</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedQuote.status === 'pending' ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus('pending')}
                    disabled={selectedQuote.status === 'pending'}
                    size="sm"
                    className="justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                    Pending
                  </Button>
                  <Button
                    variant={selectedQuote.status === 'reviewed' ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus('reviewed')}
                    disabled={selectedQuote.status === 'reviewed'}
                    size="sm"
                    className="justify-start"
                  >
                    <Eye className="mr-2 h-4 w-4 text-blue-500" />
                    Reviewed
                  </Button>
                  <Button
                    variant={selectedQuote.status === 'approved' ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus('approved')}
                    disabled={selectedQuote.status === 'approved'}
                    size="sm"
                    className="justify-start"
                  >
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Approved
                  </Button>
                  <Button
                    variant={selectedQuote.status === 'rejected' ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus('rejected')}
                    disabled={selectedQuote.status === 'rejected'}
                    size="sm"
                    className="justify-start"
                  >
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    Rejected
                  </Button>
                  <Button
                    variant={selectedQuote.status === 'completed' ? 'secondary' : 'outline'}
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={selectedQuote.status === 'completed'}
                    size="sm"
                    className="justify-start"
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <Check className="mr-2 h-4 w-4 text-purple-500" />
                    Completed
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateStatusOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuoteRequestsManager;
