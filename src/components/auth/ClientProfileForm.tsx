
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const companyTypes = [
  'Private Limited',
  'Public Limited',
  'Partnership',
  'Sole Proprietorship',
  'LLP',
  'Other'
];

const registeredClientSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  representativeName: z.string().min(2, "Representative name is required"),
  contactNumber: z.string().min(10, "Valid contact number is required").max(15),
  location: z.string().min(2, "Location is required"),
});

const individualClientSchema = z.object({
  representativeName: z.string().min(2, "Name is required"),
  contactNumber: z.string().min(10, "Valid contact number is required").max(15),
  location: z.string().min(2, "Location is required"),
});

const ClientProfileForm = () => {
  const [isRegistered, setIsRegistered] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const registeredForm = useForm<z.infer<typeof registeredClientSchema>>({
    resolver: zodResolver(registeredClientSchema),
    defaultValues: {
      companyName: '',
      companyType: '',
      representativeName: '',
      contactNumber: '',
      location: '',
    }
  });

  const individualForm = useForm<z.infer<typeof individualClientSchema>>({
    resolver: zodResolver(individualClientSchema),
    defaultValues: {
      representativeName: '',
      contactNumber: '',
      location: '',
    }
  });

  const onSubmitRegistered = async (values: z.infer<typeof registeredClientSchema>) => {
    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.representativeName,
          company_name: values.companyName,
          phone: values.contactNumber,
          address: values.location,
          user_type: 'client',
        })
        .eq('id', user.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          business_type: values.companyType,
        });

      if (clientError) {
        toast.error(clientError.message);
        return;
      }

      toast.success("Profile completed successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitIndividual = async (values: z.infer<typeof individualClientSchema>) => {
    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.representativeName,
          phone: values.contactNumber,
          address: values.location,
          user_type: 'client',
        })
        .eq('id', user.id);

      if (profileError) {
        toast.error(profileError.message);
        return;
      }

      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          business_type: 'Individual',
        });

      if (clientError) {
        toast.error(clientError.message);
        return;
      }

      toast.success("Profile completed successfully!");
      navigate('/dashboard');
    } catch (error) {
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 shadow rounded-lg">
      <h1 className="text-xl font-bold mb-6 text-center">Complete Your Client Profile</h1>
      
      {/* Company Registration Status */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Is your company registered?
        </Label>
        <RadioGroup value={isRegistered} onValueChange={setIsRegistered} className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="registered" />
            <Label htmlFor="registered" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="individual" />
            <Label htmlFor="individual" className="cursor-pointer">No / Individual</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Registered Company Form */}
      {isRegistered === 'yes' && (
        <Form {...registeredForm}>
          <form onSubmit={registeredForm.handleSubmit(onSubmitRegistered)} className="space-y-4">
            <FormField
              control={registeredForm.control}
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
              control={registeredForm.control}
              name="companyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companyTypes.map((type) => (
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
              control={registeredForm.control}
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
              control={registeredForm.control}
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
              control={registeredForm.control}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Complete Profile'}
            </Button>
          </form>
        </Form>
      )}

      {/* Individual/Non-Registered Form */}
      {isRegistered === 'no' && (
        <Form {...individualForm}>
          <form onSubmit={individualForm.handleSubmit(onSubmitIndividual)} className="space-y-4">
            <FormField
              control={individualForm.control}
              name="representativeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={individualForm.control}
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
              control={individualForm.control}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Complete Profile'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ClientProfileForm;
