
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
import { Separator } from '@/components/ui/separator';

const clientRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  companyType: z.enum(['registered', 'non-registered']),
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

const ClientAuth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [showForgot, setShowForgot] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  const { signInWithGoogle, isAuthenticated, loading, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const registerForm = useForm<z.infer<typeof clientRegisterSchema>>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      companyType: 'registered'
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
  async function onRegister(values: z.infer<typeof clientRegisterSchema>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { user_type: 'client', company_type: values.companyType },
          emailRedirectTo: `${window.location.origin}/auth/client`
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
      redirectTo: `${window.location.origin}/auth/client`
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

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-auto bg-white p-6 shadow rounded">
        <h1 className="text-lg font-bold mb-5 text-center">{isRegister ? 'Sign Up (Client)' : (showForgot ? "Reset Password" : 'Sign In (Client)')}</h1>
        
        {showConfirmation && (
          <div className="mb-4 text-sm bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded">
            Please check your inbox for a confirmation link.
            <Button variant="link" onClick={handleResend} className="ml-1 p-0 h-auto align-middle text-yellow-900">Resend</Button>
          </div>
        )}

        {/* Google Sign In Button */}
        {!showForgot && (
          <div className="mb-4">
            <Button 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 py-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="px-2 text-gray-500 text-sm">or</span>
              <Separator className="flex-1" />
            </div>
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
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <select {...field} className="block w-full rounded border border-input py-2 px-3 bg-background text-sm">
                      <option value="registered">Registered Company</option>
                      <option value="non-registered">Non-Registered Company</option>
                    </select>
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

export default ClientAuth;
