
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CareerApplicationForm } from '@/components/CareerApplicationForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Clock, Briefcase, Calendar } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
  created_at: string;
}

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isGeneralApplicationOpen, setIsGeneralApplicationOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationOpen(true);
  };

  const handleApplicationSuccess = () => {
    setIsApplicationOpen(false);
    setIsGeneralApplicationOpen(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Build your career with us and be part of a global sourcing revolution
          </p>
          <Button 
            onClick={() => setIsGeneralApplicationOpen(true)}
            className="bg-brand-teal hover:bg-brand-teal/90"
          >
            Submit General Application
          </Button>
        </div>

        {/* Company Culture Section */}
        <div className="mb-12">
          <Card className="shadow-lg">
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
                  <p className="text-gray-600">
                    Work on projects that connect businesses across continents and make a real difference
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                  <p className="text-gray-600">
                    Advance your career with comprehensive training programs and mentorship
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Collaborative Culture</h3>
                  <p className="text-gray-600">
                    Join a diverse team that values innovation, collaboration, and excellence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Open Positions</h2>
          
          {jobs.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Open Positions</h3>
                <p className="text-gray-600 mb-6">
                  We don't have any specific positions open right now, but we're always looking for talented individuals.
                </p>
                <Button 
                  onClick={() => setIsGeneralApplicationOpen(true)}
                  className="bg-brand-teal hover:bg-brand-teal/90"
                >
                  Submit General Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.department}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.type}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(job.created_at)}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleApply(job)}
                        className="bg-brand-teal hover:bg-brand-teal/90"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Application Dialog */}
        <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Apply for {selectedJob?.title}
              </DialogTitle>
            </DialogHeader>
            {selectedJob && (
              <CareerApplicationForm 
                jobId={selectedJob.id} 
                onSuccess={handleApplicationSuccess}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* General Application Dialog */}
        <Dialog open={isGeneralApplicationOpen} onOpenChange={setIsGeneralApplicationOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>General Application</DialogTitle>
            </DialogHeader>
            <CareerApplicationForm onSuccess={handleApplicationSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Careers;
