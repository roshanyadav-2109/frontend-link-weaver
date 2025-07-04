
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useAuth } from "@/hooks/useAuth";

interface JobApplication {
  applicant_name: string;
  email: string;
  phone: string;
  current_location: string;
  experience: string;
  interested_department: string;
  current_position: string;
  cover_letter: string;
  resume_link: string;
}

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
}

const EMAIL_ENDPOINT = "https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email";

const Careers = () => {
  const { user } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [form, setForm] = useState<JobApplication>({
    applicant_name: "",
    email: "",
    phone: "",
    current_location: "",
    experience: "",
    interested_department: "",
    current_position: "",
    cover_letter: "",
    resume_link: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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

      if (error) {
        console.error('Error fetching careers:', error);
      } else {
        setCareers(data || []);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { applicant_name, email, phone, current_location, experience, interested_department, current_position, cover_letter } = form;
    if (!applicant_name || !email || !phone || !current_location || !experience || !interested_department || !current_position || !cover_letter) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const applicationData = {
        user_id: user?.id || null,
        applicant_name: form.applicant_name,
        email: form.email,
        phone: form.phone,
        current_location: form.current_location,
        experience: form.experience,
        interested_department: form.interested_department,
        current_position: form.current_position,
        cover_letter: form.cover_letter,
        resume_link: form.resume_link || null,
        status: 'pending'
      };

      const { error } = await supabase
        .from('job_applications')
        .insert(applicationData);

      if (error) {
        console.error('Error submitting application:', error);
        toast.error("Failed to submit application. Please try again.");
        return;
      }

      // Send email notification
      try {
        await fetch(EMAIL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "application",
            applicationData: {
              fullName: form.applicant_name,
              email: form.email,
              phone: form.phone,
              currentLocation: form.current_location,
              experience: form.experience,
              interestedDepartment: form.interested_department,
              currentRole: form.current_position,
              coverLetter: form.cover_letter,
              resume: form.resume_link
            }
          }),
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      toast.success("Application submitted successfully! We'll review your application and get back to you.");
      setForm({
        applicant_name: "",
        email: "",
        phone: "",
        current_location: "",
        experience: "",
        interested_department: "",
        current_position: "",
        cover_letter: "",
        resume_link: "",
      });
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Careers at Anantya Overseas</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our dynamic team and be part of our mission to connect businesses globally through innovative trade solutions.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {careers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 text-center">Current Openings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {careers.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.department} • {job.location}</p>
                      <p className="text-sm text-blue-600 mb-3">{job.type}</p>
                      <p className="text-gray-700 text-sm mb-4">{job.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">General Application</h2>
                <p className="text-gray-600 mb-6">
                  Don't see a specific role that matches your skills? Submit a general application and we'll consider you for future opportunities.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="applicant_name"
                      placeholder="Full Name *"
                      value={form.applicant_name}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      name="email"
                      placeholder="Email Address *"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="phone"
                      placeholder="Phone Number *"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    
                    <Input
                      name="current_location"
                      placeholder="Current Location *"
                      value={form.current_location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="experience"
                      placeholder="Years of Experience *"
                      value={form.experience}
                      onChange={handleChange}
                      required
                    />
                    
                    <select
                      name="interested_department"
                      value={form.interested_department}
                      onChange={handleChange}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select Department *</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="IT">Information Technology</option>
                      <option value="Logistics">Logistics</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Business Development">Business Development</option>
                    </select>
                  </div>
                  
                  <Input
                    name="current_position"
                    placeholder="Current Position/Role *"
                    value={form.current_position}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    name="resume_link"
                    placeholder="Resume Link (Google Drive, LinkedIn, etc.)"
                    value={form.resume_link}
                    onChange={handleChange}
                  />
                  
                  <Textarea
                    name="cover_letter"
                    placeholder="Cover Letter - Tell us about yourself, your experience, and why you'd like to work with us *"
                    value={form.cover_letter}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                  
                  <InteractiveHoverButton 
                    type="submit" 
                    text={submitting ? "Submitting..." : "Submit Application"} 
                    disabled={submitting} 
                  />
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Careers;
