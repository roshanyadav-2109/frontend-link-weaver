
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const registerSchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  contactName: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  productCategory: z.string().min(2, { message: 'Please select a product category.' }),
  gstin: z.string().min(15).max(15, { message: 'GSTIN must be exactly 15 characters.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ManufacturerAuth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const { signInWithGoogle, isAuthenticated, isAdmin, loading, resendConfirmationEmail } = useAuth();
  const navigate = useNavigate();
  const [emailForConfirmation, setEmailForConfirmation] = useState<string | null>(null);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/manufacturer/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

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
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      productCategory: '',
      gstin: '',
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
        if (error.message === "Email not confirmed") {
          setEmailForConfirmation(values.email);
          setShowConfirmationMessage(true);
          toast.error("Please confirm your email before signing in.");
        } else {
          toast.error(error.message);
        }
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
            full_name: values.contactName,
            company: values.companyName,
            gstin: values.gstin,
            phone: values.phone,
            address: values.address,
            product_category: values.productCategory,
            user_type: 'manufacturer'
          }
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      if (data.user) {
        setEmailForConfirmation(values.email);
        setShowConfirmationMessage(true);
        toast.success('Registration submitted! Please check your email to confirm your account.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    }
  }

  const handleResendConfirmation = async () => {
    if (emailForConfirmation) {
      await resendConfirmationEmail(emailForConfirmation);
    }
  };

  const productCategories = [
    'Agriculture & Food Products',
    'Textiles & Fabrics',
    'Electronics & Components',
    'Handicrafts & Decor',
    'Leather Products',
    'Chemicals & Pharmaceuticals',
    'Other'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#f0f4f8] to-[#d0e0f2]">
      {/* Left side - Authentication Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-premium-blue overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2d507a] p-8 text-white text-center">
              <h1 className="text-3xl font-bold">
                {isRegister ? 'Register as Manufacturer' : 'Welcome Back, Manufacturer!'}
              </h1>
              <p className="mt-2 text-white/80">
                {isRegister 
                  ? 'Showcase your products to global buyers through our platform.'
                  : 'Sign in to manage your product listings and orders.'}
              </p>
            </div>
            
            <div className="p-8">
              {showConfirmationMessage && (
                <Alert className="mb-6 border-amber-300 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-700" />
                  <AlertTitle className="text-amber-700">Email confirmation required</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Please check your inbox for the confirmation email. If you didn't receive it, you can 
                    <Button 
                      variant="link" 
                      onClick={handleResendConfirmation}
                      className="p-0 h-auto text-amber-700 font-semibold mx-1 underline"
                    >
                      resend the confirmation email
                    </Button>
                    to {emailForConfirmation}.
                  </AlertDescription>
                </Alert>
              )}

              {isRegister ? (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Manufacturing Company Ltd." {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@company.com" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 98765 43210" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Business Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Manufacturing St, City, State, India" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
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
                          <FormLabel className="text-gray-700 flex items-center">
                            GSTIN Number <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="15-digit GSTIN" 
                              {...field} 
                              className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" 
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="productCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Primary Product Category</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              <option value="">Select a category</option>
                              {productCategories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
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
                            <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069] text-white">
                      Register as Manufacturer
                    </Button>
                  </form>
                </Form>
              ) : (
                <>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="company@example.com" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
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
                            <FormLabel className="text-gray-700">Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="border-gray-300 focus:border-blue-400 focus:ring-blue-300" />
                            </FormControl>
                            <FormMessage />
                            <div className="text-right">
                              <a href="#" className="text-sm text-[#2d6da3] hover:underline">
                                Forgot Password?
                              </a>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d507a] hover:from-[#1a365d] hover:to-[#234069] text-white">
                        Sign In
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full border-gray-300 hover:bg-gray-50 transition-all"
                        onClick={() => signInWithGoogle()}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign in with Google
                      </Button>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="ml-1 text-[#2d6da3] hover:underline font-medium"
                  >
                    {isRegister ? 'Sign In' : 'Register Now'}
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-700">
              Looking to source products?
              <a href="/auth/client" className="ml-1 text-[#2d6da3] hover:underline font-medium">
                Sign in as Client
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Video */}
      <div className="md:w-1/2 relative overflow-hidden">
        {/* Background overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d]/60 to-[#2d507a]/60 z-10"></div>
        
        <video 
          className="absolute w-full h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1661956602153-23384936a1d3?q=80&w=1740"
        >
          <source src="https://cdn.coverr.co/videos/coverr-global-business-3118/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Content overlay on the video */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 p-8">
          <div className="bg-[#1a365d]/50 backdrop-blur-sm p-8 rounded-2xl shadow-premium max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4">Showcase Your Products Globally</h2>
            <p className="text-white/90 text-lg">
              Join our network of trusted manufacturers and reach international buyers looking for quality products from India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerAuth;
