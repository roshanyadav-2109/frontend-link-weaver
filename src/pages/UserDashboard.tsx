
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { CalendarDays, ExternalLink, FileText, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose 
} from '@/components/ui/dialog';

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

const UserDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth/client?redirect=/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching quote requests:', error);
        } else {
          setQuoteRequests(data || []);
        }
      } catch (error) {
        console.error('Exception fetching quote requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      fetchQuoteRequests();
    }
  }, [user?.id, isAuthenticated]);

  const handleRefresh = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error refreshing quote requests:', error);
    } else {
      setQuoteRequests(data || []);
    }
    setIsLoading(false);
  };

  const openQuoteDetails = (quote: QuoteRequest) => {
    setSelectedQuote(quote);
    setShowDetailsDialog(true);
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                onClick={() => navigate('/request-quote')} 
                className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069]"
              >
                <FileText className="mr-2 h-4 w-4" />
                New Quote Request
              </Button>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          <Card className="shadow-premium border-0">
            <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] text-white">
              <CardTitle>Your Quote Requests</CardTitle>
              <CardDescription className="text-white/80">
                View and track the status of all your submitted quote requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                </div>
              ) : quoteRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Info className="h-6 w-6 text-brand-blue" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    You haven't submitted any quote requests yet. Create your first request to get started.
                  </p>
                  <Button 
                    onClick={() => navigate('/request-quote')} 
                    className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069]"
                  >
                    Create Quote Request
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quoteRequests.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                              {format(new Date(quote.created_at), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{quote.product_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`uppercase text-xs font-semibold px-2 py-0.5 ${getStatusColor(quote.status)}`}>
                              {quote.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openQuoteDetails(quote)}
                              className="text-brand-blue hover:text-brand-blue/80 hover:bg-blue-50"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
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
                <h4 className="text-sm font-semibold text-gray-500">Details</h4>
                <p className="mt-1 text-sm">{selectedQuote.additional_details}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
