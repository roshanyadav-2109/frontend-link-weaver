
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Briefcase, MapPin, Clock, Users, Loader2 } from 'lucide-react';

interface Career {
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
  const [careers, setCareers] = useState<Career[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    current_location: '',
    experience: '',
    interested_department: '',
    current_position: '',
    cover_letter: '',
    resume_link: ''
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setApplicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationData.applicant_name || !applicationData.email || !applicationData.phone || !applicationData.interested_department) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to job_applications table
      const { error: dbError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user?.id || 'anonymous',
          ...applicationData,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-form-email', {
        body: {
          type: 'application',
          applicationData: {
            fullName: applicationData.applicant_name,
            email: applicationData.email,
            phone: applicationData.phone,
            currentLocation: applicationData.current_location,
            experience: applicationData.experience,
            interestedDepartment: applicationData.interested_department,
            currentRole: applicationData.current_position,
            coverLetter: applicationData.cover_letter,
            resume: applicationData.resume_link
          }
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't throw error for email, just log it
      }

      toast.success('Application submitted successfully!');
      
      // Reset form
      setApplicationData({
        applicant_name: '',
        email: '',
        phone: '',
        current_location: '',
        experience: '',
        interested_department: '',
        current_position: '',
        cover_letter: '',
        resume_link: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = [
    'Sales & Marketing',
    'Operations',
    'Supply Chain',
    'Quality Assurance',
    'Customer Service',
    'Human Resources',
    'Finance & Accounting',
    'Information Technology',
    'Research & Development'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Be part of our growing company and help us connect businesses worldwide through quality products and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Current Openings</h2>
            
            {careers.length > 0 ? (
              careers.map((career) => (
                <Card key={career.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{career.title}</h3>
                        <p className="text-blue-600 font-medium">{career.department}</p>
                      </div>
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {career.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {career.type}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{career.description}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">Apply Now</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Apply for {career.title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitApplication} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="applicant_name">Full Name *</Label>
                              <Input
                                id="applicant_name"
                                name="applicant_name"
                                value={applicationData.applicant_name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={applicationData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Phone *</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={applicationData.phone}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="current_location">Current Location *</Label>
                              <Input
                                id="current_location"
                                name="current_location"
                                value={applicationData.current_location}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="interested_department">Department *</Label>
                            <Select onValueChange={(value) => handleSelectChange('interested_department', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="experience">Years of Experience</Label>
                              <Input
                                id="experience"
                                name="experience"
                                value={applicationData.experience}
                                onChange={handleInputChange}
                                placeholder="e.g., 3 years"
                              />
                            </div>
                            <div>
                              <Label htmlFor="current_position">Current Position</Label>
                              <Input
                                id="current_position"
                                name="current_position"
                                value={applicationData.current_position}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="resume_link">Resume Link (Google Drive, Dropbox, etc.)</Label>
                            <Input
                              id="resume_link"
                              name="resume_link"
                              type="url"
                              value={applicationData.resume_link}
                              onChange={handleInputChange}
                              placeholder="https://drive.google.com/..."
                            />
                          </div>

                          <div>
                            <Label htmlFor="cover_letter">Cover Letter</Label>
                            <Textarea
                              id="cover_letter"
                              name="cover_letter"
                              value={applicationData.cover_letter}
                              onChange={handleInputChange}
                              rows={4}
                              placeholder="Tell us why you're interested in this position..."
                            />
                          </div>

                          <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting Application...
                              </>
                            ) : (
                              'Submit Application'
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-lg">
                <CardContent className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Current Openings</h3>
                  <p className="text-gray-500 mb-6">
                    We don't have any open positions right now, but we're always looking for talented individuals to join our team.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Submit General Application</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>General Application</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitApplication} className="space-y-4">
                        {/* Same form fields as above */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="applicant_name">Full Name *</Label>
                            <Input
                              id="applicant_name"
                              name="applicant_name"
                              value={applicationData.applicant_name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={applicationData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={applicationData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="current_location">Current Location *</Label>
                            <Input
                              id="current_location"
                              name="current_location"
                              value={applicationData.current_location}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="interested_department">Interested Department *</Label>
                          <Select onValueChange={(value) => handleSelectChange('interested_department', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                              id="experience"
                              name="experience"
                              value={applicationData.experience}
                              onChange={handleInputChange}
                              placeholder="e.g., 3 years"
                            />
                          </div>
                          <div>
                            <Label htmlFor="current_position">Current Position</Label>
                            <Input
                              id="current_position"
                              name="current_position"
                              value={applicationData.current_position}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="resume_link">Resume Link (Google Drive, Dropbox, etc.)</Label>
                          <Input
                            id="resume_link"
                            name="resume_link"
                            type="url"
                            value={applicationData.resume_link}
                            onChange={handleInputChange}
                            placeholder="https://drive.google.com/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="cover_letter">Cover Letter</Label>
                          <Textarea
                            id="cover_letter"
                            name="cover_letter"
                            value={applicationData.cover_letter}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="Tell us about yourself and why you'd like to work with us..."
                          />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting Application...
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Company Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Why Work With Us?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">Competitive salary and benefits</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">Professional development opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">Collaborative work environment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">Work-life balance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600">Global business exposure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Ready to Join Us?</h3>
                <p className="text-sm mb-4">
                  Even if you don't see a perfect match above, we're always interested in hearing from talented individuals.
                </p>
                <p className="text-sm">
                  Send us your resume at <strong>careers@anantyaoverseas.com</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
