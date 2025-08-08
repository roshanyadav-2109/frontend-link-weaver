import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client'; // Make sure this import path is correct for your project
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/stores/authStore'; // Assuming you have this for state management
import { useNavigate } from 'react-router-dom'; // Or your router's equivalent

// 1. Define the validation schema for the login form.
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Infer the TypeScript type from the schema for type safety
type LoginFormData = z.infer<typeof LoginSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    setAuthError(null);

    // Step 1: Attempt to sign in the user with their credentials
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (sessionError) {
      setAuthError(sessionError.message);
      setIsLoading(false);
      return;
    }

    if (!sessionData.user) {
      setAuthError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      return;
    }

    // Step 2: IMPORTANT - Verify if the logged-in user has the 'admin' role
    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

    if (rpcError || !isAdmin) {
      // If the RPC call fails or the user is not an admin, sign them out immediately.
      await supabase.auth.signOut();
      setAuthError("Access Denied: You are not an authorized administrator.");
      setIsLoading(false);
      return;
    }

    // Step 3: If verification passes, fetch the admin's profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionData.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      setAuthError("Could not retrieve admin profile.");
      setIsLoading(false);
      return;
    }
    
    // Step 4: Update the global state and redirect to the admin dashboard
    setUser(sessionData.user);
    setProfile(profileData);
    setIsLoading(false);
    navigate('/admin/dashboard'); // Redirect to your admin dashboard
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Admin Login</h1>
        <p className="text-gray-500">Enter your credentials to access the dashboard.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {authError && (
            <div className="text-sm font-medium text-red-500">{authError}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminLogin;
