
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const manufacturerRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  companyName: z.string().min(2, "Company name required"),
  gstin: z.string().optional(),
  location: z.string(),
  productTypes: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword']
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const forgotSchema = z.object({
  email: z.string().email()
});

const ManufacturerAuth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [showForgot, setShowForgot] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const { signInWithGoogle, isAuthenticated, loading, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/manufacturer/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const registerForm = useForm<z.infer<typeof manufacturerRegisterSchema>>({
    resolver: zodResolver(manufacturerRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      gstin: '',
      location: '',
      productTypes: ''
    }
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' }
  });

  // Registration handler
  async function onRegister(values: z.infer<typeof manufacturerRegisterSchema>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            user_type: 'manufacturer',
            company_name: values.companyName,
            gstin: values.gstin,
            location: values.location,
            product_types: values.productTypes
          },
          emailRedirectTo: `${window.location.origin}/auth/manufacturer`
        }
      });
      if (error) return toast.error(error.message);
      if (data.user) {
        setShowConfirmation(true);
        setConfirmationEmail(values.email);
        toast.success('Check your email to confirm!');
      }
    } catch {
      toast.error('Registration failed.');
    }
  }

  // Login handler
  async function onLogin(values: z.infer<typeof loginSchema>) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      if (error) {
        if (error.message === "Email not confirmed") {
          setShowConfirmation(true);
          setConfirmationEmail(values.email);
          toast.error("Please confirm your email.");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success('Logged in!');
    } catch {
      toast.error('Login failed.');
    }
  }

  // Forgot password handler
  async function onForgot(values: z.infer<typeof forgotSchema>) {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/auth/manufacturer`
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent!");
      setShowForgot(false);
    }
  }

  const handleResend = async () => {
    if (confirmationEmail) await resendConfirmationEmail(confirmationEmail);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-lg font-bold mb-5 text-center">{isRegister ? 'Sign Up (Manufacturer)' : (showForgot ? "Reset Password" : 'Sign In (Manufacturer)')}</h1>
        {showConfirmation && (
          <div className="mb-4 text-sm bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded">
            Please check your inbox for a confirmation link.
            <Button variant="link" onClick={handleResend} className="ml-1 p-0 h-auto align-middle text-yellow-900">Resend</Button>
          </div>
        )}
        {isRegister ? (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3">
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Confirm</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={registerForm.control}
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
                control={registerForm.control}
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
                control={registerForm.control}
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
                control={registerForm.control}
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
              <Button type="submit" className="w-full">Sign Up</Button>
            </form>
          </Form>
        ) : showForgot ? (
          <Form {...forgotForm}>
            <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-3">
              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          </Form>
        ) : (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-3">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
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
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </Form>
        )}
        <div className="mt-4 flex flex-col items-center gap-2">
          {!showForgot && (
            <button onClick={() => setShowForgot(true)} className="text-xs text-gray-500 hover:underline focus:outline-none">
              Forgot password?
            </button>
          )}
          {!showForgot && (
            <button onClick={() => setIsRegister((r) => !r)} className="text-xs text-gray-600 hover:underline mt-1">
              {isRegister ? "Already have an account? Sign In" : "No account? Sign Up"}
            </button>
          )}
          {showForgot && (
            <button onClick={() => setShowForgot(false)} className="text-xs text-gray-600 hover:underline mt-1">
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerAuth;
