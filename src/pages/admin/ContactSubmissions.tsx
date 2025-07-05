
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  company_name?: string;
  preferred_contact?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ContactSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();

    // Set up real-time subscription
    const channel = supabase
      .channel('contact_submissions_admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleViewSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Status updated successfully');
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
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
        <h1 className="text-3xl font-bold text-gray-800">Contact Submissions</h1>
        <div className="text-sm text-gray-500">
          Total: {submissions.length} submissions
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No contact submissions found.</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{submission.subject}</CardTitle>
                    <p className="text-sm text-gray-600">From: {submission.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {submission.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {submission.phone}
                      </span>
                      {submission.company_name && (
                        <span>{submission.company_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={submission.status} 
                      onValueChange={(value) => handleStatusUpdate(submission.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSubmission(submission)}
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
                    <Badge className={getStatusColor(submission.status)}>
                      {submission.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(submission.created_at)}
                    </span>
                    {submission.preferred_contact && (
                      <span className="text-sm text-gray-500">
                        Prefers: {submission.preferred_contact}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {submission.message}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Submission Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contact Submission Details</DialogTitle>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedSubmission.name}</p>
                    <p><strong>Email:</strong> {selectedSubmission.email}</p>
                    <p><strong>Phone:</strong> {selectedSubmission.phone}</p>
                    {selectedSubmission.company_name && (
                      <p><strong>Company:</strong> {selectedSubmission.company_name}</p>
                    )}
                    {selectedSubmission.preferred_contact && (
                      <p><strong>Preferred Contact:</strong> {selectedSubmission.preferred_contact}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Submission Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Subject:</strong> {selectedSubmission.subject}</p>
                    <p><strong>Status:</strong> 
                      <Badge className={`ml-2 ${getStatusColor(selectedSubmission.status)}`}>
                        {selectedSubmission.status.replace('_', ' ')}
                      </Badge>
                    </p>
                    <p><strong>Submitted:</strong> {formatDate(selectedSubmission.created_at)}</p>
                    <p><strong>Last Updated:</strong> {formatDate(selectedSubmission.updated_at)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  {selectedSubmission.message}
                </div>
              </div>

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

export default ContactSubmissions;
