
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const services = [
  { value: 'textile-manufacturing', label: 'Textile Manufacturing' },
  { value: 'handicrafts', label: 'Handicrafts & Artisan Products' },
  { value: 'organic-products', label: 'Organic & Natural Products' },
  { value: 'leather-goods', label: 'Leather Goods' },
  { value: 'jewelry', label: 'Jewelry & Accessories' },
  { value: 'other', label: 'Other Services' }
];

const RequestQuotePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    product_name: '',
    quantity: '',
    additional_details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({ ...prev, product_name: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.product_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Use authenticated user's ID if available
      const userId = user?.id || 'guest';
      
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          user_id: userId,
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          product_name: formData.product_name,
          quantity: formData.quantity,
          additional_details: formData.additional_details,
          status: 'pending',
          phone: '(No phone provided)',
          unit: 'units'
        });
      
      if (error) throw error;
      
      toast.success('Quote request submitted successfully!');
      
      // Redirect to dashboard if authenticated, otherwise to home
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        setFormData({
          name: '',
          email: '',
          company: '',
          product_name: '',
          quantity: '',
          additional_details: ''
        });
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    // Pre-fill form with user data if authenticated
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2] pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card className="shadow-premium border-0">
          <CardHeader className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] text-white">
            <CardTitle>Request a Quote</CardTitle>
            <CardDescription className="text-white/80">
              Fill out the form below to request a quote for our services
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input 
                    id="company"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service Interested In <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.product_name} 
                    onValueChange={handleServiceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service.value} value={service.value}>
                          {service.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Budget/Quantity (Optional)</Label>
                  <Input 
                    id="quantity"
                    name="quantity"
                    placeholder="Your budget or quantity requirements"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_details">Additional Details</Label>
                <Textarea 
                  id="additional_details"
                  name="additional_details"
                  placeholder="Provide any additional information about your requirements"
                  rows={5}
                  value={formData.additional_details}
                  onChange={handleChange}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069]"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestQuotePage;
