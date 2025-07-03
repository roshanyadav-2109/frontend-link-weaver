
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Briefcase, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface JobApplication {
  id: string;
  applicant_name: string;
  interested_department: string;
  status: string;
  created_at: string;
  admin_notes?: string;
  current_position: string;
  experience: string;
}

const UserJobApplications: React.FC = () => {
  const { user } = useAuth();
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobApplications();
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'shortlisted':
      case 'hired':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Job Applications</h1>
          <p className="text-gray-600 mt-2">Track all your job applications</p>
        </div>

        <div className="grid gap-6">
          {jobApplications.length > 0 ? (
            jobApplications.map((application, index) => (
              <AnimatedCard key={application.id} delay={index * 0.1} className="bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.interested_department}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Current Position: {application.current_position}
                      </p>
                      <p className="text-sm text-gray-500">
                        Experience: {application.experience}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {application.admin_notes && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-1">Admin Notes:</h4>
                      <p className="text-sm text-blue-700">{application.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </AnimatedCard>
            ))
          ) : (
            <AnimatedCard className="bg-white text-center py-12">
              <CardContent>
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Job Applications</h3>
                <p className="text-gray-500 mb-6">You haven't submitted any job applications yet.</p>
                <Link to="/careers">
                  <Button>
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Available Jobs
                  </Button>
                </Link>
              </CardContent>
            </AnimatedCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserJobApplications;
