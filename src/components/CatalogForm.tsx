
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

const catalogSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  company: z.string().optional(),
  product_category: z.string().min(1, { message: 'Please select a product category.' }),
  specific_products: z.string().optional(),
  business_type: z.string().optional(),
  additional_requirements: z.string().optional(),
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

const businessTypes = [
  'Manufacturer',
  'Distributor',
  'Retailer',
  'Importer/Exporter',
  'Wholesaler',
  'E-commerce',
  'Other'
];

const EMAIL_ENDPOINT = "https://lusfthgqlkgktplplqnv.functions.supabase.co/send-form-email";

const CatalogForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof catalogSchema>>({
    resolver: zodResolver(catalogSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      product_category: '',
      specific_products: '',
      business_type: '',
      additional_requirements: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof catalogSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log('Submitting catalog request:', values);
      
      // Save to database
      const catalogData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company || null,
        product_category: values.product_category,
        specific_products: values.specific_products || null,
        business_type: values.business_type || null,
        additional_requirements: values.additional_requirements || null,
        status: 'pending',
        user_id: user?.id || null
      };

      const { data, error } = await supabase
        .from('catalog_requests')
        .insert(catalogData)
        .select();

      if (error) {
        console.error('Error submitting catalog request to database:', error);
        toast.error('Failed to submit catalog request. Please try again.');
        return;
      }

      console.log('Catalog request saved to database:', data);

      // Send email notification
      try {
        const emailPayload = {
          type: "catalog",
          ...values,
          company: values.company || 'Not provided',
          specific_products: values.specific_products || 'Not specified',
          business_type: values.business_type || 'Not specified',
          additional_requirements: values.additional_requirements || 'None provided'
        };

        console.log('Sending email with payload:', emailPayload);

        const emailResponse = await fetch(EMAIL_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        const emailResult = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log('Email sent successfully:', emailResult);
          toast.success('Catalog request submitted successfully! We will send you the catalog soon.');
        } else {
          console.error('Email sending failed:', emailResult);
          toast.warning('Catalog request saved but email notification failed. We have received your request.');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        toast.warning('Catalog request saved but email notification failed. We have received your request.');
      }

      form.reset();
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name*</FormLabel>
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
                  <Input placeholder="+91 98765 43210" {...field} />
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
                <FormLabel>Company Name</FormLabel>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="specific_products"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Products</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cotton T-shirts, Electronic Components" {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="additional_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Requirements</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please specify any additional requirements or information..."
                  className="min-h-[100px]"
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
          {isSubmitting ? 'Submitting...' : 'Request Catalog'}
        </Button>
      </form>
    </Form>
  );
};

export default CatalogForm;
