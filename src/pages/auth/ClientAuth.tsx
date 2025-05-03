
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  country: z.string().min(2, { message: 'Country must be at least 2 characters.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ClientAuth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      country: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Successfully logged in! Welcome back.');
    } catch (error) {
      toast.error('An error occurred during login');
    }
  }

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            company: values.company,
            country: values.country
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        toast.success('Registration successful! Please check your email to confirm your account.');
        setIsRegister(false);
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  }

  return (
    <div className="relative min-h-screen py-16">
      {/* Background video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 to-brand-blue/90 z-10"></div>
        <video 
          className="absolute min-w-full min-h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470"
        >
          <source src="https://cdn.coverr.co/videos/coverr-international-business-handshake-7267/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden">
            <div className="bg-brand-blue p-8 text-white text-center">
              <h1 className="text-3xl font-bold">
                {isRegister ? 'Create Client Account' : 'Welcome Back, Client!'}
              </h1>
              <p className="mt-2 text-white/80">
                {isRegister 
                  ? 'Join thousands of global buyers sourcing quality products from India.'
                  : 'Sign in to access your personalized buying experience.'}
              </p>
            </div>
            
            <div className="p-8">
              {isRegister ? (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
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
                    
                    <FormField
                      control={registerForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
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
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                      Create Account
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@company.com" {...field} />
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
                          <div className="text-right">
                            <a href="#" className="text-sm text-brand-teal hover:underline">
                              Forgot Password?
                            </a>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">
                      Sign In
                    </Button>
                  </form>
                </Form>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="ml-1 text-brand-teal hover:underline font-medium"
                  >
                    {isRegister ? 'Sign In' : 'Register Now'}
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-white">
              Looking to showcase your products?
              <a href="/auth/manufacturer" className="ml-1 text-white hover:underline font-medium">
                Sign in as Manufacturer
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAuth;
