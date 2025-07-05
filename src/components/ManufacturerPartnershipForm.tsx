
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Factory, FileText, User, Package, Calendar, Globe } from 'lucide-react';

interface ManufacturerPartnershipFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManufacturerPartnershipForm: React.FC<ManufacturerPartnershipFormProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gstin: '',
    companyName: '',
    representativeName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    productCategory: '',
    yearsInBusiness: '',
    annualTurnover: '',
    manufacturingCapacity: '',
    exportExperience: '',
    certifications: '',
    previousDeals: '',
    targetMarkets: '',
    additionalInfo: ''
  });

  const productCategories = [
    'Textiles & Fabrics',
    'Electronics & Audio',
    'Handicrafts & Artisan',
    'Organic Products',
    'Chemicals & Pharmaceuticals',
    'Automotive Parts',
    'Home & Lifestyle',
    'Industrial Equipment',
    'Food & Beverages',
    'Healthcare Products',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gstin || !formData.companyName || !formData.representativeName || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting manufacturer partnership:', formData);
      
      // Save to database with real-time sync
      const { data, error } = await supabase
        .from('manufacturer_partnerships')
        .insert({
          gstin: formData.gstin,
          company_name: formData.companyName,
          representative_name: formData.representativeName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          product_category: formData.productCategory,
          years_in_business: parseInt(formData.yearsInBusiness) || null,
          annual_turnover: formData.annualTurnover,
          manufacturing_capacity: formData.manufacturingCapacity,
          export_experience: formData.exportExperience,
          certifications: formData.certifications,
          previous_deals: formData.previousDeals,
          target_markets: formData.targetMarkets,
          additional_info: formData.additionalInfo,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting partnership to database:', error);
        toast.error('Failed to submit partnership application. Please try again.');
        return;
      }

      console.log('Partnership saved to database successfully:', data);
      toast.success('Partnership application submitted successfully! We will contact you soon.');
      
      onClose();
      
      // Reset form
      setFormData({
        gstin: '',
        companyName: '',
        representativeName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        productCategory: '',
        yearsInBusiness: '',
        annualTurnover: '',
        manufacturingCapacity: '',
        exportExperience: '',
        certifications: '',
        previousDeals: '',
        targetMarkets: '',
        additionalInfo: ''
      });
    } catch (error) {
      console.error('Error submitting partnership form:', error);
      toast.error('Failed to submit partnership application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Factory className="h-6 w-6 text-brand-blue" />
            Partner as a Manufacturer
          </CardTitle>
          <CardDescription>
            Join our global network of verified manufacturers and expand your business reach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gstin">GSTIN *</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="Enter your GSTIN"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Representative Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Representative Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="representativeName">Representative Name *</Label>
                  <Input
                    id="representativeName"
                    value={formData.representativeName}
                    onChange={(e) => handleInputChange('representativeName', e.target.value)}
                    placeholder="Primary contact person"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Business Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="productCategory">Product Category</Label>
                  <Select onValueChange={(value) => handleInputChange('productCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="yearsInBusiness">Years in Business</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                    placeholder="Number of years"
                  />
                </div>
                <div>
                  <Label htmlFor="annualTurnover">Annual Turnover</Label>
                  <Input
                    id="annualTurnover"
                    value={formData.annualTurnover}
                    onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
                    placeholder="e.g., 50 Lakhs, 2 Crores"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturingCapacity">Manufacturing Capacity</Label>
                  <Input
                    id="manufacturingCapacity"
                    value={formData.manufacturingCapacity}
                    onChange={(e) => handleInputChange('manufacturingCapacity', e.target.value)}
                    placeholder="Monthly/Annual capacity"
                  />
                </div>
                <div>
                  <Label htmlFor="exportExperience">Export Experience</Label>
                  <Input
                    id="exportExperience"
                    value={formData.exportExperience}
                    onChange={(e) => handleInputChange('exportExperience', e.target.value)}
                    placeholder="Years of export experience"
                  />
                </div>
                <div>
                  <Label htmlFor="previousDeals">Previous Deals/Clients</Label>
                  <Input
                    id="previousDeals"
                    value={formData.previousDeals}
                    onChange={(e) => handleInputChange('previousDeals', e.target.value)}
                    placeholder="Notable clients or deal sizes"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  placeholder="ISO, CE, FDA, etc."
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="targetMarkets">Target Markets</Label>
                <Textarea
                  id="targetMarkets"
                  value={formData.targetMarkets}
                  onChange={(e) => handleInputChange('targetMarkets', e.target.value)}
                  placeholder="Countries/regions you want to export to"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Any other relevant information"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Partnership Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerPartnershipForm;
