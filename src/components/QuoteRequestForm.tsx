
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const quoteRequestSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  company: z.string().optional(),
  product_name: z.string().min(1, { message: 'Product name is required.' }),
  quantity: z.string().min(1, { message: 'Please specify the quantity.' }),
  unit: z.string().min(1, { message: 'Unit is required.' }),
  additional_details: z.string().optional(),
});

type QuoteRequestFormProps = {
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  userId?: string;
};

export function QuoteRequestForm({ 
  productId,
  productName = '',
  onSuccess,
  userId
}: QuoteRequestFormProps) {
  const form = useForm<z.infer<typeof quoteRequestSchema>>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      product_name: productName,
      quantity: '',
      unit: 'units',
      additional_details: '',
    },
  });

  async function onSubmit(values: z.infer<typeof quoteRequestSchema>) {
    if (!userId) {
      toast.error('You must be logged in to submit a quote request.');
      return;
    }
    
    try {
      console.log('Submitting quote request:', values);
      
      const quoteRequestData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company || null,
        product_id: productId || null,
        product_name: values.product_name,
        quantity: values.quantity,
        unit: values.unit,
        additional_details: values.additional_details || null,
        status: 'pending',
        user_id: userId
      };

      const { data, error } = await supabase
        .from('quote_requests')
        .insert(quoteRequestData)
        .select();

      if (error) {
        console.error('Error submitting quote request:', error);
        toast.error('Failed to submit quote request. Please try again.');
        return;
      }

      console.log('Quote request submitted successfully:', data);
      toast.success('Quote request submitted successfully! We will get back to you soon.');
      form.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name*</FormLabel>
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
          name="product_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name*</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity*</FormLabel>
                <FormControl>
                  <Input placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit*</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="liters">Liters</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="tons">Tons</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="containers">Containers</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additional_details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide any specific requirements, specifications, or questions you have about the product."
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
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Request Quote'}
        </Button>
      </form>
    </Form>
  );
}
