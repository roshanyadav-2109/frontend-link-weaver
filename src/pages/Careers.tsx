
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building, 
  Send,
  User,
  Mail,
  Phone,
  FileText,
  Star
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
}

const Careers: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    currentLocation: '',
    experience: '',
    currentPosition: '',
    interestedDepartment: '',
    coverLetter: '',
    resumeLink: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicantName || !formData.email || !formData.phone || !formData.coverLetter || !formData.interestedDepartment) {
      toast.error('Please fill in all required fields');
      return;
    }

    setApplicationLoading(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user?.id || 'anonymous',
          job_id: selectedJob?.id || null,
          applicant_name: formData.applicantName,
          email: formData.email,
          phone: formData.phone,
          current_location: formData.currentLocation,
          experience: formData.experience,
          current_position: formData.currentPosition,
          interested_department: formData.interestedDepartment,
          cover_letter: formData.coverLetter,
          resume_link: formData.resumeLink || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Application submitted successfully! We will review your application and get back to you soon.');
      
      // Reset form and close dialog
      setFormData({
        applicantName: '',
        email: '',
        phone: '',
        currentLocation: '',
        experience: '',
        currentPosition: '',
        interestedDepartment: '',
        coverLetter: '',
        resumeLink: ''
      });
      setIsDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplicationLoading(false);
    }
  };

  const departments = [
    'Sales & Marketing',
    'Operations',
    'Quality Assurance',
    'Logistics',
    'Finance',
    'Human Resources',
    'IT & Technology',
    'Customer Service',
    'Product Development',
    'Supply Chain'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build your career with a global leader in manufacturing and export. 
              We offer exciting opportunities for growth and development.
            </p>
          </div>

          {/* Company Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-500" />
                  Growth Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Continuous learning and development programs to advance your career
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-blue-600" />
                  Global Exposure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Work with international clients and expand your global perspective
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-green-600" />
                  Competitive Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive benefits package including health insurance and bonuses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                      <Button 
                        onClick={() => {
                          setSelectedJob(job);
                          setFormData(prev => ({ ...prev, interestedDepartment: job.department }));
                          setIsDialogOpen(true);
                        }}
                        className="w-full"
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardContent className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Current Openings</h3>
                  <p className="text-gray-600 mb-6">
                    We don't have any open positions right now, but we're always looking for talented individuals.
                  </p>
                  <Button 
                    onClick={() => {
                      setSelectedJob(null);
                      setIsDialogOpen(true);
                    }}
                    variant="outline"
                  >
                    Submit General Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* General Application Button */}
          <div className="text-center">
            <Card className="shadow-lg">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Don't See the Right Position?</h3>
                <p className="text-gray-600 mb-6">
                  Submit a general application and we'll keep your profile on file for future opportunities
                </p>
                <Button 
                  onClick={() => {
                    setSelectedJob(null);
                    setIsDialogOpen(true);
                  }}
                  size="lg"
                >
                  Submit General Application
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Application Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  {selectedJob ? `Apply for ${selectedJob.title}` : 'General Application'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="applicantName">Full Name *</Label>
                      <Input
                        id="applicantName"
                        value={formData.applicantName}
                        onChange={(e) => handleInputChange('applicantName', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input
                        id="currentLocation"
                        value={formData.currentLocation}
                        onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        placeholder="City, State/Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="e.g., 5 years"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentPosition">Current Position</Label>
                      <Input
                        id="currentPosition"
                        value={formData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        placeholder="Your current job title"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="interestedDepartment">Interested Department *</Label>
                    <Select 
                      value={formData.interestedDepartment} 
                      onValueChange={(value) => handleInputChange('interestedDepartment', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="resumeLink">Resume/CV Link</Label>
                    <Input
                      id="resumeLink"
                      value={formData.resumeLink}
                      onChange={(e) => handleInputChange('resumeLink', e.target.value)}
                      placeholder="Google Drive, Dropbox, or LinkedIn profile link"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter *</Label>
                    <Textarea
                      id="coverLetter"
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      rows={6}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={applicationLoading} className="flex-1">
                    {applicationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Careers;
