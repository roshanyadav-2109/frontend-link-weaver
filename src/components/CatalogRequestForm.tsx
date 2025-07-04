
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { X, Send, Package, User, Mail, Phone, Building, FileText } from 'lucide-react';

export interface ProductInfo {
  id: string;
  name: string;
  category: string;
  subcategory: string;
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    interestedProducts: preselectedProducts.map(p => p.name).join(', '),
    specificRequirements: '',
    additionalInfo: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Save to database - create catalog_requests table if it doesn't exist
      const catalogData = {
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        business_type: formData.businessType,
        interested_products: formData.interestedProducts,
        specific_requirements: formData.specificRequirements,
        additional_info: formData.additionalInfo,
        status: 'pending'
      };

      // Insert into a generic requests table or create specific table
      const { error } = await supabase
        .from('quote_requests')
        .insert({
          user_id: user?.id || 'anonymous',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          product_name: 'Catalog Request',
          quantity: '1',
          unit: 'catalog',
          additional_details: JSON.stringify(catalogData),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Catalog request submitted successfully! We will send the catalog to your email shortly.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        businessType: '',
        interestedProducts: '',
        specificRequirements: '',
        additionalInfo: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting catalog request:', error);
      toast.error('Failed to submit catalog request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="h-6 w-6 text-blue-600" />
          Request Product Catalog
        </CardTitle>
        <CardDescription>
          Fill out the form below to receive our comprehensive product catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </h3>
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                placeholder="e.g., Retailer, Wholesaler, Manufacturer"
              />
            </div>
          </div>

          {/* Product Interest */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Product Interest
            </h3>
            
            {preselectedProducts.length > 0 && (
              <div className="space-y-2">
                <Label>Products you viewed:</Label>
                <div className="flex flex-wrap gap-2">
                  {preselectedProducts.map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {product.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="interestedProducts">Interested Products/Categories</Label>
              <Textarea
                id="interestedProducts"
                value={formData.interestedProducts}
                onChange={(e) => handleInputChange('interestedProducts', e.target.value)}
                placeholder="Specify the products or categories you're interested in..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="specificRequirements">Specific Requirements</Label>
              <Textarea
                id="specificRequirements"
                value={formData.specificRequirements}
                onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                placeholder="Any specific requirements, quantities, or customizations..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Any other information that would help us serve you better..."
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Catalog Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CatalogRequestForm;
