
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
  contact_person: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  company_name: z.string().min(2, { message: 'Company name is required.' }),
  product_category: z.string().min(1, { message: 'Please select a product category.' }),
  requirements: z.string().optional(),
  quantity_range: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
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

export function CatalogForm({ onSuccess }: CatalogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof catalogFormSchema>>({
    resolver: zodResolver(catalogFormSchema),
    defaultValues: {
      contact_person: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: '',
      company_name: user?.user_metadata?.company_name || '',
      product_category: '',
      requirements: '',
      quantity_range: '',
      budget_range: '',
      timeline: '',
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
          contact_person: values.contact_person,
          email: values.email,
          phone: values.phone,
          company_name: values.company_name,
          product_category: values.product_category,
          requirements: values.requirements || null,
          quantity_range: values.quantity_range || null,
          budget_range: values.budget_range || null,
          timeline: values.timeline || null,
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
            name="contact_person"
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
            name="company_name"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Range</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quantity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-100">1-100 units</SelectItem>
                    <SelectItem value="100-1000">100-1,000 units</SelectItem>
                    <SelectItem value="1000-10000">1,000-10,000 units</SelectItem>
                    <SelectItem value="10000+">10,000+ units</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5000-25000">$5,000 - $25,000</SelectItem>
                    <SelectItem value="25000-100000">$25,000 - $100,000</SelectItem>
                    <SelectItem value="100000+">$100,000+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="6-months">Within 6 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe your specific product requirements, certifications needed, quality standards, or any other details..."
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
