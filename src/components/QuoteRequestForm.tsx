
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { X } from 'lucide-react';

interface QuoteRequestFormProps {
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  userId?: string;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ 
  productName = '', 
  productId,
  onSuccess,
  userId
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productName: productName,
    quantity: '',
    unit: '',
    additionalDetails: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.productName || !formData.quantity || !formData.unit) {
      toast.error('Please fill in all required fields including phone number');
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit a quote request');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting quote request:', formData);
      
      const { data, error } = await supabase
        .from('quote_requests')
        .insert({
          user_id: user.id,
          product_id: productId || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          product_name: formData.productName,
          quantity: formData.quantity,
          unit: formData.unit,
          additional_details: formData.additionalDetails || null,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error('Quote request submission error:', error);
        toast.error(`Failed to submit quote request: ${error.message}`);
        return;
      }

      console.log('Quote request submitted successfully:', data);
      toast.success('Quote request submitted successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        productName: productName,
        quantity: '',
        unit: '',
        additionalDetails: ''
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Request a Quote</h3>
        <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you with a detailed quote</p>
      </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="What product are you interested in?"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  placeholder="pieces, kg, tons, etc."
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
                placeholder="Any specific requirements, delivery timeline, or other details..."
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="w-full bg-brand-blue hover:bg-brand-blue/90">
                {loading ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
            </div>
          </form>
    </div>
  );
};

export default QuoteRequestForm;
