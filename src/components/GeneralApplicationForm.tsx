
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const applicationSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  currentLocation: z.string().min(2, { message: 'Current location is required' }),
  experience: z.string().min(1, { message: 'Experience level is required' }),
  interestedDepartment: z.string().min(1, { message: 'Department preference is required' }),
  currentRole: z.string().min(2, { message: 'Current role is required' }),
  coverLetter: z.string().min(50, { message: 'Please provide a detailed cover letter (minimum 50 characters)' }),
  resume: z.string().optional(),
});

const departments = [
  'Sales & Marketing',
  'Operations',
  'Customer Support',
  'Finance',
  'Human Resources',
  'Technology',
  'Legal',
  'Any Department'
];

const experienceLevels = [
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years'
];

const EMAIL_ENDPOINT = "https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email";

type GeneralApplicationFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GeneralApplicationForm = ({ isOpen, onClose }: GeneralApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      currentLocation: '',
      experience: '',
      interestedDepartment: '',
      currentRole: '',
      coverLetter: '',
      resume: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    if (!user) {
      toast.error('Please sign in to submit an application');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting general application:', values);
      
      // Store in database
      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          applicant_name: values.fullName,
          email: values.email,
          phone: values.phone,
          current_location: values.currentLocation,
          experience: values.experience,
          interested_department: values.interestedDepartment,
          current_position: values.currentRole,
          cover_letter: values.coverLetter,
          resume_link: values.resume || null,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to save application. Please try again.');
        return;
      }

      console.log('Application saved to database:', data);

      // Send email notifications
      try {
        const applicationData = {
          type: "application",
          applicationData: {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            currentLocation: values.currentLocation,
            experience: values.experience,
            interestedDepartment: values.interestedDepartment,
            currentRole: values.currentRole,
            coverLetter: values.coverLetter,
            resume: values.resume || '',
          }
        };

        console.log('Sending email with payload:', applicationData);

        const response = await fetch(EMAIL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(applicationData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Email sent successfully:', result);
          toast.success('Application submitted successfully! We will review your application and get back to you soon.');
        } else {
          console.error('Email sending failed:', result);
          toast.warning('Application saved but email notification failed. We have received your application.');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        toast.warning('Application saved but email notification failed. We have received your application.');
      }

      form.reset();
      onClose();
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-blue">
            General Application Form
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
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
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Location*</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="interestedDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interested Department*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currentRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Role/Position*</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer, Sales Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself, your experience, and why you want to join Anantya Overseas..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume/CV Link (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-brand-teal hover:bg-brand-teal/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralApplicationForm;
