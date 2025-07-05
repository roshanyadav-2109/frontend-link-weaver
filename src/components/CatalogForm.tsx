
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

const catalogFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  company: z.string().min(2, { message: 'Company name is required.' }),
  product_category: z.string().min(1, { message: 'Please select a product category.' }),
  specific_products: z.string().optional(),
  business_type: z.string().optional(),
  additional_requirements: z.string().optional(),
});

type CatalogFormProps = {
  onSuccess?: () => void;
};

const productCategories = [
  'Agriculture & Food',
  'Apparel & Fashion',
  'Auto & Transportation',
  'Beauty & Personal Care',
  'Chemicals',
  'Consumer Electronics',
  'Gifts & Crafts',
  'Health & Medical',
  'Home & Garden',
  'Industrial Equipment',
  'Jewelry & Accessories',
  'Machinery',
  'Packaging & Printing',
  'Sports & Entertainment',
  'Textiles & Leather',
  'Toys & Hobbies',
  'Other'
];

const businessTypes = [
  'Manufacturer',
  'Trader',
  'Retailer',
  'Wholesaler',
  'Importer',
  'Exporter',
  'Service Provider',
  'Other'
];

export function CatalogForm({ onSuccess }: CatalogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof catalogFormSchema>>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      company: user?.user_metadata?.company_name || '',
      product_category: '',
      specific_products: '',
      business_type: '',
      additional_requirements: '',
    },
  });

  async function onSubmit(values: z.infer<typeof catalogFormSchema>) {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting catalog request:', values);
      
      const { data, error } = await supabase
        .from('catalog_requests')
        .insert({
          user_id: user?.id || null,
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          product_category: values.product_category,
          specific_products: values.specific_products || null,
          business_type: values.business_type || null,
          additional_requirements: values.additional_requirements || null,
          status: 'pending'
        })
        .select();

      if (error) {
        console.error('Error submitting catalog request:', error);
        toast.error('Failed to submit catalog request. Please try again.');
        return;
      }

      console.log('Catalog request submitted successfully:', data);
      toast.success('Catalog request submitted successfully! We will send you the catalog soon.');
      form.reset();
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person*</FormLabel>
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
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Your Company Ltd." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="product_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Category*</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
          name="business_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
          name="specific_products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Products of Interest</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please specify the products you're interested in..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additional_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe any additional requirements, certifications needed, quality standards, or other details..."
                  className="min-h-[120px]"
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
          {isSubmitting ? 'Submitting Request...' : 'Request Catalog'}
        </Button>
      </form>
    </Form>
  );
}
