
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const manufacturerProfileSchema = z.object({
  companyName: z.string().min(2, "Company name required"),
  gstin: z.string().optional(),
  location: z.string(),
  productTypes: z.string(),
  phone: z.string().min(10).max(15),
});

const UpdateProfileManufacturer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof manufacturerProfileSchema>>({
    resolver: zodResolver(manufacturerProfileSchema),
    defaultValues: {
      companyName: "",
      gstin: "",
      location: "",
      productTypes: "",
      phone: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof manufacturerProfileSchema>) => {
    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    const { error } = await supabase.from("profiles").update({
      company_name: values.companyName,
      gstin: values.gstin,
      address: values.location,
      // Could store product types as a comma-separated string for now
      phone: values.phone
    }).eq("id", user.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated!");
      navigate("/manufacturer/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-lg font-bold mb-4 text-center">Complete Your Profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Types (comma separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Update Profile</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfileManufacturer;
