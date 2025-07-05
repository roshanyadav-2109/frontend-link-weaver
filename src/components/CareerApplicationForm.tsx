
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const careerFormSchema = z.object({
  applicant_name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  current_location: z.string().min(2, { message: 'Current location is required.' }),
  experience: z.string().min(1, { message: 'Experience information is required.' }),
  interested_department: z.string().min(1, { message: 'Please select a department.' }),
  current_position: z.string().min(2, { message: 'Current position is required.' }),
  cover_letter: z.string().min(50, { message: 'Cover letter must be at least 50 characters.' }),
  education: z.string().optional(),
  expected_salary: z.string().optional(),
  notice_period: z.string().optional(),
  linkedin_profile: z.string().optional(),
  portfolio_url: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

type CareerApplicationFormProps = {
  jobId?: string;
  onSuccess?: () => void;
};

const departments = [
  'Sales & Marketing',
  'Business Development',
  'Operations',
  'Quality Control',
  'Supply Chain',
  'Customer Service',
  'Finance & Accounting',
  'Human Resources',
  'IT & Technology',
  'Logistics',
  'Administration',
  'Other'
];

const experienceLevels = [
  'Fresh Graduate (0-1 years)',
  'Entry Level (1-2 years)',
  'Mid Level (3-5 years)',
  'Senior Level (6-10 years)',
  'Expert Level (10+ years)'
];

export function CareerApplicationForm({ jobId, onSuccess }: CareerApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof careerFormSchema>>({
    resolver: zodResolver(careerFormSchema),
    defaultValues: {
      applicant_name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      current_location: '',
      experience: '',
      interested_department: '',
      current_position: '',
      cover_letter: '',
      education: '',
      expected_salary: '',
      notice_period: '',
      linkedin_profile: '',
      portfolio_url: '',
      skills: [],
    },
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  async function onSubmit(values: z.infer<typeof careerFormSchema>) {
    if (!user) {
      toast.error('You must be logged in to submit an application.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting career application:', values);
      
      let resumeUrl = null;
      
      // Upload resume if provided
      if (resume) {
        const fileExt = resume.name.split('.').pop();
        const fileName = `${Date.now()}_${user.id}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resume);

        if (uploadError) {
          console.error('Error uploading resume:', uploadError);
          toast.error('Failed to upload resume. Please try again.');
          return;
        }
        
        resumeUrl = uploadData.path;
      }

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: jobId || null,
          applicant_name: values.applicant_name,
          email: values.email,
          phone: values.phone,
          current_location: values.current_location,
          experience: values.experience,
          interested_department: values.interested_department,
          current_position: values.current_position,
          cover_letter: values.cover_letter,
          resume_link: resumeUrl,
          education: values.education || null,
          expected_salary: values.expected_salary || null,
          notice_period: values.notice_period || null,
          linkedin_profile: values.linkedin_profile || null,
          portfolio_url: values.portfolio_url || null,
          skills: values.skills || null,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error('Error submitting application:', error);
        toast.error('Failed to submit application. Please try again.');
        return;
      }

      console.log('Application submitted successfully:', data);
      toast.success('Application submitted successfully! We will review it and get back to you soon.');
      form.reset();
      setResume(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="applicant_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number*</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="current_location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Location*</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="interested_department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interested Department*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="current_position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Position*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Marketing Manager" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educational Qualification</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Bachelor's in Business" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expected_salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Salary</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $50,000 - $60,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notice_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Period</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 weeks, 1 month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="linkedin_profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="portfolio_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourportfolio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Resume Upload</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
          </p>
        </div>

        <FormField
          control={form.control}
          name="cover_letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us why you're interested in this position and what makes you a great fit for our team..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-brand-teal hover:bg-brand-teal/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}
