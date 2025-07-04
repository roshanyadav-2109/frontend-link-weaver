
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Package } from 'lucide-react';

export interface ProductInfo {
  id: string;
  name: string;
  category: string;
}

interface CatalogRequestFormProps {
  preselectedProducts?: ProductInfo[];
  onSuccess?: () => void;
}

const CatalogRequestForm: React.FC<CatalogRequestFormProps> = ({ 
  preselectedProducts = [], 
  onSuccess 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    business_type: '',
    products_of_interest: preselectedProducts.map(p => p.name).join(', '),
    specific_requirements: '',
    annual_volume: '',
    target_markets: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store catalog request data
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          user_id: user?.id || 'anonymous',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          product_name: `Catalog Request: ${formData.products_of_interest || 'General'}`,
          quantity: '1',
          unit: 'catalog',
          additional_details: `Business Type: ${formData.business_type}
Products of Interest: ${formData.products_of_interest}
Specific Requirements: ${formData.specific_requirements}
Annual Volume: ${formData.annual_volume}
Target Markets: ${formData.target_markets}`,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Catalog request submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        business_type: '',
        products_of_interest: '',
        specific_requirements: '',
        annual_volume: '',
        target_markets: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting catalog request:', error);
      toast.error('Failed to submit catalog request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Request Product Catalog
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_type">Business Type</Label>
            <Input
              id="business_type"
              name="business_type"
              placeholder="e.g., Retailer, Distributor, Manufacturer"
              value={formData.business_type}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="products_of_interest">Products of Interest</Label>
            <Textarea
              id="products_of_interest"
              name="products_of_interest"
              placeholder="Specify the products or categories you're interested in"
              value={formData.products_of_interest}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specific_requirements">Specific Requirements</Label>
            <Textarea
              id="specific_requirements"
              name="specific_requirements"
              placeholder="Any specific requirements, certifications, or customizations needed"
              value={formData.specific_requirements}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual_volume">Expected Annual Volume</Label>
              <Input
                id="annual_volume"
                name="annual_volume"
                placeholder="e.g., 10,000 units"
                value={formData.annual_volume}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target_markets">Target Markets</Label>
              <Input
                id="target_markets"
                name="target_markets"
                placeholder="e.g., USA, Europe, Asia"
                value={formData.target_markets}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              'Submit Catalog Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CatalogRequestForm;
