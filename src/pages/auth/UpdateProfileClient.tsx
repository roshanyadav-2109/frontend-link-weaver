
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

const clientProfileSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  phone: z.string().min(10).max(15),
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional()
});

const UpdateProfileClient = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof clientProfileSchema>>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      companyName: "",
      address: "",
      city: "",
      country: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof clientProfileSchema>) => {
    if (!user) {
      toast.error("You must be signed in");
      return;
    }

    const { error } = await supabase.from("profiles").update({
      full_name: values.fullName,
      phone: values.phone,
      company_name: values.companyName,
      address: values.address,
      city: values.city,
      country: values.country
    }).eq("id", user.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated!");
      navigate("/");
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Country</FormLabel>
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

export default UpdateProfileClient;
