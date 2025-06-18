
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';

const manufacturerProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  companyName: z.string().min(2, 'Company name is required'),
  gstin: z.string().optional(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  businessType: z.string().optional(),
  productCategories: z.string().optional(),
  certifications: z.string().optional(),
});

const ManufacturerProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof manufacturerProfileSchema>>({
    resolver: zodResolver(manufacturerProfileSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      gstin: '',
      phone: '',
      address: '',
      city: '',
      country: 'India',
      businessType: '',
      productCategories: '',
      certifications: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof manufacturerProfileSchema>) => {
    if (!user) {
      toast.error('You must be signed in to complete your profile');
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          company_name: values.companyName,
          gstin: values.gstin,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country,
          user_type: 'manufacturer',
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        toast.error('Failed to update profile');
        return;
      }

      // Create manufacturer-specific record
      const { error: manufacturerError } = await supabase
        .from('manufacturers')
        .insert({
          user_id: user.id,
          business_type: values.businessType,
          product_categories: values.productCategories ? values.productCategories.split(',').map(cat => cat.trim()) : [],
          certifications: values.certifications ? values.certifications.split(',').map(cert => cert.trim()) : [],
          export_experience: true,
        });

      if (manufacturerError) {
        console.error('Manufacturer record error:', manufacturerError);
        // Don't fail the whole process if this fails
      }

      toast.success('Profile completed successfully!');
      navigate('/manufacturer/dashboard');
    } catch (error) {
      console.error('Error completing profile:', error);
      toast.error('An error occurred while completing your profile');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-2xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
            Complete Your Manufacturer Profile
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Help us understand your business better to provide tailored solutions
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Manufacturing Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gstin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GSTIN</FormLabel>
                      <FormControl>
                        <Input placeholder="22AAAAA0000A1Z5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Complete business address"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="India" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Manufacturing, Trading, Export" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productCategories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Categories</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Textiles, Electronics, Chemical (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ISO 9001, CE, FDA (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-blue/90 hover:to-brand-teal/90 text-white py-3 text-lg font-semibold"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerProfileForm;
