
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const productTypes = [
  'Electronics',
  'Textiles',
  'Automotive Parts',
  'Pharmaceuticals',
  'Food & Beverages',
  'Chemicals',
  'Machinery',
  'Other'
];

const manufacturerProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  gstin: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  representativeName: z.string().min(2, "Representative name is required"),
  contactNumber: z.string().min(10, "Valid contact number is required").max(15),
  productType: z.string().min(1, "Product type is required"),
  otherProductType: z.string().optional(),
});

const ManufacturerProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof manufacturerProfileSchema>>({
    resolver: zodResolver(manufacturerProfileSchema),
    defaultValues: {
      companyName: '',
      gstin: '',
      location: '',
      representativeName: '',
      contactNumber: '',
      productType: '',
      otherProductType: '',
    }
  });

  const watchProductType = form.watch('productType');

  const onSubmit = async (values: z.infer<typeof manufacturerProfileSchema>) => {
    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    setLoading(true);
    try {
      const productCategories = values.productType === 'Other' && values.otherProductType 
        ? [values.otherProductType] 
        : [values.productType];

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.representativeName,
          company_name: values.companyName,
          phone: values.contactNumber,
          address: values.location,
          user_type: 'manufacturer',
          gstin: values.gstin || null,
        })
        .eq('id', user.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      const { error: manufacturerError } = await supabase
        .from('manufacturers')
        .insert({
          user_id: user.id,
          business_type: 'Manufacturing',
          product_categories: productCategories,
        });

      if (manufacturerError) {
        toast.error(manufacturerError.message);
        return;
      }

      toast.success("Profile completed successfully!");
      navigate('/manufacturer/dashboard');
    } catch (error) {
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 shadow rounded-lg">
      <h1 className="text-xl font-bold mb-6 text-center">Complete Your Manufacturer Profile</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter company name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gstin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GSTIN Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="15AADCT1234C1Z5 (Optional)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City, State" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="representativeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Representative Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter representative name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+91 XXXXX XXXXX" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Product Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {productTypes.map((type) => (
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

          {watchProductType === 'Other' && (
            <FormField
              control={form.control}
              name="otherProductType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Product Type *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your product type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Complete Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ManufacturerProfileForm;
