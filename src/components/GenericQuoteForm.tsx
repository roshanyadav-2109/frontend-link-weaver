
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

// Base schema for common fields
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().optional(),
  product_name: z.string().min(1, "Product name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().min(1, "Unit is required"),
  additional_details: z.string().optional(),
});

// Advanced schema with additional fields
const advancedSchema = baseSchema.extend({
  delivery_address: z.string().optional(),
  delivery_country: z.string().optional(),
  delivery_timeline: z.string().optional(),
  payment_terms: z.string().optional(),
  packaging_requirements: z.string().optional(),
  quality_standards: z.string().optional(),
  sample_required: z.boolean().optional(),
  estimated_budget: z.string().optional(),
  shipping_terms: z.string().optional(),
  priority_level: z.string().optional(),
  specifications: z.object({
    color: z.string().optional(),
    size: z.string().optional(),
    material: z.string().optional(),
    finish: z.string().optional(),
  }).optional(),
  customization_requirements: z.string().optional(),
  technical_requirements: z.string().optional(),
  compliance_requirements: z.string().optional(),
  volume_requirements: z.string().optional(),
  frequency_of_orders: z.string().optional(),
  target_price_range: z.string().optional(),
  sample_requirements: z.string().optional(),
  testing_requirements: z.string().optional(),
});

interface GenericQuoteFormProps {
  isAdvanced: boolean;
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const GenericQuoteForm: React.FC<GenericQuoteFormProps> = ({ 
  isAdvanced, 
  productId, 
  productName = '', 
  onSuccess,
  onClose 
}) => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const schema = isAdvanced ? advancedSchema : baseSchema;
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      product_name: productName,
      unit: 'pieces',
      priority_level: 'normal',
      sample_required: false,
      specifications: {
        color: '',
        size: '',
        material: '',
        finish: '',
      }
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('Please sign in to submit a quote request');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for quote_requests table
      const quoteData = {
        user_id: user.id,
        product_id: productId || null,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || null,
        product_name: data.product_name,
        quantity: data.quantity,
        unit: data.unit,
        additional_details: data.additional_details || null,
        status: 'pending'
      };

      // Add advanced fields if this is an advanced form
      if (isAdvanced) {
        Object.assign(quoteData, {
          delivery_address: data.delivery_address,
          delivery_country: data.delivery_country,
          delivery_timeline: data.delivery_timeline,
          payment_terms: data.payment_terms,
          packaging_requirements: data.packaging_requirements,
          quality_standards: data.quality_standards,
          sample_required: data.sample_required,
          estimated_budget: data.estimated_budget,
          shipping_terms: data.shipping_terms,
          priority_level: data.priority_level,
        });
      }

      const { data: quoteResult, error: quoteError } = await supabase
        .from('quote_requests')
        .insert(quoteData)
        .select()
        .single();

      if (quoteError) throw quoteError;

      // If advanced form, also create product inquiry
      if (isAdvanced && quoteResult) {
        const { error: inquiryError } = await supabase
          .from('product_inquiries')
          .insert({
            user_id: user.id,
            product_id: productId || null,
            inquiry_type: 'advanced_quote',
            specifications: data.specifications,
            customization_requirements: data.customization_requirements,
            technical_requirements: data.technical_requirements,
            compliance_requirements: data.compliance_requirements,
            volume_requirements: data.volume_requirements,
            frequency_of_orders: data.frequency_of_orders,
            target_price_range: data.target_price_range,
            sample_requirements: data.sample_requirements,
            testing_requirements: data.testing_requirements,
            status: 'pending'
          });

        if (inquiryError) throw inquiryError;
      }

      toast.success('Quote request submitted successfully!');
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBasicFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+91 XXXXXXXXXX"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            {...register('company')}
            placeholder="Your company name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="product_name">Product Name *</Label>
        <Input
          id="product_name"
          {...register('product_name')}
          placeholder="What product are you interested in?"
        />
        {errors.product_name && <p className="text-red-500 text-sm">{errors.product_name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            {...register('quantity')}
            placeholder="100"
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>
        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            {...register('unit')}
            placeholder="pieces, kg, tons, etc."
          />
          {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="additional_details">Additional Details</Label>
        <Textarea
          id="additional_details"
          {...register('additional_details')}
          placeholder="Any specific requirements, delivery timeline, or other details..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderAdvancedFields = () => {
    if (!isAdvanced) return null;

    const steps = [
      { number: 1, title: 'Basic Information' },
      { number: 2, title: 'Requirements' },
      { number: 3, title: 'Quality & Compliance' },
      { number: 4, title: 'Delivery & Payment' }
    ];

    return (
      <div className="space-y-6">
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
                {step.number}
              </div>
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderBasicFields()}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Color</Label>
                    <Input {...register('specifications.color')} />
                  </div>
                  <div>
                    <Label>Size/Dimensions</Label>
                    <Input {...register('specifications.size')} />
                  </div>
                  <div>
                    <Label>Material</Label>
                    <Input {...register('specifications.material')} />
                  </div>
                  <div>
                    <Label>Finish</Label>
                    <Input {...register('specifications.finish')} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label>Customization Requirements</Label>
              <Textarea {...register('customization_requirements')} />
            </div>
            <div>
              <Label>Technical Requirements</Label>
              <Textarea {...register('technical_requirements')} />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <Label>Quality Standards</Label>
              <Textarea {...register('quality_standards')} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sample_required"
                checked={watchedValues.sample_required}
                onCheckedChange={(checked) => setValue('sample_required', checked)}
              />
              <Label htmlFor="sample_required">Sample Required</Label>
            </div>
            {watchedValues.sample_required && (
              <div>
                <Label>Sample Requirements</Label>
                <Textarea {...register('sample_requirements')} />
              </div>
            )}
            <div>
              <Label>Testing Requirements</Label>
              <Textarea {...register('testing_requirements')} />
            </div>
            <div>
              <Label>Compliance Requirements</Label>
              <Textarea {...register('compliance_requirements')} />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Delivery Country</Label>
                <Input {...register('delivery_country')} />
              </div>
              <div>
                <Label>Estimated Budget</Label>
                <Input {...register('estimated_budget')} placeholder="e.g., $10,000 - $50,000" />
              </div>
            </div>
            <div>
              <Label>Delivery Address</Label>
              <Textarea {...register('delivery_address')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Delivery Timeline</Label>
                <Select onValueChange={(value) => setValue('delivery_timeline', value)}>
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
              <div>
                <Label>Payment Terms</Label>
                <Select onValueChange={(value) => setValue('payment_terms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advance">100% Advance</SelectItem>
                    <SelectItem value="50-50">50% Advance, 50% on Delivery</SelectItem>
                    <SelectItem value="30-70">30% Advance, 70% on Delivery</SelectItem>
                    <SelectItem value="letter-of-credit">Letter of Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Request a Quote</h3>
        <p className="text-gray-600 mb-6">Fill out the form below and we'll get back to you with a detailed quote</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {isAdvanced ? renderAdvancedFields() : renderBasicFields()}

        <div className="flex gap-4 pt-4">
          {(!isAdvanced || currentStep === 4) && (
            <Button type="submit" disabled={loading} className="w-full bg-brand-blue hover:bg-brand-blue/90">
              {loading ? 'Submitting...' : 'Submit Quote Request'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GenericQuoteForm;
