import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { NotificationService } from '@/services/notificationService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Package, Truck, CreditCard, Shield, Clock, Target } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  image: string;
}

interface AdvancedQuoteFormProps {
  product: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

const AdvancedQuoteForm: React.FC<AdvancedQuoteFormProps> = ({ product, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic Information
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    company: user?.user_metadata?.company || '',
    
    // Product Requirements
    quantity: '',
    unit: 'pieces',
    customization_requirements: '',
    technical_requirements: '',
    specifications: {
      color: '',
      size: '',
      material: '',
      finish: '',
      packaging: ''
    },
    
    // Business Requirements
    volume_requirements: '',
    frequency_of_orders: '',
    target_price_range: '',
    estimated_budget: '',
    
    // Quality & Compliance
    quality_standards: '',
    compliance_requirements: '',
    sample_required: false,
    sample_requirements: '',
    testing_requirements: '',
    required_certifications: [] as string[],
    
    // Delivery & Logistics
    delivery_address: '',
    delivery_country: '',
    delivery_timeline: '',
    shipping_terms: '',
    packaging_requirements: '',
    
    // Payment & Terms
    payment_terms: '',
    priority_level: 'normal',
    
    // Additional Details
    additional_details: ''
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('specifications.')) {
      const specField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      required_certifications: prev.required_certifications.includes(cert)
        ? prev.required_certifications.filter(c => c !== cert)
        : [...prev.required_certifications, cert]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please login to submit a quote request');
      return;
    }

    if (!formData.name || !formData.email || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create both a quote request and a detailed product inquiry
      const { data: quoteData, error: quoteError } = await supabase
        .from('quote_requests')
        .insert({
          user_id: user.id,
          product_id: product.id,
          product_name: product.name,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          quantity: formData.quantity,
          unit: formData.unit,
          additional_details: formData.additional_details,
          delivery_address: formData.delivery_address,
          delivery_country: formData.delivery_country,
          delivery_timeline: formData.delivery_timeline,
          payment_terms: formData.payment_terms,
          packaging_requirements: formData.packaging_requirements,
          quality_standards: formData.quality_standards,
          sample_required: formData.sample_required,
          estimated_budget: formData.estimated_budget,
          shipping_terms: formData.shipping_terms,
          priority_level: formData.priority_level,
          status: 'pending'
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create detailed product inquiry
      const { error: inquiryError } = await supabase
        .from('product_inquiries')
        .insert({
          user_id: user.id,
          product_id: product.id,
          inquiry_type: 'advanced_quote',
          specifications: formData.specifications,
          customization_requirements: formData.customization_requirements,
          technical_requirements: formData.technical_requirements,
          compliance_requirements: formData.compliance_requirements,
          volume_requirements: formData.volume_requirements,
          frequency_of_orders: formData.frequency_of_orders,
          target_price_range: formData.target_price_range,
          sample_requirements: formData.sample_requirements,
          testing_requirements: formData.testing_requirements,
          status: 'pending'
        });

      if (inquiryError) throw inquiryError;

      // Send notifications
      if (quoteData) {
        await NotificationService.notifyQuoteCreated(user.id, product.name, quoteData.id);
        await NotificationService.notifyAdminNewQuote(product.name, formData.name);
      }

      toast.success('Quote request submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Information', icon: <Package className="w-4 h-4" /> },
    { number: 2, title: 'Requirements', icon: <Target className="w-4 h-4" /> },
    { number: 3, title: 'Quality & Compliance', icon: <Shield className="w-4 h-4" /> },
    { number: 4, title: 'Delivery & Payment', icon: <Truck className="w-4 h-4" /> }
  ];

  const certificationOptions = [
    'ISO 9001', 'ISO 14001', 'CE Marking', 'FDA Approved', 'OEKO-TEX',
    'GOTS', 'BRC', 'GMP', 'HACCP', 'Halal', 'Kosher'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Request Quote</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category} • {product.subcategory}</p>
                <p className="text-lg font-bold text-brand-teal">{product.price}</p>
              </div>
            </div>
          </div>

          {/* Step Navigator */}
          <div className="flex justify-between mb-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-2 cursor-pointer ${
                  currentStep >= step.number ? 'text-brand-blue' : 'text-gray-400'
                }`}
                onClick={() => setCurrentStep(step.number)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= step.number ? 'border-brand-blue bg-brand-blue text-white' : 'border-gray-300'
                }`}>
                  {step.icon}
                </div>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="containers">Containers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estimated_budget">Estimated Budget</Label>
                  <Input
                    id="estimated_budget"
                    placeholder="e.g., $10,000 - $50,000"
                    value={formData.estimated_budget}
                    onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Requirements */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Product Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.specifications.color}
                        onChange={(e) => handleInputChange('specifications.color', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="size">Size/Dimensions</Label>
                      <Input
                        id="size"
                        value={formData.specifications.size}
                        onChange={(e) => handleInputChange('specifications.size', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.specifications.material}
                        onChange={(e) => handleInputChange('specifications.material', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="finish">Finish</Label>
                      <Input
                        id="finish"
                        value={formData.specifications.finish}
                        onChange={(e) => handleInputChange('specifications.finish', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="volume_requirements">Volume Requirements</Label>
                  <Textarea
                    id="volume_requirements"
                    placeholder="Describe your volume requirements..."
                    value={formData.volume_requirements}
                    onChange={(e) => handleInputChange('volume_requirements', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="frequency_of_orders">Order Frequency</Label>
                  <Select value={formData.frequency_of_orders} onValueChange={(value) => handleInputChange('frequency_of_orders', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time order</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="bi-annually">Bi-annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="customization_requirements">Customization Requirements</Label>
                <Textarea
                  id="customization_requirements"
                  placeholder="Describe any customization needed..."
                  value={formData.customization_requirements}
                  onChange={(e) => handleInputChange('customization_requirements', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="technical_requirements">Technical Requirements</Label>
                <Textarea
                  id="technical_requirements"
                  placeholder="Specify technical requirements, standards, etc..."
                  value={formData.technical_requirements}
                  onChange={(e) => handleInputChange('technical_requirements', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Quality & Compliance */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="quality_standards">Quality Standards</Label>
                <Textarea
                  id="quality_standards"
                  placeholder="Specify required quality standards..."
                  value={formData.quality_standards}
                  onChange={(e) => handleInputChange('quality_standards', e.target.value)}
                />
              </div>

              <div>
                <Label>Required Certifications</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {certificationOptions.map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox
                        id={cert}
                        checked={formData.required_certifications.includes(cert)}
                        onCheckedChange={() => handleCertificationToggle(cert)}
                      />
                      <Label htmlFor={cert} className="text-sm">{cert}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sample_required"
                  checked={formData.sample_required}
                  onCheckedChange={(checked) => handleInputChange('sample_required', checked)}
                />
                <Label htmlFor="sample_required">Sample Required</Label>
              </div>

              {formData.sample_required && (
                <div>
                  <Label htmlFor="sample_requirements">Sample Requirements</Label>
                  <Textarea
                    id="sample_requirements"
                    placeholder="Describe sample requirements..."
                    value={formData.sample_requirements}
                    onChange={(e) => handleInputChange('sample_requirements', e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="testing_requirements">Testing Requirements</Label>
                <Textarea
                  id="testing_requirements"
                  placeholder="Specify any testing requirements..."
                  value={formData.testing_requirements}
                  onChange={(e) => handleInputChange('testing_requirements', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="compliance_requirements">Compliance Requirements</Label>
                <Textarea
                  id="compliance_requirements"
                  placeholder="Specify compliance requirements (FDA, CE, etc.)..."
                  value={formData.compliance_requirements}
                  onChange={(e) => handleInputChange('compliance_requirements', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Delivery & Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery_country">Delivery Country</Label>
                  <Input
                    id="delivery_country"
                    value={formData.delivery_country}
                    onChange={(e) => handleInputChange('delivery_country', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery_timeline">Delivery Timeline</Label>
                  <Select value={formData.delivery_timeline} onValueChange={(value) => handleInputChange('delivery_timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                      <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
                      <SelectItem value="flexible">Flexible (1-2 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (3+ months)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="delivery_address">Delivery Address</Label>
                <Textarea
                  id="delivery_address"
                  placeholder="Enter complete delivery address..."
                  value={formData.delivery_address}
                  onChange={(e) => handleInputChange('delivery_address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping_terms">Shipping Terms</Label>
                  <Select value={formData.shipping_terms} onValueChange={(value) => handleInputChange('shipping_terms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                      <SelectItem value="CIF">CIF (Cost, Insurance, Freight)</SelectItem>
                      <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                      <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                      <SelectItem value="DAP">DAP (Delivered at Place)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Select value={formData.payment_terms} onValueChange={(value) => handleInputChange('payment_terms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="advance">100% Advance</SelectItem>
                      <SelectItem value="50-50">50% Advance, 50% on Delivery</SelectItem>
                      <SelectItem value="30-70">30% Advance, 70% on Delivery</SelectItem>
                      <SelectItem value="letter-of-credit">Letter of Credit</SelectItem>
                      <SelectItem value="net-30">Net 30 Days</SelectItem>
                      <SelectItem value="net-60">Net 60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="packaging_requirements">Packaging Requirements</Label>
                <Textarea
                  id="packaging_requirements"
                  placeholder="Specify packaging requirements..."
                  value={formData.packaging_requirements}
                  onChange={(e) => handleInputChange('packaging_requirements', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="priority_level">Priority Level</Label>
                <Select value={formData.priority_level} onValueChange={(value) => handleInputChange('priority_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="normal">Normal Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additional_details">Additional Requirements</Label>
                <Textarea
                  id="additional_details"
                  placeholder="Any additional information or special requirements..."
                  value={formData.additional_details}
                  onChange={(e) => handleInputChange('additional_details', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedQuoteForm;
