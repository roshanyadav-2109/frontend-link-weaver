
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
import { Search, X, Trash, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ManufacturerPartnership {
  id: string;
  created_at: string;
  gstin: string;
  company_name: string;
  representative_name: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  product_category: string | null;
  years_in_business: number | null;
  annual_turnover: string | null;
  manufacturing_capacity: string | null;
  export_experience: string | null;
  certifications: string | null;
  previous_deals: string | null;
  target_markets: string | null;
  additional_info: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const ManufacturerPartnerships: React.FC = () => {
  const [partnerships, setPartnerships] = useState<ManufacturerPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedPartnership, setSelectedPartnership] = useState<ManufacturerPartnership | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (mounted) {
        await fetchPartnerships();
      }
    };

    loadData();

    // Set up real-time subscription for partnerships
    const partnershipsChannel = supabase
      .channel('partnerships-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships'
        },
        (payload) => {
          if (!mounted) return;
          console.log('Real-time partnership update:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast.info('New partnership application received!', {
              description: `From: ${payload.new.company_name}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Partnership application updated!');
          }
          
          fetchPartnerships();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(partnershipsChannel);
    };
  }, [statusFilter]);

  const fetchPartnerships = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('manufacturer_partnerships')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setPartnerships(data as ManufacturerPartnership[]);
    } catch (error) {
      console.error('Error fetching partnerships:', error);
      toast.error('Failed to load partnerships.');
    } finally {
      setLoading(false);
    }
  };

  const updatePartnershipStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('manufacturer_partnerships')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setPartnerships(prevPartnerships => 
        prevPartnerships.map(partnership => 
          partnership.id === id ? { ...partnership, status: newStatus as any } : partnership
        )
      );
      
      toast.success('Status updated successfully.');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.');
    }
  };

  const deletePartnership = async (id: string) => {
    if (confirm('Are you sure you want to delete this partnership application?')) {
      try {
        const { error } = await supabase
          .from('manufacturer_partnerships')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setPartnerships(prevPartnerships => 
          prevPartnerships.filter(partnership => partnership.id !== id)
        );
        
        toast.success('Partnership application deleted successfully.');
      } catch (error) {
        console.error('Error deleting partnership:', error);
        toast.error('Failed to delete partnership application.');
      }
    }
  };

  const filteredPartnerships = searchTerm 
    ? partnerships.filter(partnership => 
        partnership.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.representative_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partnership.gstin.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : partnerships;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manufacturer Partnerships</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10"
              placeholder="Search by company, representative, email or GSTIN..."
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
                <TableHead>Company</TableHead>
                <TableHead>Representative</TableHead>
                <TableHead>Contact</TableHead>
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
              ) : filteredPartnerships.length > 0 ? (
                filteredPartnerships.map((partnership) => (
                  <TableRow key={partnership.id}>
                    <TableCell>
                      {new Date(partnership.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partnership.company_name}</div>
                        <div className="text-xs text-gray-500">GSTIN: {partnership.gstin}</div>
                      </div>
                    </TableCell>
                    <TableCell>{partnership.representative_name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{partnership.email}</div>
                        <div className="text-xs text-gray-500">{partnership.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={partnership.status} 
                        onValueChange={(value) => updatePartnershipStatus(partnership.id, value)}
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
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="mr-2"
                        onClick={() => {
                          setSelectedPartnership(partnership);
                          setShowDetails(true);
                        }}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deletePartnership(partnership.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No partnership applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Partnership Application Details</DialogTitle>
          </DialogHeader>
          {selectedPartnership && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">GSTIN</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.gstin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Representative Name</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.representative_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Category</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.product_category || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Years in Business</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.years_in_business || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Annual Turnover</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.annual_turnover || 'N/A'}</p>
                </div>
              </div>
              
              {selectedPartnership.address && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <p className="text-sm text-gray-900">
                    {selectedPartnership.address}
                    {selectedPartnership.city && `, ${selectedPartnership.city}`}
                    {selectedPartnership.state && `, ${selectedPartnership.state}`}
                    {selectedPartnership.country && `, ${selectedPartnership.country}`}
                  </p>
                </div>
              )}
              
              {selectedPartnership.manufacturing_capacity && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Manufacturing Capacity</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.manufacturing_capacity}</p>
                </div>
              )}
              
              {selectedPartnership.export_experience && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Export Experience</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.export_experience}</p>
                </div>
              )}
              
              {selectedPartnership.certifications && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Certifications</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.certifications}</p>
                </div>
              )}
              
              {selectedPartnership.target_markets && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Target Markets</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.target_markets}</p>
                </div>
              )}
              
              {selectedPartnership.additional_info && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Information</label>
                  <p className="text-sm text-gray-900">{selectedPartnership.additional_info}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManufacturerPartnerships;
